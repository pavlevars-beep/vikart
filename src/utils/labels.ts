import type {
  OccasionKey,
  TravelerTypeKey,
  DateModeKey,
  FeelingKey,
  WantKey,
  BudgetKey,
  PaceKey,
  ExperienceCategory,
  AvailabilityLevel,
  IntensityLevel,
  OfferStatus,
  PartnerCategory,
  DietaryOption,
  AccommodationLocationPreferenceKey,
} from '@/types';

export const occasionLabels: Record<OccasionKey, string> = {
  'beg-od-svakodnevice': 'Beg od svakodnevice',
  'romanticni-vikend': 'Romantičan vikend',
  'godisnjica-rodjendan': 'Godišnjica ili rođendan',
  'vikend-sa-ekipom': 'Vikend sa ekipom',
  'momacko-devojacko': 'Momačko ili devojačko druženje',
  'nesto-novo': 'Samo želimo nešto novo',
};

export const travelerTypeLabels: Record<TravelerTypeKey, string> = {
  par: 'Par',
  'zensko-drustvo': 'Žensko društvo',
  'musko-drustvo': 'Muško društvo',
  'mesovito-drustvo': 'Mešovito društvo',
};

export const dateModeLabels: Record<DateModeKey, string> = {
  'konkretan-termin': 'Biram konkretan termin',
  fleksibilni: 'Fleksibilni smo',
  predlozite: 'Predložite najbolji vikend',
};

export const feelingLabels: Record<FeelingKey, string> = {
  opusteno: 'Opušteno',
  romanticno: 'Romantično',
  uzbudljivo: 'Uzbudljivo',
  razmazeno: 'Razmaženo',
  povezano: 'Povezano',
  veselo: 'Veselo',
  autenticno: 'Autentično',
};

export const feelingDescriptions: Record<FeelingKey, string> = {
  opusteno: 'Tempo bez žurbe i puno prostora za disanje.',
  romanticno: 'Fokus na vas dvoje, uz malo pažnje više.',
  uzbudljivo: 'Adrenalin i aktivnosti koje pokreću.',
  razmazeno: 'Wellness, dobra hrana i mali luksuzi.',
  povezano: 'Vreme provedeno zajedno, bez ometanja.',
  veselo: 'Druženje, provod i dobra energija.',
  autenticno: 'Lokalni ukusi, ljudi i priče.',
};

export const wantLabels: Record<WantKey, string> = {
  'spa-masaza': 'Spa i masaža',
  'vecera-gastronomija': 'Večera i gastronomija',
  'kvad-offroad': 'Kvad ili off-road',
  'ebike-priroda': 'E-bike i priroda',
  jahanje: 'Jahanje',
  'streljana-paintball': 'Streljana ili paintball',
  'ziva-muzika': 'Živa muzika i izlazak',
  fotografisanje: 'Fotografisanje',
  'cvece-dekoracija': 'Cveće, torta ili dekoracija',
  'tradicionalno-domacinstvo': 'Tradicionalno domaćinstvo',
};

export const budgetLabels: Record<BudgetKey, string> = {
  'do-50000': 'do 50.000 RSD',
  '50000-80000': '50.000–80.000 RSD',
  '80000-120000': '80.000–120.000 RSD',
  '120000-200000': '120.000–200.000 RSD',
  'vise-od-200000': 'više od 200.000 RSD',
  'predlozite-vi': 'Predložite vi',
};

export const budgetMidpoints: Record<BudgetKey, number> = {
  'do-50000': 45000,
  '50000-80000': 65000,
  '80000-120000': 100000,
  '120000-200000': 160000,
  'vise-od-200000': 240000,
  'predlozite-vi': 90000,
};

export const locationPreferenceLabels: Record<AccommodationLocationPreferenceKey, string> = {
  'blizu-centra': 'Blizu centra i dešavanja',
  'mirniji-kraj': 'Mirniji kraj i više prirode',
  'najbolja-opcija': 'Najbolja opcija za moj plan',
};

export const locationPreferenceDescriptions: Record<AccommodationLocationPreferenceKey, string> = {
  'blizu-centra': 'Za goste kojima su važni restorani, šetnja, kafići i sadržaji u blizini.',
  'mirniji-kraj': 'Za odmor, privatnost, romantičan vikend i pogled.',
  'najbolja-opcija': 'VikArt predlaže lokaciju na osnovu povoda, broja gostiju i izabranih aktivnosti.',
};

export const paceLabels: Record<PaceKey, string> = {
  lagano: 'Lagano — jedno glavno iskustvo dnevno',
  uravnotezeno: 'Uravnoteženo — preporučena opcija',
  'pun-program': 'Pun program — želimo da iskoristimo svaki sat',
};

export const categoryLabels: Record<ExperienceCategory, string> = {
  wellness: 'Wellness',
  romantika: 'Romantika',
  gastronomija: 'Gastronomija',
  avantura: 'Avantura',
  priroda: 'Priroda',
  kultura: 'Kultura',
  'nocni-provod': 'Noćni provod',
  iznenadjenja: 'Posebna iznenađenja',
};

export const availabilityLabels: Record<AvailabilityLevel, string> = {
  'brza-potvrda': 'Brza potvrda',
  'potrebna-provera': 'Potrebna provera',
  'concierge-zahtev': 'Concierge zahtev',
};

export const intensityLabels: Record<IntensityLevel, string> = {
  lagano: 'Lagano',
  umereno: 'Umereno',
  intenzivno: 'Intenzivno',
};

/** Tačan, propisan prevod statusa ponude partnera — koristi se svuda gde se status prikazuje. */
export const offerStatusLabels: Record<OfferStatus, string> = {
  demo: 'Demonstracioni prikaz',
  available_on_request: 'Dostupno na upit',
  pending_confirmation: 'Provera dostupnosti',
  confirmed: 'Potvrđeno',
  unavailable: 'Trenutno nedostupno',
};

export const partnerCategoryLabels: Record<PartnerCategory, string> = {
  smestaj: 'Smeštaj',
  restoran: 'Restoran',
  'spa-i-wellness': 'Spa i wellness',
  masaza: 'Masaža',
  'voznja-kvadovima': 'Vožnja kvadovima',
  'e-bike': 'E-bike',
  jahanje: 'Jahanje',
  fotografisanje: 'Fotografisanje',
  'dekoracija-i-cvece': 'Dekoracija i cveće',
  'lokalno-domacinstvo': 'Lokalno domaćinstvo',
  'izleti-i-turisticki-obilasci': 'Izleti i turistički obilasci',
  prevoz: 'Prevoz',
  'muzika-i-vecernji-program': 'Muzika i večernji program',
  'ostala-iskustva': 'Ostala iskustva',
};

export const dietaryOptionLabels: Record<DietaryOption, string> = {
  vegetarijanski: 'Vegetarijanski',
  veganski: 'Veganski',
  'gluten-free': 'Bez glutena',
  'bez-restrikcija': 'Bez restrikcija',
};

/**
 * Tačan tekst koji se prikazuje uz svaku referencu na partnera — partner je uvek
 * predložena opcija dok VikArt ne potvrdi raspoloživost, nikad prikazan kao već
 * potvrđen.
 */
export const PARTNER_AVAILABILITY_DISCLAIMER =
  'Ovaj partner je predložena opcija. VikArt će proveriti raspoloživost pre potvrde plana. Ako nije dostupan, dobićete jasno označenu zamenu iste ili više kategorije, bez promene cene, ili ćemo zatražiti vašu saglasnost ako se cena menja.';
