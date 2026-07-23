import type { GeneratedPlan, BookingSnapshot, BookingSnapshotItem } from '@/types';
import { getPartnerById } from '@/services/partnersStore';
import { getPartnerOfferById } from '@/services/partnerOffersStore';
import { calculatePrice } from './pricing';

/**
 * Snimak ugovorenih uslova u trenutku prihvatanja ponude — kasnija izmena
 * aktivne PartnerOffer ponude ili Partner zapisa NIKAD ne menja ovaj snapshot.
 */
export function buildBookingSnapshot(plan: GeneratedPlan): BookingSnapshot {
  const accommodation: BookingSnapshotItem = {
    partnerId: plan.accommodation.id,
    partnerName: plan.accommodation.name,
    offerId: '',
    offerName: 'Smeštaj',
    inclusions: [plan.included[0] ?? `${plan.nights} noćenja u smeštaju „${plan.accommodation.name}"`],
    exclusions: [],
    addOns: [],
    mainPhoto: plan.accommodation.media.mainPhoto,
  };

  const experiences: BookingSnapshotItem[] = plan.experiences.map((exp) => {
    const offer = getPartnerOfferById(exp.offerId);
    const partner = getPartnerById(exp.partnerId);
    return {
      partnerId: exp.partnerId,
      partnerName: partner?.name ?? exp.partnerId,
      offerId: exp.offerId,
      offerName: offer?.name ?? exp.name,
      priceBreakdown: offer ? calculatePrice(offer.pricingModel, { groupSize: plan.groupSize }) : undefined,
      inclusions: offer?.inclusions.map((i) => i.label) ?? [],
      exclusions: offer?.exclusions.map((e) => e.label) ?? [],
      addOns: offer?.addOns.map((a) => `${a.name} — ${a.priceLabel}`) ?? [],
      cancellationPolicy: offer?.cancellation,
      mainPhoto: partner?.media.mainPhoto,
    };
  });

  return {
    createdAt: new Date().toISOString(),
    accommodation,
    experiences,
    totalPrice: plan.totalPrice,
    currency: 'RSD',
  };
}
