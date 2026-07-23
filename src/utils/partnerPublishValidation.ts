import type { Partner, PartnerOffer } from '@/types';

export const PUBLISH_CHECKLIST_SIZE = 9;

/**
 * Provera pre objavljivanja — partner se ne sme objaviti dok nedostaju
 * obavezni podaci. Vraća listu čitljivih razloga (prazna lista = spreman za objavu).
 */
export function getPublishBlockers(partner: Partner, offers: PartnerOffer[]): string[] {
  const blockers: string[] = [];
  if (!partner.name.trim()) blockers.push('Nedostaje naziv partnera.');
  if (partner.categories.length === 0) blockers.push('Nedostaje bar jedna kategorija.');
  if (!partner.contact.phone && !partner.contact.email) blockers.push('Nedostaje kontakt podatak (telefon ili email).');
  if (!partner.media.mainPhoto?.src) blockers.push('Nedostaje glavna fotografija.');
  if (!partner.oneLiner.trim()) blockers.push('Nedostaje kratak opis (jedna rečenica).');
  if (!partner.location.area.trim()) blockers.push('Nedostaje lokacija.');

  const activeOffers = offers.filter((o) => o.lifecycleStatus === 'active');
  if (activeOffers.length === 0) {
    blockers.push('Nedostaje bar jedna aktivna ponuda.');
  } else {
    for (const offer of activeOffers) {
      const hasPrice = offer.pricingModel.unit === 'na_upit' || offer.pricingModel.basePrice > 0;
      if (!hasPrice) blockers.push(`Ponuda „${offer.name}" nema definisanu cenu niti status „cena na upit".`);
      if (offer.inclusions.length === 0) blockers.push(`Ponuda „${offer.name}" nema listu uključenog.`);
      if (offer.exclusions.length === 0) blockers.push(`Ponuda „${offer.name}" nema listu neuključenog.`);
      if (!offer.cancellation.freeUntilLabel.trim()) blockers.push(`Ponuda „${offer.name}" nema pravila otkazivanja.`);
    }
  }

  return blockers;
}

export function getCompletenessPercent(partner: Partner, offers: PartnerOffer[]): number {
  const blockers = getPublishBlockers(partner, offers);
  const done = Math.max(0, PUBLISH_CHECKLIST_SIZE - blockers.length);
  return Math.round((done / PUBLISH_CHECKLIST_SIZE) * 100);
}
