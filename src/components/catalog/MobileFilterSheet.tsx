import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { CatalogFilters } from './filterTypes';
import FilterPanel from './FilterPanel';

interface MobileFilterSheetProps {
  open: boolean;
  onClose: () => void;
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  resultCount: number;
}

export default function MobileFilterSheet({ open, onClose, filters, onChange, resultCount }: MobileFilterSheetProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-warm-white lg:hidden" role="dialog" aria-modal="true" aria-label="Filteri">
      <div className="flex items-center justify-between border-b border-ink/10 px-4 py-4">
        <h2 className="font-serif text-xl text-ink">Filteri</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Zatvori filtere"
          className="flex h-11 w-11 items-center justify-center rounded-full text-ink"
        >
          <X size={22} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <FilterPanel filters={filters} onChange={onChange} />
      </div>
      <div className="border-t border-ink/10 p-4">
        <button
          type="button"
          onClick={onClose}
          className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-warm-white"
        >
          Prikaži {resultCount} {resultCount === 1 ? 'iskustvo' : 'iskustva'}
        </button>
      </div>
    </div>
  );
}
