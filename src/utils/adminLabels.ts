import type { PartnerInquiryStatus, PartnerStatus, PartnerOfferStatus, BookingStatus, PaymentStatus } from '@/types';
import type { StatusTone } from '@/components/admin/StatusPill';

export const partnerInquiryStatusLabels: Record<PartnerInquiryStatus, string> = {
  new: 'Nov upit',
  reviewing: 'U razmatranju',
  contact_needed: 'Potrebno kontaktirati',
  meeting_scheduled: 'Zakazan razgovor',
  accepted_for_onboarding: 'Prihvaćen za unos',
  rejected: 'Odbijen',
  duplicate: 'Duplikat',
  archived: 'Arhiviran',
};

export const partnerInquiryStatusTone: Record<PartnerInquiryStatus, StatusTone> = {
  new: 'info',
  reviewing: 'neutral',
  contact_needed: 'warning',
  meeting_scheduled: 'warning',
  accepted_for_onboarding: 'success',
  rejected: 'danger',
  duplicate: 'danger',
  archived: 'neutral',
};

export const partnerStatusLabels: Record<PartnerStatus, string> = {
  lead: 'Lead',
  onboarding: 'U onboardingu',
  draft: 'Draft',
  needs_information: 'Potrebne dodatne informacije',
  ready_for_review: 'Spreman za proveru',
  approved: 'Odobren',
  published: 'Objavljen',
  paused: 'Pauziran',
  inactive: 'Neaktivan',
  rejected: 'Odbijen',
  archived: 'Arhiviran',
};

export const partnerStatusTone: Record<PartnerStatus, StatusTone> = {
  lead: 'neutral',
  onboarding: 'info',
  draft: 'neutral',
  needs_information: 'warning',
  ready_for_review: 'warning',
  approved: 'info',
  published: 'success',
  paused: 'warning',
  inactive: 'neutral',
  rejected: 'danger',
  archived: 'neutral',
};

export const partnerOfferStatusLabels: Record<PartnerOfferStatus, string> = {
  draft: 'Draft',
  active: 'Aktivna',
  inactive: 'Neaktivna',
  archived: 'Arhivirana',
};

export const partnerOfferStatusTone: Record<PartnerOfferStatus, StatusTone> = {
  draft: 'neutral',
  active: 'success',
  inactive: 'warning',
  archived: 'neutral',
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  nov_upit: 'Nov upit',
  u_proveri: 'U proveri',
  ceka_potvrdu_partnera: 'Čeka se potvrda partnera',
  potrebna_izmena: 'Potrebna izmena',
  ponuda_poslata: 'Ponuda poslata korisniku',
  ceka_avans: 'Čeka se avans',
  avans_placen: 'Avans plaćen',
  potvrdjeno: 'Potvrđeno',
  ostatak_za_uplatu: 'Ostatak za uplatu',
  placeno_u_celosti: 'Plaćeno u celosti',
  otkazano: 'Otkazano',
  realizovano: 'Realizovano',
  refund_u_obradi: 'Refund u obradi',
  arhivirano: 'Arhivirano',
};

export const bookingStatusTone: Record<BookingStatus, StatusTone> = {
  nov_upit: 'info',
  u_proveri: 'neutral',
  ceka_potvrdu_partnera: 'warning',
  potrebna_izmena: 'warning',
  ponuda_poslata: 'info',
  ceka_avans: 'warning',
  avans_placen: 'success',
  potvrdjeno: 'success',
  ostatak_za_uplatu: 'warning',
  placeno_u_celosti: 'success',
  otkazano: 'danger',
  realizovano: 'success',
  refund_u_obradi: 'warning',
  arhivirano: 'neutral',
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  nije_naplaceno: 'Nije naplaćeno',
  avans_placen: 'Avans plaćen',
  placeno_u_celosti: 'Plaćeno u celosti',
  refundirano_delimicno: 'Delimično refundirano',
  refundirano_potpuno: 'Potpuno refundirano',
};
