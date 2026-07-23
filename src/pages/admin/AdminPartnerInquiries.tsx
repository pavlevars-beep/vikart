import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { listPartnerInquiries } from '@/services/partnerInquiriesStore';
import type { PartnerInquiryStatus } from '@/types';
import { partnerCategoryLabels } from '@/utils/labels';
import { partnerInquiryStatusLabels, partnerInquiryStatusTone } from '@/utils/adminLabels';
import { formatDateTime } from '@/utils/format';
import StatusPill from '@/components/admin/StatusPill';

const statusOptions = Object.keys(partnerInquiryStatusLabels) as PartnerInquiryStatus[];

export default function AdminPartnerInquiries() {
  useDocumentTitle('Admin — Upiti partnera');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<PartnerInquiryStatus | 'sve'>('sve');

  const inquiries = listPartnerInquiries();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return inquiries.filter((inquiry) => {
      if (status !== 'sve' && inquiry.status !== status) return false;
      if (q && !`${inquiry.businessName} ${inquiry.contactName} ${inquiry.phone}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [inquiries, query, status]);

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Upiti partnera</h1>
      <p className="mt-1.5 text-ink-soft">Sve kratke prijave interesovanja poslate sa javnog sajta.</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1 sm:max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pretraga po nazivu, kontaktu ili telefonu…"
            className="min-h-[40px] w-full rounded-full border border-ink/15 bg-warm-white pl-9 pr-4 text-sm text-ink"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as PartnerInquiryStatus | 'sve')}
          className="min-h-[40px] rounded-full border border-ink/15 bg-warm-white px-3 text-sm text-ink"
        >
          <option value="sve">Svi statusi</option>
          {statusOptions.map((key) => (
            <option key={key} value={key}>
              {partnerInquiryStatusLabels[key]}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-sm text-ink-soft">{filtered.length} {filtered.length === 1 ? 'upit' : 'upita'}</p>

      <div className="mt-3 overflow-x-auto rounded-xl2 border border-ink/8 bg-warm-white">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-ink/8 text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Datum</th>
              <th className="px-4 py-3">Naziv</th>
              <th className="px-4 py-3">Kategorija</th>
              <th className="px-4 py-3">Kontakt</th>
              <th className="px-4 py-3">Telefon</th>
              <th className="px-4 py-3">Izvor</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inquiry) => (
              <tr key={inquiry.id} className="border-b border-ink/6 last:border-0 hover:bg-cream/60">
                <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{formatDateTime(inquiry.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link to={`/admin/upiti-partnera/${inquiry.id}`} className="font-medium text-ink hover:text-forest">
                    {inquiry.businessName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-soft">{inquiry.categories.map((c) => partnerCategoryLabels[c]).join(', ')}</td>
                <td className="px-4 py-3 text-ink-soft">{inquiry.contactName}</td>
                <td className="px-4 py-3 text-ink-soft">{inquiry.phone}</td>
                <td className="px-4 py-3 text-ink-soft">{inquiry.source}</td>
                <td className="px-4 py-3">
                  <StatusPill label={partnerInquiryStatusLabels[inquiry.status]} tone={partnerInquiryStatusTone[inquiry.status]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-ink-soft">Nema upita koji odgovaraju filterima.</p>
        )}
      </div>
    </div>
  );
}
