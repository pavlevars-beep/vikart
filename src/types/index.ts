export interface ImageRef {
  src: string;
  alt: string;
  credit?: string;
}

export type ExperienceCategory =
  | 'wellness'
  | 'romantika'
  | 'gastronomija'
  | 'avantura'
  | 'priroda'
  | 'kultura'
  | 'nocni-provod'
  | 'iznenadjenja';

export type AvailabilityLevel = 'brza-potvrda' | 'potrebna-provera' | 'concierge-zahtev';

export type IntensityLevel = 'lagano' | 'umereno' | 'intenzivno';

export type SuitableFor = 'par' | 'drustvo';

export interface Experience {
  id: string;
  name: string;
  category: ExperienceCategory;
  shortDescription: string;
  description: string;
  image: ImageRef;
  durationLabel: string;
  durationMinutes: number;
  minParticipants: number;
  priceFrom: number;
  priceUnit: 'po_osobi' | 'po_grupi' | 'po_paru';
  indoor: 'indoor' | 'outdoor' | 'oba';
  weatherDependent: boolean;
  availability: AvailabilityLevel;
  intensity: IntensityLevel;
  suitableFor: SuitableFor[];
  tags: string[];
  /** Konkretan partner koji realizuje ovo iskustvo — nikad se ne prikazuje bez njega. */
  partnerId: string;
  /** Detaljna ponuda (uključeno/isključeno, raspored, hrana, otkazivanje...) za ovo iskustvo kod datog partnera. */
  offerId: string;
}

/**
 * Centralni registar partnera. Svaki paket, iskustvo i itinerer referencira
 * partnera po `id`-u — partner se nikad ne duplira niti hardkoduje u UI komponentama.
 */
export type PartnerCategory =
  | 'smestaj'
  | 'restoran'
  | 'spa-i-wellness'
  | 'masaza'
  | 'voznja-kvadovima'
  | 'e-bike'
  | 'jahanje'
  | 'fotografisanje'
  | 'dekoracija-i-cvece'
  | 'lokalno-domacinstvo'
  | 'izleti-i-turisticki-obilasci'
  | 'prevoz'
  | 'muzika-i-vecernji-program'
  | 'ostala-iskustva';

/**
 * Status konkretne ponude partnera (ne meša se sa `AvailabilityLevel`, koji opisuje
 * koliko brzo VikArt tim očekuje da potvrdi termin za dato iskustvo).
 */
export type OfferStatus = 'demo' | 'available_on_request' | 'pending_confirmation' | 'confirmed' | 'unavailable';

export interface PartnerContact {
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
}

export interface PartnerLocation {
  address: string;
  area: string;
  mapUrl?: string;
}

export interface PartnerMedia {
  /** Glavna fotografija na kartici i na vrhu lične karte partnera. */
  mainPhoto: ImageRef;
  /** Galerija (1-8 dodatnih fotografija) prikazana na ličnoj karti partnera. */
  gallery: ImageRef[];
  /** Logo partnera, ako postoji — prikazuje se na ličnoj karti umesto glavne fotografije u sitnim referencama. */
  logo?: ImageRef;
}

export interface PartnerFact {
  label: string;
  value: string;
}

export interface Partner {
  id: string;
  slug: string;
  name: string;
  categories: PartnerCategory[];
  status: OfferStatus;
  isDemo: boolean;
  /** Kratka jedna rečenica za kartice i mini-reference. */
  oneLiner: string;
  /** Ljudska, neklišetirana priča o partneru — kod demo partnera jasno naznačena kao demo sadržaj. */
  story: string;
  location: PartnerLocation;
  contact: PartnerContact;
  hoursLabel?: string;
  media: PartnerMedia;
  /** Konkretne, kategorijski-specifične činjenice (kapacitet, kuhinja, oprema...). */
  facts: PartnerFact[];
}

export interface OfferVariant {
  name: string;
  description: string;
  priceImpact: string;
}

export interface SubstitutionPolicy {
  backupPartnerId?: string;
  allowedSubstitutions: string;
  conditions: string;
  priceImpact: string;
  consentRequired: boolean;
}

export interface CancellationPolicy {
  freeUntilLabel: string;
  latePolicy: string;
  noShowPolicy: string;
}

export interface SafetyInformation {
  restrictions: string[];
  safetyRules: string[];
  badWeatherProcedure: string;
  dayOfContact: string;
}

export type DietaryOption = 'vegetarijanski' | 'veganski' | 'gluten-free' | 'bez-restrikcija';

export interface FoodOption {
  mealType: string;
  courseCount: number;
  drinkCount: number;
  dishChoices: string[];
  portionNotes: string;
  dietary: DietaryOption[];
  allergyReportingDeadline: string;
  exclusions: string[];
}

export interface AddOn {
  name: string;
  priceLabel: string;
  description?: string;
}

export interface InclusionItem {
  label: string;
  detail?: string;
}

export interface ExclusionItem {
  label: string;
  detail?: string;
}

export interface ExperienceSchedule {
  meetingPoint: string;
  meetingTime: string;
  arrivalBufferMinutes: number;
  durationLabel: string;
  sequence: string[];
  whatToBring: string[];
  dressCode?: string;
}

/**
 * Detaljna, strukturirana ponuda partnera za jedno iskustvo — izvor podataka za
 * "Detalji iskustva" akordeon i za uključeno/nije uključeno/dodatno prikaz.
 */
