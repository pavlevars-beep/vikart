import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';
import { useCatalogPicks } from '@/hooks/useCatalogPicks';

function pluralizeExperience(count: number): string {
  if (count === 1) return 'iskustvo';
  if (count >= 2 && count <= 4) return 'iskustva';
  return 'iskustava';
}

export default function PicksBanner() {
  const { picks, clearPicks } = useCatalogPicks();

  if (picks.length === 0) return null;

  return (
    <div className="mt-6 flex flex-col items-start justify-between gap-3 rounded-xl2 border border-gold/30 bg-gold/10 p-4 sm:flex-row sm:items-center">
      <p className="text-sm font-medium text-ink">
        Sačuvali ste {picks.length} {pluralizeExperience(picks.length)} za svoj vikend — nastavite kroz konfigurator da
        dobijete ceo plan sa smeštajem i rasporedom.
      </p>
      <div className="flex flex-none items-center gap-4">
        <button
          type="button"
          onClick={clearPicks}
          className="inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-terracotta"
        >
          <X size={15} aria-hidden="true" /> Očisti
        </button>
        <Link
          to="/konfigurator"
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-forest px-4 text-sm font-semibold text-warm-white hover:bg-forest/90"
        >
          Nastavi ka konfiguratoru <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
