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
import { accommodations, getAccommodationById } from '@/data/accommodations';
import { budgetMidpoints } from './labels';
import { readStorage, storageKeys } from './storage';

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
  if (groupSize > 4) return 'kuca-za-ekipu';
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

export function buildItinerary(selected: Experience[], nights: number, pace: PaceKey): ItineraryDay[] {
  const dayNames = ['Petak', 'Subota', 'Nedelja', 'Ponedeljak', 'Utorak'].slice(0, nights + 1);
  const pool = [...selected];

  const takeByPredicate = (predicate: (exp: Experience) => boolean): Experience | undefined => {
    const idx = pool.findIndex(predicate);
    if (idx === -1) return undefined;
    return pool.splice(idx, 1)[0];
  };

  const takeAny = (): Experience | undefined => pool.shift();

  const days: ItineraryDay[] = [];

  // Dan dolaska
  const arrivalItems: ItineraryItem[] = [{ time: '17:00', title: 'Dolazak i prijava' }];
  const welcomeExp = takeByPredicate((e) => e.id === 'dekoracija-sobe-cvece');
  arrivalItems.push(
    welcomeExp
      ? { time: '18:00', title: welcomeExp.name, description: welcomeExp.shortDescription, experienceId: welcomeExp.id }
      : { time: '18:00', title: 'Welcome paket i slobodno vreme' },
  );
  const dinnerExp = takeByPredicate((e) => DINNER_IDS.has(e.id));
  arrivalItems.push(
    dinnerExp
      ? { time: '20:30', title: dinnerExp.name, description: dinnerExp.shortDescription, experienceId: dinnerExp.id }
      : { time: '20:30', title: 'Večera po vašem izboru' },
  );
  days.push({ dayLabel: dayNames[0], items: arrivalItems });

  // Puni dani
  const activityCount = pace === 'lagano' ? 1 : pace === 'pun-program' ? 3 : 2;
  for (let day = 1; day < nights; day += 1) {
    const items: ItineraryItem[] = [{ time: '09:00', title: 'Doručak' }];
    const morningExp = takeAny();
    items.push(
      morningExp
        ? { time: '11:00', title: morningExp.name, description: morningExp.shortDescription, experienceId: morningExp.id }
        : { time: '11:00', title: 'Slobodno vreme' },
    );
    items.push({ time: '14:00', title: 'Ručak' });
    if (activityCount >= 2) {
      const afternoonExp = takeAny();
      items.push(
        afternoonExp
          ? { time: '17:00', title: afternoonExp.name, description: afternoonExp.shortDescription, experienceId: afternoonExp.id }
          : { time: '17:00', title: 'Slobodno vreme ili wellness' },
      );
    }
    if (activityCount >= 3) {
      const eveningExp = takeAny();
      items.push(
        eveningExp
          ? { time: '21:00', title: eveningExp.name, description: eveningExp.shortDescription, experienceId: eveningExp.id }
          : { time: '21:00', title: 'Izlazak ili druženje' },
      );
    } else if (day === nights - 1) {
      const eveningExp = takeByPredicate((e) => e.category === 'nocni-provod');
      if (eveningExp) {
        items.push({ time: '21:00', title: eveningExp.name, description: eveningExp.shortDescription, experienceId: eveningExp.id });
      }
    }
    days.push({ dayLabel: dayNames[day], items });
  }

  // Dan odlaska
  const lastActivity = takeByPredicate((e) => e.category === 'priroda' || e.category === 'kultura') ?? takeAny();
  const departureItems: ItineraryItem[] = [
    lastActivity
      ? { time: '10:00', title: lastActivity.name, description: lastActivity.shortDescription, experienceId: lastActivity.id }
      : { time: '10:00', title: 'Lagana aktivnost ili obilazak' },
    { time: '13:00', title: 'Lokalni ručak' },
    { time: '16:00', title: 'Kasni checkout i povratak' },
  ];
  days.push({ dayLabel: dayNames[nights] ?? `Dan ${nights + 1}`, items: departureItems });

  // Preostala iskustva koja nisu stigla u raspored dodajemo pred kraj poslednjeg punog dana
  while (pool.length > 0) {
    const leftover = takeAny();
    if (!leftover) break;
    const targetDay = days[Math.max(1, days.length - 2)];
    targetDay.items.splice(targetDay.items.length - 1, 0, {
      time: '—',
      title: leftover.name,
      description: leftover.shortDescription,
      experienceId: leftover.id,
    });
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

function buildPlan(tier: PlanTier, answers: ConfiguratorAnswers): GeneratedPlan {
  const groupSize = answers.groupSize || 2;
  const nights = answers.nights || 2;
  const pace: PaceKey = answers.pace ?? 'uravnotezeno';

  const candidates = rankedCandidates(answers);
  const count = Math.min(PACE_COUNTS[pace][tier], candidates.length);
  const selected = candidates.slice(0, count);

  const accommodation = getAccommodationById(pickAccommodationId(tier, groupSize)) ?? accommodations[0];
  const experiencesCost = selected.reduce((sum, exp) => sum + experienceCost(exp, groupSize), 0);
  const accommodationCostValue = computeAccommodationCost(tier, answers, experiencesCost);
  const totalPrice = accommodationCostValue + experiencesCost;

  const days = buildItinerary(selected, nights, pace);

  const included = [
    `${nights} noćenja u smeštaju „${accommodation.name}"`,
    ...selected.map((exp) => exp.name),
    'Koordinacija celog rasporeda od strane VikArt tima',
  ];
  const excluded = [
    'Prevoz do Zlatibora',
    'Dodatna pića i lične potrošnje van dogovorenog programa',
    'Osiguranje',
  ];

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
  return {
    ...plan,
    experiences: newExperiences,
    totalPrice,
    pricePerPerson: Math.round(totalPrice / groupSize),
    days: buildItinerary(newExperiences, plan.nights, pace),
    availability: planAvailability(newExperiences),
    included: [
      `${plan.nights} noćenja u smeštaju „${plan.accommodation.name}"`,
      ...newExperiences.map((exp) => exp.name),
      'Koordinacija celog rasporeda od strane VikArt tima',
    ],
  };
}

export { budgetMidpoints };
