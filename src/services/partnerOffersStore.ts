import type { PartnerOffer } from '@/types';
import { partnerOffers as seedPartnerOffers } from '@/data/partnerOffers';
import { storageKeys } from '@/utils/storage';
import { createStore } from './store';

const store = createStore<PartnerOffer>(storageKeys.partnerOffersDb, seedPartnerOffers);

export function listPartnerOffers(): PartnerOffer[] {
  return store.list();
}

export function getPartnerOfferById(id: string): PartnerOffer | undefined {
  return store.getById(id);
}

export function listOffersForPartner(partnerId: string): PartnerOffer[] {
  return store.list().filter((offer) => offer.partnerId === partnerId);
}

export function savePartnerOffer(offer: PartnerOffer): PartnerOffer {
  return store.upsert(offer);
}

export function deletePartnerOffer(id: string): void {
  store.remove(id);
}

export function createOfferId(partnerId: string): string {
  return `offer-${partnerId}-${Date.now().toString(36)}`;
}
