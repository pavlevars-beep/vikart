import type { PriceBreakdown, PriceCalculationParams, PricingModel, PricingTier } from '@/types';

const DEFAULT_DEPOSIT_PERCENT = 30;

function pickTier(tiers: PricingTier[] | undefined, units: number): PricingTier | undefined {
  if (!tiers || tiers.length === 0) return undefined;
  return tiers.find((tier) => units >= tier.minUnits && (tier.maxUnits === null || tier.maxUnits === undefined || units <= tier.maxUnits));
}

function seasonalBasePrice(model: PricingModel, date: string | undefined): number {
  if (!date || !model.seasonalPrices || model.seasonalPrices.length === 0) return model.basePrice;
  const target = new Date(date);
  const match = model.seasonalPrices.find((s) => target >= new Date(s.startDate) && target <= new Date(s.endDate));
  return match ? match.priceOverride : model.basePrice;
}

function bestGroupDiscount(model: PricingModel, groupSize: number, amount: number): { label: string; amount: number } | null {
  if (!model.groupDiscounts || model.groupDiscounts.length === 0) return null;
  const eligible = model.groupDiscounts.filter((d) => groupSize >= d.minGroupSize);
  if (eligible.length === 0) return null;
  const best = eligible.reduce((a, b) => (a.minGroupSize >= b.minGroupSize ? a : b));
  const discountAmount = best.discountType === 'procenat' ? amount * (best.discountValue / 100) : best.discountValue;
  return { label: best.label, amount: -Math.round(discountAmount) };
}

/**
 * Izračunava razumljiv, provereni breakdown cene za jednu PartnerOffer ponudu.
 * Nikad ne uključuje `costPrice`/`marginNote` — to su interna polja koja se
 * čitaju direktno sa `model` samo u admin prikazu, nikad ovde.
 */
export function calculatePrice(model: PricingModel, params: PriceCalculationParams): PriceBreakdown {
  const currency = model.currency;
  const depositPercent = params.depositPercent ?? DEFAULT_DEPOSIT_PERCENT;
  const groupSize = Math.max(1, params.groupSize || 1);
  const lines: PriceBreakdown['lines'] = [];

  if (model.unit === 'na_upit') {
    return { onRequest: true, baseAmount: 0, lines: [], totalAmount: 0, currency, depositPercent, depositAmount: 0, remainingAmount: 0 };
  }

  const unitBasePrice = seasonalBasePrice(model, params.date);
  let baseAmount = 0;
  let perPersonAmount: number | undefined;

  switch (model.unit) {
    case 'fiksna':
    case 'po_grupi':
    case 'po_terminu':
      baseAmount = unitBasePrice;
      break;
    case 'po_osobi': {
      const tier = pickTier(model.tiers, groupSize);
      const rate = tier ? tier.pricePerUnit : unitBasePrice;
      baseAmount = rate * groupSize;
      perPersonAmount = rate;
      break;
    }
    case 'po_detetu': {
      const children = params.childCount ?? 0;
      const adults = Math.max(0, groupSize - children);
      baseAmount = unitBasePrice * children + (model.extraPersonSurcharge ?? 0) * adults;
      break;
    }
    case 'po_paru':
      baseAmount = unitBasePrice * Math.ceil(groupSize / 2);
      break;
    case 'po_sobi':
      baseAmount = unitBasePrice;
      break;
    case 'po_nocenju':
      baseAmount = unitBasePrice * (params.nights ?? 1);
      break;
    case 'po_satu':
      baseAmount = unitBasePrice * (params.hours ?? 1);
      break;
    case 'po_vozilu': {
      const capacityPerUnit = model.capacityPerUnit ?? groupSize;
      const vehicles = params.vehicles ?? Math.max(1, Math.ceil(groupSize / Math.max(1, capacityPerUnit)));
      const tier = pickTier(model.tiers, groupSize);
      const rate = tier ? tier.pricePerUnit : unitBasePrice;
      baseAmount = rate * vehicles;
      lines.push({ label: `${vehicles} ${vehicles === 1 ? 'vozilo' : 'vozila'} × ${rate.toLocaleString('sr-RS')} ${currency}`, amount: 0 });
      break;
    }
    case 'kombinovano':
      baseAmount = (model.combinedFixedPart ?? 0) + unitBasePrice * groupSize;
      perPersonAmount = unitBasePrice;
      break;
    default:
      baseAmount = unitBasePrice;
  }

  if (model.promoPrice !== undefined && model.promoPrice < baseAmount) {
    lines.push({ label: 'Promotivna cena', amount: model.promoPrice - baseAmount });
    baseAmount = model.promoPrice;
  }

  if (params.privateTour && model.privateTourSurcharge) {
    lines.push({ label: 'Privatna tura (doplata)', amount: model.privateTourSurcharge });
  }

  const selectedAddOns = (model.addOns ?? []).filter((a) => params.selectedAddOnIds?.includes(a.id));
  for (const addOn of selectedAddOns) {
    lines.push({ label: addOn.name, amount: addOn.priceValue });
  }

  const preDiscountTotal = baseAmount + lines.reduce((sum, l) => sum + l.amount, 0);
  const discount = bestGroupDiscount(model, groupSize, preDiscountTotal);
  if (discount) lines.push({ label: discount.label, amount: discount.amount });

  const totalAmount = Math.max(0, baseAmount + lines.reduce((sum, l) => sum + l.amount, 0));
  const depositAmount = Math.round((totalAmount * depositPercent) / 100);
  const remainingAmount = totalAmount - depositAmount;

  return {
    onRequest: false,
    baseAmount,
    lines,
    totalAmount,
    currency,
    perPersonAmount,
    depositPercent,
    depositAmount,
    remainingAmount,
  };
}
