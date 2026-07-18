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
}

export type AccommodationType = 'apartman' | 'boutique-hotel' | 'brvnara' | 'vila';

export interface Accommodation {
  id: string;
  name: string;
  type: AccommodationType;
  description: string;
  capacity: number;
  image: ImageRef;
  amenities: string[];
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

export type PartnerType =
  | 'hotel'
  | 'apartman'
  | 'kuca-brvnara'
  | 'vila'
  | 'wellness-spa'
  | 'restoran'
  | 'avantura'
  | 'vodic'
  | 'prevoz'
  | 'fotograf'
  | 'dekoracija'
  | 'domacinstvo'
  | 'ostalo';

export interface Partner {
  id: string;
  type: PartnerType;
  name: string;
  description: string;
  location: string;
  image: ImageRef;
  verified: false;
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

export interface ItineraryItem {
  time: string;
  title: string;
  description?: string;
  experienceId?: string;
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
  accommodation: Accommodation;
  experiences: Experience[];
  days: ItineraryDay[];
  included: string[];
  excluded: string[];
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
  createdAt: string;
}

export interface PartnerInquiry {
  type: PartnerType;
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  location: string;
  website: string;
  instagram: string;
  description: string;
  priceRange: string;
  capacity: string;
  seasonality: string;
  confirmationMethod: string;
  responseTime: string;
  photosLink: string;
  note: string;
  createdAt: string;
}
