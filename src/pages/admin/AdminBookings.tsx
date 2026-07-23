import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { listBookings } from '@/services/bookingsStore';
import type { BookingStatus } from '@/types';
import { bookingStatusLabels, bookingStatusTone } from '@/utils/adminLabels';
import { formatDateTime, formatPrice } from '@/utils/format';
import StatusPill from '@/components/admin/StatusPill';

const statusOptions = Object.keys(bookingStatusLabels) as BookingStatus[];

export default function AdminBookings() {
  useDocumentTitle('Admin — Rezervacije');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<BookingStatus | 'sve'>('sve');

  const bookings = listBookings();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      if (status !== 'sve' && b.status !== status) return false;
      if (q && !`${b.fullName} ${b.phone} ${b.referenceCode}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [bookings, query, status]);

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Rezervacije</h1>
      <p className="mt-1.5 text-ink-soft">Svi korisnički upiti poslati sa stranice plana.</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1 sm:max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pretraga po imenu, telefonu ili broju upita…"
            className="min-h-[40px] w-full rounded-full border border-ink/15 bg-warm-white pl-9 pr-4 text-sm text-ink"
          />
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value as BookingStatus | 'sve')} className="min-h-[40px] rounded-full border border-ink/15 bg-warm-white px-3 text-sm text-ink">
          <option value="sve">Svi statusi</option>
          {statusOptions.map((s) => (
            <option key={s} value={s}>{bookingStatusLabels[s]}</option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-sm text-ink-soft">{filtered.length} {filtered.length === 1 ? 'upit' : 'upita'}</p>

      <div className="mt-3 overflow-x-auto rounded-xl2 border border-ink/8 bg-warm-white">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-ink/8 text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Broj</th>
              <th className="px-4 py-3">Datum</th>
              <th className="px-4 py-3">Ime</th>
              <th className="px-4 py-3">Gostiju</th>
              <th className="px-4 py-3">Paket</th>
              <th className="px-4 py-3">Ukupno</th>
              <th className="px-4 py-3">Avans</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((booking) => (
              <tr key={booking.id} className="border-b border-ink/6 last:border-0 hover:bg-cream/60">
                <td className="px-4 py-3">
                  <Link to={`/admin/rezervacije/${booking.id}`} className="font-medium text-ink hover:text-forest">
                    {booking.referenceCode}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-ink-soft">{formatDateTime(booking.createdAt)}</td>
                <td className="px-4 py-3 text-ink-soft">{booking.fullName}</td>
                <td className="px-4 py-3 text-ink-soft">{booking.groupSize}</td>
                <td className="px-4 py-3 text-ink-soft">{booking.packageName ?? '—'}</td>
                <td className="px-4 py-3 text-ink-soft">{formatPrice(booking.totalPrice)}</td>
                <td className="px-4 py-3 text-ink-soft">{formatPrice(booking.payment.depositAmount)}</td>
                <td className="px-4 py-3">
                  <StatusPill label={bookingStatusLabels[booking.status]} tone={bookingStatusTone[booking.status]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center text-sm text-ink-soft">Nema rezervacija koje odgovaraju filterima.</p>}
      </div>
    </div>
  );
}
