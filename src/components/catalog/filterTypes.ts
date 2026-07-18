import type { ExperienceCategory, IntensityLevel } from '@/types';

export interface CatalogFilters {
  categories: ExperienceCategory[];
  suitableFor: 'sve' | 'par' | 'drustvo';
  indoor: 'sve' | 'indoor' | 'outdoor' | 'oba';
  maxPrice: number | null;
  maxDuration: number | null;
  intensity: 'sve' | IntensityLevel;
  weatherDependent: 'sve' | 'da' | 'ne';
}

export const defaultFilters: CatalogFilters = {
  categories: [],
  suitableFor: 'sve',
  indoor: 'sve',
  maxPrice: null,
  maxDuration: null,
  intensity: 'sve',
  weatherDependent: 'sve',
};

export function countActiveFilters(filters: CatalogFilters): number {
  let count = filters.categories.length;
  if (filters.suitableFor !== 'sve') count += 1;
  if (filters.indoor !== 'sve') count += 1;
  if (filters.maxPrice !== null) count += 1;
  if (filters.maxDuration !== null) count += 1;
  if (filters.intensity !== 'sve') count += 1;
  if (filters.weatherDependent !== 'sve') count += 1;
  return count;
}
