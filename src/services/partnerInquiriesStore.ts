import type { PartnerInquiry, PartnerInquiryStatus, PartnerCategory } from '@/types';
import { storageKeys } from '@/utils/storage';
import { createStore } from './store';
import { makeActivity, makeNote } from './activityLog';

const store = createStore<PartnerInquiry>(storageKeys.partnerInquiriesDb, []);

export function listPartnerInquiries(): PartnerInquiry[] {
  return store.list().slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getPartnerInquiryById(id: string): PartnerInquiry | undefined {
  return store.getById(id);
}

export interface CreateInquiryInput {
  categories: PartnerCategory[];
  businessName: string;
  contactName: string;
  phone: string;
  email?: string;
  link?: string;
  note?: string;
  consent: boolean;
  source?: string;
}

/** Detekcija duplikata — ista kombinacija naziva + telefona već postoji među otvorenim upitima. */
export function findPossibleDuplicate(businessName: string, phone: string): PartnerInquiry | undefined {
  const normalizedName = businessName.trim().toLowerCase();
  const normalizedPhone = phone.replace(/\s+/g, '');
  return store.list().find(
    (inquiry) =>
      inquiry.businessName.trim().toLowerCase() === normalizedName &&
      inquiry.phone.replace(/\s+/g, '') === normalizedPhone &&
      inquiry.status !== 'rejected' &&
      inquiry.status !== 'archived',
  );
}

export function createPartnerInquiry(input: CreateInquiryInput): PartnerInquiry {
  const duplicate = findPossibleDuplicate(input.businessName, input.phone);
  const inquiry: PartnerInquiry = {
    id: `inquiry-${Date.now().toString(36)}-${Math.round(Math.random() * 1e4)}`,
    createdAt: new Date().toISOString(),
    categories: input.categories,
    businessName: input.businessName,
    contactName: input.contactName,
    phone: input.phone,
    email: input.email,
    link: input.link,
    note: input.note,
    consent: input.consent,
    source: input.source ?? 'sajt',
    status: duplicate ? 'duplicate' : 'new',
    notes: [],
    activity: [makeActivity('created', 'Kratka prijava interesovanja poslata sa sajta.')],
  };
  if (duplicate) {
    inquiry.activity.push(makeActivity('duplicate_detected', `Moguć duplikat postojećeg upita #${duplicate.id}.`));
  }
  return store.upsert(inquiry);
}

export function updatePartnerInquiryStatus(id: string, status: PartnerInquiryStatus, description?: string): PartnerInquiry | undefined {
  const inquiry = store.getById(id);
  if (!inquiry) return undefined;
  const next: PartnerInquiry = {
    ...inquiry,
    status,
    activity: [...inquiry.activity, makeActivity('status_change', description ?? `Status promenjen u „${status}".`)],
  };
  return store.upsert(next);
}

export function addPartnerInquiryNote(id: string, text: string): PartnerInquiry | undefined {
  const inquiry = store.getById(id);
  if (!inquiry) return undefined;
  const next: PartnerInquiry = { ...inquiry, notes: [...inquiry.notes, makeNote(text)] };
  return store.upsert(next);
}

export function logPartnerInquiryActivity(id: string, type: string, description: string): PartnerInquiry | undefined {
  const inquiry = store.getById(id);
  if (!inquiry) return undefined;
  const next: PartnerInquiry = { ...inquiry, activity: [...inquiry.activity, makeActivity(type, description)] };
  return store.upsert(next);
}

export function rejectPartnerInquiry(id: string, reason: string): PartnerInquiry | undefined {
  const inquiry = store.getById(id);
  if (!inquiry) return undefined;
  const next: PartnerInquiry = {
    ...inquiry,
    status: 'rejected',
    rejectionReason: reason,
    activity: [...inquiry.activity, makeActivity('rejected', `Upit odbijen. Razlog: ${reason}`)],
  };
  return store.upsert(next);
}

export function linkPartnerInquiryToPartner(id: string, partnerId: string): PartnerInquiry | undefined {
  const inquiry = store.getById(id);
  if (!inquiry) return undefined;
  const next: PartnerInquiry = {
    ...inquiry,
    status: 'accepted_for_onboarding',
    linkedPartnerId: partnerId,
    activity: [...inquiry.activity, makeActivity('accepted_for_onboarding', `Prihvaćen za onboarding — kreiran Partner draft #${partnerId}.`)],
  };
  return store.upsert(next);
}
