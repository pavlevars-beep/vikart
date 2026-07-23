import type {
  ConfiguratorAnswers,
  Experience,
  ExperienceCategory,
  GeneratedPlan,
  ItineraryDay,
  ItineraryItem,
  PlanTier,
  AvailabilityLevel,
  WantKey,
  FeelingKey,
  PaceKey,
} from '@/types';
import { experiences } from '@/data/experiences';
import { partners, getPartnerById } from '@/data/partners';
import { getPartnerOfferById } from '@/data/partnerOffers';
import { budgetMidpoints } from './labels';
import { readStorage, storageKeys } from './storage';

export const DEFAULT_EXCLUDED = [
  'Prevoz do Zlatibora',
  'Obroci i slobodno vreme van navedenih iskustava — organizujete samostalno',
  'Dodatna pića i lične potrošnje van dogovorenog programa',
  'Osiguranje',
];

const WANT_TO_EXPERIENCE_IDS: Record<WantKey, string[]> = {
  'spa-masaza': ['masaza-za-dvoje', 'privatni-wellness-termin'],
  'vecera-gastronomija': [
    'romanticna-vecera',
    'degustacija-domacih-specijaliteta',
    'rostilj-domaca-kuhinja',
    'autentican-obrok-domacinstvo',
    'vecera-uz-zivu-muziku',
  ],
  'kvad-offroad': ['voznja-kvadovima'],
  'ebike-priroda': [
    'ebike-tura-tornik',
    'panoramska-setnja-vidikovci',
    'gostiljski-vodopad',
    'ribnicko-jezero-setnja',
  ],
  jahanje: ['jahanje'],
  'streljana-paintball': ['streljana-i-paintball'],
  'ziva-muzika': ['vecera-uz-zivu-muziku', 'druzenje-uz-vatru'],
  fotografisanje: ['fotografisanje-para'],
  'cvece-dekoracija': ['dekoracija-sobe-cvece'],
  'tradicionalno-domacinstvo': ['autentican-obrok-domacinstvo', 'sirogojno-muzej'],
};

const FEELING_TO_CATEGORY: Record<FeelingKey, ExperienceCategory[]> = {
  opusteno: ['priroda', 'wellness'],
  romanticno: ['romantika'],
  uzbudljivo: ['avantura'],
  razmazeno: ['wellness', 'romantika'],
  povezano: ['gastronomija', 'nocni-provod'],
  veselo: ['nocni-provod', 'avantura'],
  autenticno: ['kultura'],
};

const DINNER_IDS = new Set([
  'romanticna-vecera',
  'rostilj-domaca-kuhinja',
  'degustacija-domacih-specijaliteta',
  'autentican-obrok-domacinstvo',
  'vecera-uz-zivu-muziku',
]);

const PACE_COUNTS: Record<PaceKey, { 'pametan-izbor': number; preporuka: number; premium: number }> = {
  lagano: { 'pametan-izbor': 2, preporuka: 3, premium: 4 },
  uravnotezeno: { 'pametan-izbor': 2, preporuka: 4, premium: 5 },
  'pun-program': { 'pametan-izbor': 3, preporuka: 5, premium: 6 },
};

const AVAILABILITY_RANK: Record<AvailabilityLevel, number> = {
  'brza-potvrda': 0,
  'potrebna-provera': 1,
  'concierge-zahtev': 2,
};

function scoreExperience(exp: Experience, answers: ConfiguratorAnswers): number {
  let score = 0;
  const wantedIds = new Set(answers.wants.flatMap((w) => WANT_TO_EXPERIENCE_IDS[w]));
  if (wantedIds.has(exp.id)) score += 5;

  const catalogPicks = readStorage<string[]>(storageKeys.catalogPicks) ?? [];
  if (catalogPicks.includes(exp.id)) score += 8;

  const wantedCategories = new Set(answers.feelings.flatMap((f) => FEELING_TO_CATEGORY[f]));
  if (wantedCategories.has(exp.category)) score += 2;

  if (answers.occasion === 'godisnjica-rodjendan' && (exp.category === 'romantika' || exp.id === 'tajno-iznenadjenje-prosidba' || exp.id === 'diskretna-proslava-rodjendana')) {
    score += 3;
  }
  if (answers.occasion === 'momacko-devojacko' && (exp.category === 'nocni-provod' || exp.category === 'avantura')) {
    score += 3;
  }
  if (answers.occasion === 'vikend-sa-ekipom' && exp.suitableFor.includes('drustvo')) {
    score += 2;
  }
  if (answers.occasion === 'romanticni-vikend' && exp.category === 'romantika') {
    score += 3;
  }
  return score;
}

