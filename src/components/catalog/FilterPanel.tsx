import type { ExperienceCategory, IntensityLevel } from '@/types';
import { categoryLabels, intensityLabels } from '@/utils/labels';
import type { CatalogFilters } from './filterTypes';
import { defaultFilters } from './filterTypes';

const categories = Object.keys(categoryLabels) as ExperienceCategory[];
const intensities = Object.keys(intensityLabels) as IntensityLevel[];
const priceOptions = [1500, 3000, 5000, 10000];
const durationOptions = [60, 90, 120, 180];

interface FilterPanelProps {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
}

function ChipGroup<T extends string>({
  options,
  labels,
  value,
  onSelect,
}: {
  options: T[];
  labels: Record<T, string>;
  value: T;
  onSelect: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          aria-pressed={value === opt}
          onClick={() => onSelect(opt)}
          className={`min-h-[36px] rounded-full border px-3 text-sm ${
            value === opt ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'
          }`}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  function toggleCategory(category: ExperienceCategory) {
    const has = filters.categories.includes(category);
    onChange({
      ...filters,
      categories: has ? filters.categories.filter((c) => c !== category) : [...filters.categories, category],
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Kategorija</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              aria-pressed={filters.categories.includes(cat)}
              onClick={() => toggleCategory(cat)}
              className={`min-h-[36px] rounded-full border px-3 text-sm ${
                filters.categories.includes(cat) ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Za koga</p>
        <ChipGroup
          options={['sve', 'par', 'drustvo'] as const}
          labels={{ sve: 'Svi', par: 'Parovi', drustvo: 'Društva' }}
          value={filters.suitableFor}
          onSelect={(v) => onChange({ ...filters, suitableFor: v })}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Indoor / outdoor</p>
        <ChipGroup
          options={['sve', 'indoor', 'outdoor', 'oba'] as const}
          labels={{ sve: 'Sve', indoor: 'Indoor', outdoor: 'Outdoor', oba: 'Oba' }}
          value={filters.indoor}
          onSelect={(v) => onChange({ ...filters, indoor: v })}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Budžet (do)</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={filters.maxPrice === null}
            onClick={() => onChange({ ...filters, maxPrice: null })}
            className={`min-h-[36px] rounded-full border px-3 text-sm ${
              filters.maxPrice === null ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'
            }`}
          >
            Sve
          </button>
          {priceOptions.map((price) => (
            <button
              key={price}
              type="button"
              aria-pressed={filters.maxPrice === price}
              onClick={() => onChange({ ...filters, maxPrice: price })}
              className={`min-h-[36px] rounded-full border px-3 text-sm ${
                filters.maxPrice === price ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'
              }`}
            >
              do {price.toLocaleString('sr-RS')} RSD
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Trajanje (do)</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={filters.maxDuration === null}
            onClick={() => onChange({ ...filters, maxDuration: null })}
            className={`min-h-[36px] rounded-full border px-3 text-sm ${
              filters.maxDuration === null ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'
            }`}
          >
            Sve
          </button>
          {durationOptions.map((min) => (
            <button
              key={min}
              type="button"
              aria-pressed={filters.maxDuration === min}
              onClick={() => onChange({ ...filters, maxDuration: min })}
              className={`min-h-[36px] rounded-full border px-3 text-sm ${
                filters.maxDuration === min ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'
              }`}
            >
              do {min} min
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Intenzitet</p>
        <ChipGroup
          options={['sve', ...intensities] as const}
          labels={{ sve: 'Sve', ...intensityLabels } as Record<'sve' | IntensityLevel, string>}
          value={filters.intensity}
          onSelect={(v) => onChange({ ...filters, intensity: v })}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-ink">Zavisnost od vremena</p>
        <ChipGroup
          options={['sve', 'da', 'ne'] as const}
          labels={{ sve: 'Svejedno', da: 'Zavisi od vremena', ne: 'Ne zavisi' }}
          value={filters.weatherDependent}
          onSelect={(v) => onChange({ ...filters, weatherDependent: v })}
        />
      </div>

      <button
        type="button"
        onClick={() => onChange(defaultFilters)}
        className="text-sm font-semibold text-terracotta hover:underline"
      >
        Resetuj filtere
      </button>
    </div>
  );
}
