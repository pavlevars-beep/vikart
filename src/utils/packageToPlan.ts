import type { GeneratedPlan, Package } from '@/types';
import { getAccommodationById } from '@/data/accommodations';
import { getExperienceById } from '@/data/experiences';
import { buildItinerary, planAvailability, DEFAULT_EXCLUDED } from './planGenerator';

export function packageToPlan(pkg: Package): GeneratedPlan {
  const accommodation = getAccommodationById(pkg.accommodationId);
  if (!accommodation) throw new Error(`Nepoznat smeštaj za paket ${pkg.slug}`);

  const selectedExperiences = pkg.experienceIds
    .map((id) => getExperienceById(id))
    .filter((exp): exp is NonNullable<typeof exp> => Boolean(exp));

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
    excluded: [...DEFAULT_EXCLUDED],
    availability: planAvailability(selectedExperiences),
    badWeatherAlternative:
      'Ukoliko vreme ne bude pogodno za spoljne aktivnosti, predlažemo zamenu za wellness termin, degustaciju ili obilazak Stopića pećine — sve u indoor okruženju.',
  };
}