export interface PartnerOffer {
  id: string;
  partnerId: string;
  status: OfferStatus;
  narrative: string;
  primaryVariant: OfferVariant;
  alternativeVariant?: OfferVariant;
  substitution: SubstitutionPolicy;
  cancellation: CancellationPolicy;
  safety: SafetyInformation;
  intensity: IntensityLevel;
  schedule: ExperienceSchedule;
  inclusions: InclusionItem[];
  exclusions: ExclusionItem[];
  addOns: AddOn[];
  food?: FoodOption;
}

export interface Package {
  id: string;
  slug: string;
  name: string;
  priceFromLabel: string;
  priceFromValue: number;
  participantsLabel: string;
  participantsCount: number;
  nights: number;
  shortDescription: string;
  highlights: string[];
  tags: string[];
  image: ImageRef;
  accommodationId: string;
  experienceIds: string[];
}

export type OccasionKey =
  | 'beg-od-svakodnevice'
  | 'romanticni-vikend'
  | 'godisnjica-rodjendan'
  | 'vikend-sa-ekipom'
  | 'momacko-devojacko'
  | 'nesto-novo';

export type TravelerTypeKey = 'par' | 'zensko-drustvo' | 'musko-drustvo' | 'mesovito-drustvo';

export type DateModeKey = 'konkretan-termin' | 'fleksibilni' | 'predlozite';

export type FeelingKey =
  | 'opusteno'
  | 'romanticno'
  | 'uzbudljivo'
  | 'razmazeno'
  | 'povezano'
  | 'veselo'
  | 'autenticno';

export type WantKey =
  | 'spa-masaza'
  | 'vecera-gastronomija'
  | 'kvad-offroad'
  | 'ebike-priroda'
  | 'jahanje'
  | 'streljana-paintball'
  | 'ziva-muzika'
  | 'fotografisanje'
  | 'cvece-dekoracija'
  | 'tradicionalno-domacinstvo';

export type BudgetKey =
  | 'do-50000'
  | '50000-80000'
  | '80000-120000'
  | '120000-200000'
  | 'vise-od-200000'
  | 'predlozite-vi';

export type PaceKey = 'lagano' | 'uravnotezeno' | 'pun-program';

export interface ConfiguratorAnswers {
  occasion: OccasionKey | null;
  travelerType: TravelerTypeKey | null;
  groupSize: number;
  dateMode: DateModeKey | null;
  specificDate: string;
  nights: 1 | 2 | 3;
  feelings: FeelingKey[];
  wants: WantKey[];
  budget: BudgetKey | null;
  pace: PaceKey | null;
  specialRequest: string;
}

export type ItineraryItemKind = 'usluga' | 'logistika';

export interface ItineraryItem {
  time: string;
  title: string;
  description?: string;
  experienceId?: string;
  kind: ItineraryItemKind;
  /** Lucide ikona (naziv u kebab-case ne koristimo — koristimo PascalCase komponentu po imenu) za logističke stavke bez partnera. */
  icon?: string;
}

export interface ItineraryDay {
  dayLabel: string;
  items: ItineraryItem[];
}

export type PlanTier = 'pametan-izbor' | 'preporuka' | 'premium';

export interface GeneratedPlan {
  id: string;
  tier: PlanTier;
  title: string;
  reason: string;
  totalPrice: number;
  pricePerPerson: number;
  nights: number;
  groupSize: number;
  accommodation: Partner;
  experiences: Experience[];
  days: ItineraryDay[];
  included: string[];
  excluded: string[];
  addOns: string[];
  pendingConfirmation: string[];
  availability: AvailabilityLevel;
  badWeatherAlternative: string;
}

export type PreferredContact = 'telefon' | 'viber' | 'whatsapp' | 'email';

export interface Inquiry {
  fullName: string;
  phone: string;
  email: string;
  preferredContact: PreferredContact;
  note: string;
  consent: boolean;
  dietary?: {
    allergies: string;
    vegetarian: boolean;
    vegan: boolean;
    religiousOrOther: string;
    additionalNote: string;
  };
  createdAt: string;
}

export interface PartnerApplicationBasics {
  businessName: string;
  categories: PartnerCategory[];
  contactName: string;
  phone: string;
  email: string;
  location: string;
}

export interface PartnerApplicationStory {
  oneLiner: string;
  story: string;
  photosLink: string;
  logoLink: string;
}

export interface PartnerApplicationOffer {
  offerName: string;
  offerDescription: string;
  priceLabel: string;
  capacity: string;
  durationLabel: string;
}

export interface PartnerApplicationFood {
  hasFoodOrDrink: boolean;
  mealType: string;
  courseCount: string;
  dietaryOptions: DietaryOption[];
  allergyProcess: string;
}

export interface PartnerApplicationPolicies {
  cancellationTerms: string;
  substitutionAllowed: boolean;
  substitutionNotes: string;
  backupContact: string;
}

export interface PartnerApplicationOperations {
  meetingPoint: string;
  responseTime: string;
  dayOfContact: string;
  badWeatherProcedure: string;
}

export interface PartnerApplication {
  basics: PartnerApplicationBasics;
  story: PartnerApplicationStory;
  offer: PartnerApplicationOffer;
  food: PartnerApplicationFood;
  policies: PartnerApplicationPolicies;
  operations: PartnerApplicationOperations;
  createdAt: string;
}
