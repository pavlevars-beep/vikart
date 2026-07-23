import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { listPartnerOffers } from '@/services/partnerOffersStore';
import { listPartners } from '@/services/partnersStore';
import type { PartnerOfferStatus } from '@/types';
import { partnerOfferStatusLabels, partnerOfferStatusTone } from '@/utils/adminLabels';
import { formatPrice } from '@/utils/format';
import StatusPill from '@/components/admin/StatusPill';

const statusOptions = Object.keys(partnerOfferStatusLabels) as PartnerOfferStatus[];

export default function AdminOffers() {
  useDocumentTitle('Admin — Ponude');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<PartnerOfferStatus | 'sve'>('sve');

  const offers = listPartnerOffers();
  const partners = listPartners();
  const partnerName = (id: string) => partners.find((p) => p.id === id)?.name ?? id;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return offers.filter((o) => {
      if (status !== 'sve' && o.lifecycleStatus !== status) return false;
      if (q && !`${o.name} ${partnerName(o.partnerId)}`.toLowerCase().includes(q)) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offers, query, status]);

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Ponude</h1>
      <p className="mt-1.5 text-ink-soft">Sve konkretne ponude svih partnera. Uređivanje se vrši u profilu partnera.</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1 sm:max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pretraga po nazivu ponude ili partneru…"
            className="min-h-[40px] w-full rounded-full border border-ink/15 bg-warm-white pl-9 pr-4 text-sm text-ink"
          />
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value as PartnerOfferStatus | 'sve')} className="min-h-[40px] rounded-full border border-ink/15 bg-warm-white px-3 text-sm text-ink">
          <option value="sve">Svi statusi</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{partnerOfferStatusLabels[s]}</option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-sm text-ink-soft">{filtered.length} {filtered.length === 1 ? 'ponuda' : 'ponuda'}</p>

      <div className="mt-3 overflow-x-auto rounded-xl2 border border-ink/8 bg-warm-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-ink/8 text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Ponuda</th>
              <th className="px-4 py-3">Partner</th>
              <th className="px-4 py-3">Model cene</th>
              <th className="px-4 py-3">Osnovna cena</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((offer) => (
              <tr key={offer.id} className="border-b border-ink/6 last:border-0 hover:bg-cream/60">
                <td className="px-4 py-3 font-medium text-ink">{offer.name}</td>
                <td className="px-4 py-3 text-ink-soft">
                  <Link to={`/admin/partneri/${offer.partnerId}`} className="hover:text-forest">{partnerName(offer.partnerId)}</Link>
                </td>
                <td className="px-4 py-3 text-ink-soft">{offer.pricingModel.unit}</td>
                <td className="px-4 py-3 text-ink-soft">{offer.pricingModel.unit === 'na_upit' ? 'Na upit' : formatPrice(offer.pricingModel.basePrice)}</td>
                <td className="px-4 py-3">
                  <StatusPill label={partnerOfferStatusLabels[offer.lifecycleStatus]} tone={partnerOfferStatusTone[offer.lifecycleStatus]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-ink-soft">Nema ponuda koje odgovaraju filterima.</p>}
      </div>
    </div>
  );
}
