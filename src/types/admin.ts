import type { PartnerCategory } from './index';
import type { AdminNote, AdminActivityEntry } from './booking';
import type { Currency } from './pricing';

export type PartnerInquiryStatus =
  | 'new'
  | 'reviewing'
  | 'contact_needed'
  | 'meeting_scheduled'
  | 'accepted_for_onboarding'
  | 'rejected'
  | 'duplicate'
  | 'archived';

/**
 * Kratka javna prijava interesovanja — NE sadrži cene, opise, uslove otkazivanja
 * ni operativne detalje. Ti podaci se unose tek kasnije, u interni onboarding.
 */
export interface PartnerInquiry {
  id: string;
  createdAt: string;
  categories: PartnerCategory[];
  businessName: string;
  contactName: string;
  phone: string;
  email?: string;
  link?: string;
  note?: string;
  consent: boolean;
  source: string;
  status: PartnerInquiryStatus;
  notes: AdminNote[];
  activity: AdminActivityEntry[];
  assignedTo?: string;
  rejectionReason?: string;
  linkedPartnerId?: string;
}

export type PartnerActivity = AdminActivityEntry;

/** Globalna, admin-podesiva politika plaćanja i otkazivanja — nikad hardkodovana u komponentama. */
export interface VikArtSettings {
  depositPercent: number;
  currency: Currency;
  paymentPolicyText: string;
  remainingDueLabel: string;
  cancellationFreeUntilLabel: string;
  cancellationLatePolicyText: string;
  cancellationNoShowText: string;
  exceptionPolicyText: string;
  partnerUnavailablePolicyText: string;
  contactPhone: string;
  contactEmail: string;
}

export const defaultSettings: VikArtSettings = {
  depositPercent: 30,
  currency: 'RSD',
  paymentPolicyText:
    'Za potvrdu rezervacije uplaćuje se avans u iznosu od 30% ukupne vrednosti. Preostalih 70% plaća se najkasnije 24 sata pre početka prve rezervisane usluge.',
  remainingDueLabel: 'najkasnije 24 sata pre početka prve rezervisane usluge',
  cancellationFreeUntilLabel:
    'Ako korisnik otkaže više od 24 sata pre početka prve usluge, zadržava se uplaćeni avans od 30%.',
  cancellationLatePolicyText:
    'Ako korisnik otkaže manje od 24 sata pre početka ili se ne pojavi, zadržava se celokupan uplaćeni iznos.',
  cancellationNoShowText:
    'Izuzeci mogu biti odobreni u opravdanim okolnostima, na osnovu pojedinačne procene organizatora. U posebno opravdanim slučajevima organizator može, po sopstvenoj proceni i na osnovu dostupnih okolnosti, odobriti delimičan ili potpun povraćaj sredstava. Takva odluka predstavlja izuzetak i ne stvara obavezu za buduće slučajeve.',
  exceptionPolicyText:
    'Ako konkretna partnerska usluga ima strože uslove, korisnik mora biti jasno obavešten pre plaćanja.',
  partnerUnavailablePolicyText:
    'Ako VikArt ili partner otkaže uslugu, nudimo odgovarajuću zamenu. Ako zamena menja sadržaj ili cenu, tražimo saglasnost korisnika. Ako odgovarajuća zamena nije prihvaćena ili dostupna, iznos za nerealizovanu uslugu se vraća.',
  contactPhone: '+381 63 000 0000',
  contactEmail: 'info@vikart.rs',
};
