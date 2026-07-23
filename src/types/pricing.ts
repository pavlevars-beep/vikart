export type Currency = 'RSD' | 'EUR';

export type PricingUnit =
  | 'fiksna'
  | 'po_osobi'
  | 'po_detetu'
  | 'po_paru'
  | 'po_sobi'
  | 'po_nocenju'
  | 'po_vozilu'
  | 'po_grupi'
  | 'po_satu'
  | 'po_terminu'
  | 'kombinovano'
  | 'na_upit';

export interface PricingTier {
  id: string;
  minUnits: number;
  maxUnits: number | null;
  pricePerUnit: number;
  label?: string;
}

export type SeasonScope = 'sve-dane' | 'radni-dan' | 'vikend' | 'praznik';

export interface SeasonalPrice {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  priceOverride: number;
  appliesTo: SeasonScope;
}

export interface GroupDiscount {
  id: string;
  minGroupSize: number;
  discountType: 'procenat' | 'fiksno';
  discountValue: number;
  label: string;
}

export interface PriceAddOn {
  id: string;
  name: string;
  priceValue: number;
  unit: PricingUnit;
}

/**
 * Fleksibilan model cene za jednu PartnerOffer ponudu. Polja `costPrice` i
 * `marginNote` su isključivo interna — nikad se ne prikazuju u javnom UI-ju
 * niti ulaze u javni API payload.
 */
export interface PricingModel {
  unit: PricingUnit;
  currency: Currency;
  basePrice: number;
  minBillableUnits?: number;
  maxCapacity?: number;
  /** Broj osoba po jedinici (npr. po vozilu) — koristi se za izračun broja jedinica iz veličine grupe. */
  capacityPerUnit?: number;
  tiers?: PricingTier[];
  seasonalPrices?: SeasonalPrice[];
  groupDiscounts?: GroupDiscount[];
  addOns?: PriceAddOn[];
  extraPersonSurcharge?: number;
  minVehicles?: number;
  maxVehicles?: number;
  privateTourSurcharge?: number;
  /** Fiksni deo kombinovane cene; koristi se uz `basePrice` kao cenu po osobi kada je unit 'kombinovano'. */
  combinedFixedPart?: number;
  validFrom?: string;
  validTo?: string;
  promoPrice?: number;
  /** INTERNO — nabavna cena za VikArt, nikad javno. */
  costPrice?: number;
  /** INTERNO — napomena o marži, nikad javno. */
  marginNote?: string;
}

export interface PriceBreakdownLine {
  label: string;
  amount: number;
}

export interface PriceCalculationParams {
  groupSize: number;
  childCount?: number;
  nights?: number;
  hours?: number;
  vehicles?: number;
  date?: string;
  selectedAddOnIds?: string[];
  privateTour?: boolean;
  depositPercent?: number;
}

export interface PriceBreakdown {
  onRequest: boolean;
  baseAmount: number;
  lines: PriceBreakdownLine[];
  totalAmount: number;
  currency: Currency;
  perPersonAmount?: number;
  depositPercent: number;
  depositAmount: number;
  remainingAmount: number;
}
