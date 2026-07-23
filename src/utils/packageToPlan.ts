import type { GeneratedPlan, Package } from '@/types';
import { getPartnerById } from '@/data/partners';
import { getPartnerOfferById } from '@/data/partnerOffers';
import { getExperienceById } from '@/data/experiences';
import { buildItinerary, planAvailability, DEFAULT_EXCLUDED } from './planGenerator';

export function packageToPlan(pkg: Package): GeneratedPlan {
  const accommodation = getPartnerById(pkg.accommodationId);
  if (!accommodation) throw new Error(`Nepoznat smeštaj za paket ${pkg.slug}`);

  const selectedExperiences = pkg.experienceIds
    .map((id) => getExperienceById(id))
    .filter((exp): exp is NonNullable<typeof exp> => Boolean(exp));

  const excluded = [...DEFAULT_EXCLUDED];
  const addOns: string[] = [];
  const pendingConfirmation: string[] = [];
  for (const exp of selectedExperiences) {
    const offer = getPartnerOfferById(exp.offerId);
    if (!offer) continue;
    for (const item of offer.exclusions) {
      const label = `${item.label}${item.detail ? ` — ${item.detail}` : ''}`;
      if (!excluded.includes(label)) excluded.push(label);
    }
    for (const addOn of offer.addOns) {
      const label = `${addOn.name} — ${addOn.priceLabel}`;
      if (!addOns.includes(label)) addOns.push(label);
    }
    if (offer.status === 'pending_confirmation' || offer.status === 'available_on_request') {
      pendingConfirmation.push(`${exp.name} — cena i termin se potvrđuju pre prihvatanja plana`);
    }
  }

  return {
    id: pkg.slug,
    tier: 'preporuka',
    title: pkg.name,
    reason: pkg.shortDescription,
    totalPrice: pkg.priceFromValue,
    pricePerPerson: Math.round(pkg.priceFromValue / pkg.participantsCount),
    nights: pkg.nights,
    groupSize: pkg.participantsCount,
    accommodation,
    experiences: selectedExperiences,
    days: buildItinerary(selectedExperiences, pkg.nights, 'uravnotezeno'),
    included: [`${pkg.nights} noćenja u smeštaju „${accommodation.name}"`, ...pkg.highlights],
    excluded,
    addOns,
    pendingConfirmation,
    availability: planAvailability(selectedExperiences),
    badWeatherAlternative:
      'Ukoliko vreme ne bude pogodno za spoljne aktivnosti, predlažemo zamenu za wellness termin, degustaciju ili obilazak Stopića pećine — sve u indoor okruženju.',
  };
}
