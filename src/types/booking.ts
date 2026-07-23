import type { Currency, PriceBreakdown } from './pricing';
import type { CancellationPolicy, ImageRef, AccommodationLocationPreferenceKey } from './index';

export type BookingStatus =
  | 'nov_upit'
  | 'u_proveri'
  | 'ceka_potvrdu_partnera'
  | 'potrebna_izmena'
  | 'ponuda_poslata'
  | 'ceka_avans'
  | 'avans_placen'
  | 'potvrdjeno'
  | 'ostatak_za_uplatu'
  | 'placeno_u_celosti'
  | 'otkazano'
  | 'realizovano'
  | 'refund_u_obradi'
  | 'arhivirano';

export type PaymentStatus =
  | 'nije_naplaceno'
  | 'avans_placen'
  | 'placeno_u_celosti'
  | 'refundirano_delimicno'
  | 'refundirano_potpuno';

export interface PaymentSchedule {
  totalAmount: number;
  currency: Currency;
  depositPercent: number;
  depositAmount: number;
  remainingAmount: number;
  remainingDueLabel: string;
  paymentStatus: PaymentStatus;
}

export interface BookingSnapshotItem {
  partnerId: string;
  partnerName: string;
  offerId: string;
  offerName: string;
  priceBreakdown?: PriceBreakdown;
  inclusions: string[];
  exclusions: string[];
  addOns: string[];
  cancellationPolicy?: CancellationPolicy;
  mainPhoto?: ImageRef;
}

/**
 * Snimak ugovorenih uslova u trenutku prihvatanja ponude/uplate avansa.
 * Kasnija izmena aktivne PartnerOffer ponude NIKAD ne sme retroaktivno da
 * promeni ovaj snapshot.
 */
export interface BookingSnapshot {
  createdAt: string;
  accommodation: BookingSnapshotItem;
  experiences: BookingSnapshotItem[];
  totalPrice: number;
  currency: Currency;
}

export interface AdminNote {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface AdminActivityEntry {
  id: string;
  type: string;
  description: string;
  createdAt: string;
  authorName?: string;
}

export interface Booking {
  id: string;
  referenceCode: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  groupSize: number;
  travelDate?: string;
  packageId?: string;
  packageName?: string;
  locationPreference?: AccommodationLocationPreferenceKey;
  experienceNames: string[];
  totalPrice: number;
  payment: PaymentSchedule;
  partnerCheckStatus: 'nije_pokrenuto' | 'u_toku' | 'potvrdjeno' | 'zamena_potrebna';
  status: BookingStatus;
  notes: AdminNote[];
  activity: AdminActivityEntry[];
  snapshot?: BookingSnapshot;
  dietary?: {
    allergies: string;
    vegetarian: boolean;
    vegan: boolean;
    religiousOrOther: string;
    additionalNote: string;
  };
}
