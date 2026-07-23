import { readStorage, writeStorage } from '@/utils/storage';

/**
 * Generički localStorage-podržan "repository" sloj — prototype zamena za pravu
 * bazu. Svaki entitet se seeduje iz odgovarajućeg `src/data/*.ts` fajla pri
 * prvom čitanju, a nakon toga se čita/piše isključivo iz localStorage-a.
 *
 * Kada zaživi pravi backend, dovoljno je zameniti implementaciju ovih metoda
 * pozivima ka API-ju — potpisi funkcija u `services/*Store.ts` mogu ostati isti.
 */
export interface WithId {
  id: string;
}

export interface Store<T extends WithId> {
  list: () => T[];
  getById: (id: string) => T | undefined;
  upsert: (item: T) => T;
  remove: (id: string) => void;
  resetToSeed: () => void;
}

export function createStore<T extends WithId>(storageKey: string, seed: T[]): Store<T> {
  function readAll(): T[] {
    const existing = readStorage<T[]>(storageKey);
    if (existing) return existing;
    writeStorage(storageKey, seed);
    return seed;
  }

  return {
    list: () => readAll(),
    getById: (id) => readAll().find((item) => item.id === id),
    upsert: (item) => {
      const all = readAll();
      const idx = all.findIndex((existing) => existing.id === item.id);
      const next = idx >= 0 ? all.map((existing, i) => (i === idx ? item : existing)) : [...all, item];
      writeStorage(storageKey, next);
      return item;
    },
    remove: (id) => {
      writeStorage(storageKey, readAll().filter((item) => item.id !== id));
    },
    resetToSeed: () => writeStorage(storageKey, seed),
  };
}
