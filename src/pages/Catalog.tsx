import { useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { experiences } from '@/data/experiences';
import ExperienceCard from '@/components/cards/ExperienceCard';
import FilterPanel from '@/components/catalog/FilterPanel';
import MobileFilterSheet from '@/components/catalog/MobileFilterSheet';
import PicksBanner from '@/components/catalog/PicksBanner';
import { defaultFilters, countActiveFilters } from '@/components/catalog/filterTypes';

export default function Catalog() {
  useDocumentTitle('Katalog iskustava');
  const [filters, setFilters] = useState(defaultFilters);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    return experiences.filter((exp) => {
      if (filters.categories.length > 0 && !filters.categories.includes(exp.category)) return false;
      if (filters.suitableFor !== 'sve' && !exp.suitableFor.includes(filters.suitableFor)) return false;
      if (filters.indoor !== 'sve' && exp.indoor !== filters.indoor && exp.indoor !== 'oba') return false;
      if (filters.maxPrice !== null && exp.priceFrom > filters.maxPrice) return false;
      if (filters.maxDuration !== null && exp.durationMinutes > filters.maxDuration) return false;
      if (filters.intensity !== 'sve' && exp.intensity !== filters.intensity) return false;
      if (filters.weatherDependent === 'da' && !exp.weatherDependent) return false;
      if (filters.weatherDependent === 'ne' && exp.weatherDependent) return false;
      return true;
    });
  }, [filters]);

  const activeCount = countActiveFilters(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">Katalog iskustava</h1>
        <p className="mt-2 text-ink-soft">
          Wellness, gastronomija, avantura, priroda, kultura i još mnogo toga — sve što možemo da uklopimo u vaš vikend.
        </p>
      </div>

      <PicksBanner />

      <div className="mt-6 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-ink/15 px-4 text-sm font-semibold text-ink"
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filteri {activeCount > 0 && `(${activeCount})`}
        </button>
        <p className="text-sm text-ink-soft">{filtered.length} iskustava</p>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl2 border border-ink/8 bg-warm-white p-5">
            <p className="mb-4 text-sm font-semibold text-ink">{filtered.length} iskustava</p>
            <FilterPanel filters={filters} onChange={setFilters} />
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-xl2 border border-dashed border-ink/15 p-10 text-center text-ink-soft">
              Nema iskustava koja odgovaraju izabranim filterima. Pokušajte da promenite ili resetujete filtere.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))}
            </div>
          )}
        </div>
      </div>

      <MobileFilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={filters}
        onChange={setFilters}
        resultCount={filtered.length}
      />
    </div>
  );
}
