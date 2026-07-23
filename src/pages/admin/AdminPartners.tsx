import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { listPartners } from '@/services/partnersStore';
import { listOffersForPartner } from '@/services/partnerOffersStore';
import type { PartnerStatus } from '@/types';
import { partnerCategoryLabels } from '@/utils/labels';
import { partnerStatusLabels, partnerStatusTone } from '@/utils/adminLabels';
import StatusPill from '@/components/admin/StatusPill';

const statusOptions = Object.keys(partnerStatusLabels) as PartnerStatus[];

export default function AdminPartners() {
  useDocumentTitle('Admin — Partneri');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<PartnerStatus | 'sve'>('sve');

  const partners = listPartners();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return partners.filter((p) => {
      if (status !== 'sve' && p.lifecycleStatus !== status) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [partners, query, status]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ink">Partneri</h1>
          <p className="mt-1.5 text-ink-soft">Centralni registar — svaki paket, iskustvo i itinerer čita odavde.</p>
        </div>
        <Link to="/admin/partneri/novi" className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-forest px-4 text-sm font-semibold text-warm-white hover:bg-forest/90">
          <Plus size={15} aria-hidden="true" /> Novi partner
        </Link>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1 sm:max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pretraga po nazivu…"
            className="min-h-[40px] w-full rounded-full border border-ink/15 bg-warm-white pl-9 pr-4 text-sm text-ink"
          />
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value as PartnerStatus | 'sve')} className="min-h-[40px] rounded-full border border-ink/15 bg-warm-white px-3 text-sm text-ink">
          <option value="sve">Svi statusi</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{partnerStatusLabels[s]}</option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-sm text-ink-soft">{filtered.length} {filtered.length === 1 ? 'partner' : 'partnera'}</p>

      <div className="mt-3 overflow-x-auto rounded-xl2 border border-ink/8 bg-warm-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-ink/8 text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Naziv</th>
              <th className="px-4 py-3">Kategorije</th>
              <th className="px-4 py-3">Lokacija</th>
              <th className="px-4 py-3">Ponude</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((partner) => (
              <tr key={partner.id} className="border-b border-ink/6 last:border-0 hover:bg-cream/60">
                <td className="px-4 py-3">
                  <Link to={`/admin/partneri/${partner.id}`} className="font-medium text-ink hover:text-forest">
                    {partner.name || '(bez naziva)'}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-soft">{partner.categories.map((c) => partnerCategoryLabels[c]).join(', ') || '—'}</td>
                <td className="px-4 py-3 text-ink-soft">{partner.location.area || '—'}</td>
                <td className="px-4 py-3 text-ink-soft">{listOffersForPartner(partner.id).length}</td>
                <td className="px-4 py-3">
                  <StatusPill label={partnerStatusLabels[partner.lifecycleStatus]} tone={partnerStatusTone[partner.lifecycleStatus]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-ink-soft">Nema partnera koji odgovaraju filterima.</p>}
      </div>
    </div>
  );
}