function isEligible(exp: Experience, answers: ConfiguratorAnswers): boolean {
  const groupSize = answers.groupSize || 2;
  if (exp.minParticipants > groupSize) return false;
  const needsPar = answers.travelerType === 'par';
  if (needsPar && !exp.suitableFor.includes('par')) return false;
  if (!needsPar && !exp.suitableFor.includes('drustvo')) return false;
  if (exp.availability === 'concierge-zahtev' && exp.category === 'iznenadjenja') {
    // concierge iznenađenja se uključuju samo kad je to eksplicitno relevantno
    const relevantOccasion = answers.occasion === 'godisnjica-rodjendan' || answers.occasion === 'momacko-devojacko';
    const relevantWant = answers.specialRequest.toLowerCase().includes('iznenađ') || answers.specialRequest.toLowerCase().includes('prosidb');
    if (!relevantOccasion && !relevantWant) return false;
  }
  return true;
}

function rankedCandidates(answers: ConfiguratorAnswers): Experience[] {
  return experiences
    .filter((exp) => isEligible(exp, answers))
    .map((exp) => ({ exp, score: scoreExperience(exp, answers) }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.exp);
}

function pickAccommodationId(tier: PlanTier, groupSize: number): string {
  if (groupSize > 4) return 'zlatibor-house';
  if (groupSize > 2) return 'vila-panorama';
  return tier === 'premium' ? 'vila-panorama' : 'apartman-cigota';
}

const TIER_BUDGET_MULTIPLIER: Record<PlanTier, number> = {
  'pametan-izbor': 0.72,
  preporuka: 1,
  premium: 1.4,
};

const MIN_NIGHTLY_RATE: Record<PlanTier, number> = {
  'pametan-izbor': 5000,
  preporuka: 7000,
  premium: 11000,
};

/**
 * Cena smeštaja se računa unazad od ciljnog budžeta (ako je korisnik izabrao budžet),
 * tako da ukupna procena plana realno prati ono što je korisnik naveo — pametan izbor
 * ispod, VikArt preporuka oko, a premium iznad izabranog budžeta.
 */
function computeAccommodationCost(tier: PlanTier, answers: ConfiguratorAnswers, experiencesCost: number): number {
  const nights = answers.nights || 2;
  const groupSize = answers.groupSize || 2;
  const groupSurcharge = groupSize > 2 ? (groupSize - 2) * 1200 * nights : 0;
  const floor = MIN_NIGHTLY_RATE[tier] * nights + groupSurcharge;

  if (!answers.budget) return floor;

  const target = budgetMidpoints[answers.budget] * TIER_BUDGET_MULTIPLIER[tier];
  return Math.max(floor, target - experiencesCost);
}

function experienceCost(exp: Experience, groupSize: number): number {
  if (exp.priceUnit === 'po_osobi') return exp.priceFrom * groupSize;
  return exp.priceFrom;
}

export function planAvailability(selected: Experience[]): AvailabilityLevel {
  let worst: AvailabilityLevel = 'brza-potvrda';
  for (const exp of selected) {
    if (AVAILABILITY_RANK[exp.availability] > AVAILABILITY_RANK[worst]) worst = exp.availability;
  }
  return worst;
}

/**
 * Raspored prikazuje ISKLJUČIVO stvarno uključena iskustva iz plana — nema generičkih
 * stavki tipa "Doručak" ili "Ručak" koje bi mogle da deluju kao da su deo ponude kad
 * zapravo nisu. Stavke su označene kao `usluga` (ima konkretnog partnera — dolazak,
 * prijava, checkout i slobodno vreme ostaju `logistika`, bez izmišljenog partnera.
 */
export function buildItinerary(selected: Experience[], nights: number, pace: PaceKey): ItineraryDay[] {
  const dayNames = ['Petak', 'Subota', 'Nedelja', 'Ponedeljak', 'Utorak'].slice(0, nights + 1);
  const pool = [...selected];

  const takeByPredicate = (predicate: (exp: Experience) => boolean): Experience | undefined => {
    const idx = pool.findIndex(predicate);
    if (idx === -1) return undefined;
    return pool.splice(idx, 1)[0];
  };

  const takeAny = (): Experience | undefined => pool.shift();

  const toItem = (time: string, exp: Experience): ItineraryItem => ({
    time,
    title: exp.name,
    description: exp.shortDescription,
    experienceId: exp.id,
    kind: 'usluga',
  });

  const logisticsItem = (time: string, title: string, icon: string, description?: string): ItineraryItem => ({
    time,
    title,
    description,
    kind: 'logistika',
    icon,
  });

  const days: ItineraryDay[] = [];

  // Dan dolaska
  const arrivalItems: ItineraryItem[] = [logisticsItem('17:00', 'Dolazak i prijava', 'DoorOpen')];
  const welcomeExp = takeByPredicate((e) => e.id === 'dekoracija-sobe-cvece');
  if (welcomeExp) arrivalItems.push(toItem('18:00', welcomeExp));
  const dinnerExp = takeByPredicate((e) => DINNER_IDS.has(e.id));
  if (dinnerExp) arrivalItems.push(toItem('20:30', dinnerExp));
  days.push({ dayLabel: dayNames[0], items: arrivalItems });

  // Puni dani — samo onoliko stavki koliko ima stvarno uključenih iskustava
  const activityCount = pace === 'lagano' ? 1 : pace === 'pun-program' ? 3 : 2;
  const slotTimes = ['10:00', '14:30', '18:00'];
  for (let day = 1; day < nights; day += 1) {
    const items: ItineraryItem[] = [];
    for (let slot = 0; slot < activityCount; slot += 1) {
      const isLastSlotOfLastFullDay = day === nights - 1 && slot === activityCount - 1;
      const exp = isLastSlotOfLastFullDay
        ? (takeByPredicate((e) => e.category === 'nocni-provod') ?? takeAny())
        : takeAny();
      if (exp) items.push(toItem(slotTimes[slot], exp));
    }
    if (items.length === 0) {
      items.push(logisticsItem('—', 'Slobodan dan', 'Coffee', 'Tempo i sadržaj ovog dana birate sami.'));
    }
    days.push({ dayLabel: dayNames[day], items });
  }

  // Dan odlaska
  const lastActivity = takeByPredicate((e) => e.category === 'priroda' || e.category === 'kultura') ?? takeAny();
  const departureItems: ItineraryItem[] = [];
  if (lastActivity) departureItems.push(toItem('10:00', lastActivity));
  departureItems.push(logisticsItem('13:00', 'Kasni checkout i povratak', 'LogOut'));
  days.push({ dayLabel: dayNames[nights] ?? `Dan ${nights + 1}`, items: departureItems });

  // Preostala iskustva koja nisu stigla u raspored dodajemo na prvi pun dan (ili dan dolaska ako nema punih dana)
  const fullDayIndex = nights > 1 ? 1 : 0;
  while (pool.length > 0) {
    const leftover = takeAny();
    if (!leftover) break;
    const targetDay = days[fullDayIndex];
    const withoutFallback = targetDay.items.filter((item) => item.experienceId || item.title !== 'Slobodan dan');
    targetDay.items = [...withoutFallback, toItem('—', leftover)];
  }

  return days;
}

function planReason(tier: PlanTier, answers: ConfiguratorAnswers, selected: Experience[]): string {
  const feelingsText = answers.feelings.map((f) => f).join(', ');
  const groupText =
    answers.travelerType === 'par'
      ? 'vas dvoje'
      : answers.travelerType
        ? `vaše društvo od ${answers.groupSize || 2}`
        : 'vašu grupu';

  if (tier === 'pametan-izbor') {
    return `Pažljivo odabrane osnove za ${groupText} (${selected.length} ${selected.length === 1 ? 'iskustvo' : 'iskustva'}) — bez nepotrebnih dodataka, ali sa svime što nosi najviše vrednosti za vaš budžet.`;
  }
  if (tier === 'premium') {
    return `Najbogatija verzija plana za ${groupText} (${selected.length} iskustava), sa dodatnim wellness i romantičnim detaljima za osećaj potpune razmaženosti.`;
  }
  return `Naš predlog balansa za ${groupText}: dovoljno iskustava da vikend bude potpun, bez pretrpanog rasporeda${
    feelingsText ? ` — u duhu koji ste opisali kao ${feelingsText}` : ''
  }.`;
}

/**
 * Uključeno/nije uključeno/dodatno se izvode iz stvarnih PartnerOffer podataka
 * svakog izabranog iskustva — nikad iz uopštenih rečenica.
 */
function describeInclusionsAndExclusions(selected: Experience[], accommodationName: string, nights: number) {
  const included: string[] = [`${nights} noćenja u smeštaju „${accommodationName}"`];
  const excluded: string[] = [...DEFAULT_EXCLUDED];
  const addOns: string[] = [];
  const pendingConfirmation: string[] = [];

  for (const exp of selected) {
    const offer = getPartnerOfferById(exp.offerId);
    const partner = getPartnerById(exp.partnerId);
    const partnerLabel = partner ? ` (${partner.name})` : '';
    included.push(`${exp.name}${partnerLabel}`);
    if (offer) {
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
  }

  included.push('Koordinacija celog rasporeda od strane VikArt tima');
  return { included, excluded, addOns, pendingConfirmation };
}

function buildPlan(tier: PlanTier, answers: ConfiguratorAnswers): GeneratedPlan {
  const groupSize = answers.groupSize || 2;
  const nights = answers.nights || 2;
  const pace: PaceKey = answers.pace ?? 'uravnotezeno';

  const candidates = rankedCandidates(answers);
  const count = Math.min(PACE_COUNTS[pace][tier], candidates.length);
  const selected = candidates.slice(0, count);

  const accommodation = getPartnerById(pickAccommodationId(tier, groupSize)) ?? partners.find((p) => p.categories.includes('smestaj'))!;
  const experiencesCost = selected.reduce((sum, exp) => sum + experienceCost(exp, groupSize), 0);
  const accommodationCostValue = computeAccommodationCost(tier, answers, experiencesCost);
  const totalPrice = accommodationCostValue + experiencesCost;

  const days = buildItinerary(selected, nights, pace);
  const { included, excluded, addOns, pendingConfirmation } = describeInclusionsAndExclusions(selected, accommodation.name, nights);

  return {
    id: `${tier}-${Date.now()}`,
    tier,
    title: tier === 'pametan-izbor' ? 'Pametan izbor' : tier === 'preporuka' ? 'VikArt preporuka' : 'Premium verzija',
    reason: planReason(tier, answers, selected),
    totalPrice,
    pricePerPerson: Math.round(totalPrice / groupSize),
    nights,
    groupSize,
    accommodation,
    experiences: selected,
    days,
    included,
    excluded,
    addOns,
    pendingConfirmation,
    availability: planAvailability(selected),
    badWeatherAlternative:
      'Ukoliko vreme ne bude pogodno za spoljne aktivnosti, predlažemo zamenu za wellness termin, degustaciju ili obilazak Stopića pećine — sve u indoor okruženju.',
  };
}

export function generatePlans(answers: ConfiguratorAnswers): GeneratedPlan[] {
  return [
    buildPlan('pametan-izbor', answers),
    buildPlan('preporuka', answers),
    buildPlan('premium', answers),
  ];
}

export function swapExperience(
  plan: GeneratedPlan,
  oldExperienceId: string,
  answers: ConfiguratorAnswers,
): GeneratedPlan {
  const candidates = rankedCandidates(answers).filter(
    (exp) => !plan.experiences.some((selected) => selected.id === exp.id),
  );
  const replacement = candidates[0];
  const newExperiences = plan.experiences.map((exp) => (exp.id === oldExperienceId ? replacement ?? exp : exp));
  return recomputePlan(plan, newExperiences, answers);
}

export function removeExperience(plan: GeneratedPlan, experienceId: string, answers: ConfiguratorAnswers): GeneratedPlan {
  const newExperiences = plan.experiences.filter((exp) => exp.id !== experienceId);
  return recomputePlan(plan, newExperiences, answers);
}

export function addExperience(plan: GeneratedPlan, experience: Experience, answers: ConfiguratorAnswers): GeneratedPlan {
  if (plan.experiences.some((exp) => exp.id === experience.id)) return plan;
  const newExperiences = [...plan.experiences, experience];
  return recomputePlan(plan, newExperiences, answers);
}

function recomputePlan(plan: GeneratedPlan, newExperiences: Experience[], answers: ConfiguratorAnswers): GeneratedPlan {
  const groupSize = plan.groupSize;
  const experiencesCost = newExperiences.reduce((sum, exp) => sum + experienceCost(exp, groupSize), 0);
  const accommodationCost = computeAccommodationCost(plan.tier, answers, experiencesCost);
  const totalPrice = accommodationCost + experiencesCost;
  const pace: PaceKey = answers.pace ?? 'uravnotezeno';
  const { included, excluded, addOns, pendingConfirmation } = describeInclusionsAndExclusions(newExperiences, plan.accommodation.name, plan.nights);
  return {
    ...plan,
    experiences: newExperiences,
    totalPrice,
    pricePerPerson: Math.round(totalPrice / groupSize),
    days: buildItinerary(newExperiences, plan.nights, pace),
    availability: planAvailability(newExperiences),
    included,
    excluded,
    addOns,
    pendingConfirmation,
  };
}

export { budgetMidpoints };
