import type { Partner, PartnerInquiry } from '@/types';
import { partners as seedPartners } from '@/data/partners';
import { images } from '@/data/images';
import { storageKeys } from '@/utils/storage';
import { slugify } from '@/utils/slug';
import { createStore } from './store';

const store = createStore<Partner>(storageKeys.partnersDb, seedPartners);

export function listPartners(): Partner[] {
  return store.list();
}

export function getPartnerById(id: string): Partner | undefined {
  return store.getById(id);
}

export function getPartnerBySlug(slug: string): Partner | undefined {
  return store.list().find((partner) => partner.slug === slug);
}

export function savePartner(partner: Partner): Partner {
  return store.upsert(partner);
}

export function deletePartner(id: string): void {
  store.remove(id);
}

export function createEmptyPartnerId(): string {
  return `partner-${Date.now().toString(36)}`;
}

export function createBlankPartner(): Partner {
  const id = createEmptyPartnerId();
  const partner: Partner = {
    id,
    slug: id,
    name: '',
    categories: [],
    status: 'available_on_request',
    lifecycleStatus: 'lead',
    isDemo: false,
    oneLiner: '',
    story: '',
    location: { address: '', area: '' },
    contact: {},
    media: { mainPhoto: images.zlatiborHero, gallery: [] },
    facts: [],
  };
  return store.upsert(partner);
}

function guessContactField(link?: string): Pick<Partner['contact'], 'website' | 'instagram' | 'facebook'> {
  if (!link) return {};
  if (link.includes('instagram.com')) return { instagram: link };
  if (link.includes('facebook.com')) return { facebook: link };
  return { website: link };
}

/**
 * Kreira Partner draft na osnovu kratke javne prijave — prenosi već dostavljene
 * podatke, ostatak ostaje prazan za popunjavanje kroz interni onboarding.
 * Ne briše prvobitni upit — samo ga povezuje (vidi `linkPartnerInquiryToPartner`).
 */
export function createDraftPartnerFromInquiry(inquiry: PartnerInquiry): Partner {
  const id = createEmptyPartnerId();
  const partner: Partner = {
    id,
    slug: slugify(inquiry.businessName) || id,
    name: inquiry.businessName,
    categories: inquiry.categories,
    status: 'available_on_request',
    lifecycleStatus: 'draft',
    isDemo: false,
    oneLiner: '',
    story: '',
    location: { address: '', area: '' },
    contact: { phone: inquiry.phone, email: inquiry.email, ...guessContactField(inquiry.link) },
    media: { mainPhoto: images.zlatiborHero, gallery: [] },
    facts: [],
    internalNote: inquiry.note ? `Iz prijave interesovanja: ${inquiry.note}` : undefined,
  };
  return store.upsert(partner);
}
