import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { partners } from '@/data/partners';
import { partnerCategoryLabels } from '@/utils/labels';
import type { PartnerCategory } from '@/types';
import Image from '@/components/ui/Image';
import OfferStatusBadge from '@/components/partners/OfferStatusBadge';

const allCategories = Object.keys(partnerCategoryLabels) as PartnerCategory[];

export default function PartnerDirectory() {
  useDocumentTitle('Partneri');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<PartnerCategory | 'sve'>('sve');
  const [area, setArea] = useState('sve');

  const areas = useMemo(() => Array.from(new Set(partners.map((p) => p.location.area))).sort(), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return partners.filter((partner) => {
      if (category !== 'sve' && !partner.categories.includes(category)) return false;
      if (area !== 'sve' && partner.location.area !== area) return false;
      if (q && !`${partner.name} ${partner.oneLiner}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, category, area]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">Partneri</h1>
        <p className="mt-2 text-ink-soft">
          Svi partneri koji realizuju iskustva i smeštaj u VikArt paketima i planovima — sa konkretnim podacima, bez
          izmišljenih ocena ili broja gostiju.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1 sm:max-w-sm">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pretraži partnere…"
            className="min-h-[44px] w-full rounded-full border border-ink/15 bg-warm-white pl-10 pr-4 text-sm text-ink"
            aria-label="Pretraga partnera"
          />
        </label>

        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="min-h-[44px] rounded-full border border-ink/15 bg-warm-white px-4 text-sm text-ink"
          aria-label="Filter po lokaciji"
        >
          <option value="sve">Sve lokacije</option>
          {areas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory('sve')}
          className={`min-h-[36px] rounded-full border px-3 text-xs font-medium ${
            category === 'sve' ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'
          }`}
        >
          Sve kategorije
        </button>
        {allCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`min-h-[36px] rounded-full border px-3 text-xs font-medium ${
              category === c ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'
            }`}
          >
            {partnerCategoryLabels[c]}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-ink-soft">
        {filtered.length} {filtered.length === 1 ? 'partner' : 'partnera'}
      </p>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((partner) => (
          <article key={partner.id} className="flex flex-col overflow-hidden rounded-xl2 border border-ink/8 bg-warm-white shadow-card">
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image image={partner.media.mainPhoto} className="h-full w-full object-cover" />
              <OfferStatusBadge status={partner.status} className="absolute left-3 top-3" />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-serif text-lg text-ink">{partner.name}</h3>
              <p className="mt-1 text-xs text-ink-soft">
                {partner.categories.map((c) => partnerCategoryLabels[c]).join(' · ')}
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
                <MapPin size={13} aria-hidden="true" /> {partner.location.area}
              </p>
              <p className="mt-2 flex-1 text-sm text-ink-soft">{partner.oneLiner}</p>
              <Link
                to={`/partneri/${partner.slug}`}
                className="mt-4 flex min-h-[44px] items-center justify-center rounded-full bg-forest px-4 text-sm font-semibold text-warm-white hover:bg-forest/90"
              >
                Pogledaj partnera
              </Link>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full rounded-xl2 border border-dashed border-ink/15 p-8 text-center text-ink-soft">
            Nema partnera koji odgovaraju izabranim filterima.
          </p>
        )}
      </div>
    </div>
  );
}
