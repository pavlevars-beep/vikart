import type { Package } from '@/types';
import { packages as seedPackages } from '@/data/packages';
import { storageKeys } from '@/utils/storage';
import { createStore } from './store';

const store = createStore<Package>(storageKeys.packagesDb, seedPackages);

export function listPackages(): Package[] {
  return store.list();
}

export function getPackageById(id: string): Package | undefined {
  return store.getById(id);
}

export function getPackageBySlug(slug: string): Package | undefined {
  return store.list().find((pkg) => pkg.slug === slug);
}

export function savePackage(pkg: Package): Package {
  return store.upsert(pkg);
}

export function deletePackage(id: string): void {
  store.remove(id);
}
