import type { Experience } from '@/types';
import { experiences as seedExperiences } from '@/data/experiences';
import { storageKeys } from '@/utils/storage';
import { createStore } from './store';

const store = createStore<Experience>(storageKeys.experiencesDb, seedExperiences);

export function listExperiences(): Experience[] {
  return store.list();
}

export function getExperienceById(id: string): Experience | undefined {
  return store.getById(id);
}

export function saveExperience(experience: Experience): Experience {
  return store.upsert(experience);
}

export function deleteExperience(id: string): void {
  store.remove(id);
}
