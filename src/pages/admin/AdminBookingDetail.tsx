import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getBookingById, updateBookingStatus, addBookingNote, saveBooking } from '@/services/bookingsStore';
import type { BookingStatus, PaymentStatus } from '@/types';
import { bookingStatusLabels, bookingStatusTone, paymentStatusLabels } from '@/utils/adminLabels';
import { formatDateTime, formatPrice } from '@/utils/format';
import StatusPill from '@/components/admin/StatusPill';

const statusOptions = Object.keys(bookingStatusLabels) as BookingStatus[];
const paymentStatusOptions = Object.keys(paymentStatusLabels) as PaymentStatus[];

export default function AdminBookingDetail() {
  const { id } = useParams<{ id: string }>();
  const [, rerender] = useState(0);
  const [noteText, setNoteText] = useState('');

  const booking = id ? getBookingById(id) : undefined;
  useDocumentTitle(booking ? `Rezervacija ${booking.referenceCode}` : 'Rezervacija nije pronađena');

  if (!booking || !id) {
    return (
      <div>
        <p className="text-ink-soft">Rezervacija nije pronađena.</p>
        <Link to="/admin/rezervacije" className="mt-3 inline-block text-sm font-semibold text-forest hover:underline">← Nazad na listu rezervacija</Link>
      </div>
    );
  }

  function refresh() {
    rerender((n) => n + 1);
  }

  function handleAddNote() {
    if (!noteText.trim() || !id) return;
    addBookingNote(id, noteText.trim());
    setNoteText('');
    refresh();
  }

  function handleStatusChange(status: BookingStatus) {
    if (!id) return;
    updateBookingStatus(id, status);
    refresh();
  }

  function handlePaymentStatusChange(paymentStatus: PaymentStatus) {
    if (!booking) return;
    saveBooking({ ...booking, payment: { ...booking.payment, paymentStatus } });
    refresh();
  }

  return (
    <div>
      <Link to="/admin/rezervacije" className="text-sm font-semibold text-forest hover:underline">← Sve rezervacije</Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ink">{booking.referenceCode}</h1>
          <p className="text-sm text-ink-soft">{formatDateTime(booking.createdAt)}</p>
        </div>
        <StatusPill label={bookingStatusLabels[booking.status]} tone={bookingStatusTone[booking.status]} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl2 border border-ink/8 bg-warm-white p-5">
            <h2 className="font-serif text-lg text-ink">Podaci gosta</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
              <div><dt className="text-ink-soft">Ime i prezime</dt><dd className="font-medium text-ink">{booking.fullName}</dd></div>
              <div><dt className="text-ink-soft">Broj gostiju</dt><dd className="font-medium text-ink">{booking.groupSize}</dd></div>
              <div><dt className="text-ink-soft">Telefon</dt><dd className="font-medium text-ink"><a href={`tel:${booking.phone}`} className="inline-flex items-center gap-1 hover:text-forest"><Phone size={13} aria-hidden="true" />{booking.phone}</a></dd></div>
              <div><dt className="text-ink-soft">Email</dt><dd className="font-medium text-ink"><a href={`mailto:${booking.email}`} className="inline-flex items-center gap-1 hover:text-forest"><Mail size={13} aria-hidden="true" />{booking.email}</a></dd></div>
              <div><dt className="text-ink-soft">Paket / plan</dt><dd className="font-medium text-ink">{booking.packageName ?? '—'}</dd></div>
              <div><dt className="text-ink-soft">Datum putovanja</dt><dd className="font-medium text-ink">{booking.travelDate ?? '—'}</dd></div>
            </dl>
            {booking.experienceNames.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-ink-soft">Izabrana iskustva</p>
                <p className="text-sm font-medium text-ink">{booking.experienceNames.join(', ')}</p>
              </div>
            )}
            {booking.dietary && (
              <div className="mt-3 rounded-lg bg-cream p-3 text-sm">
                <p className="font-semibold text-ink">Ishrana</p>
                <p className="text-ink-soft">
                  {[booking.dietary.vegetarian && 'Vegetarijanski', booking.dietary.vegan && 'Veganski', booking.dietary.allergies && `Alergije: ${booking.dietary.allergies}`, booking.dietary.religiousOrOther && `Restrikcija: ${booking.dietary.religiousOrOther}`]
                    .filter(Boolean)
                    .join(' · ') || 'Bez posebnih napomena'}
                </p>
                {booking.dietary.additionalNote && <p className="mt-1 text-ink-soft">{booking.dietary.additionalNote}</p>}
              </div>
            )}
          </section>

          <section className="rounded-xl2 border border-ink/8 bg-warm-white p-5">
            <h2 className="font-serif text-lg text-ink">Plaćanje</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
              <div><dt className="text-ink-soft">Ukupna cena</dt><dd className="font-semibold text-ink">{formatPrice(booking.payment.totalAmount)}</dd></div>
              <div><dt className="text-ink-soft">Avans ({booking.payment.depositPercent}%)</dt><dd className="font-medium text-ink">{formatPrice(booking.payment.depositAmount)}</dd></div>
              <div><dt className="text-ink-soft">Preostalo</dt><dd className="font-medium text-ink">{formatPrice(booking.payment.remainingAmount)}</dd></div>
              <div><dt className="text-ink-soft">Rok za ostatak</dt><dd className="font-medium text-ink">{booking.payment.remainingDueLabel}</dd></div>
            </dl>
            <label className="mt-3 block text-sm">
              <span className="mb-1 block font-medium text-ink">Status plaćanja</span>
              <select value={booking.payment.paymentStatus} onChange={(e) => handlePaymentStatusChange(e.target.value as PaymentStatus)} className="min-h-[38px] w-full max-w-xs rounded-lg border border-ink/15 bg-warm-white px-2 text-sm">
                {paymentStatusOptions.map((s) => (
                  <option key={s} value={s}>{paymentStatusLabels[s]}</option>
                ))}
              </select>
            </label>
          </section>

          {booking.snapshot && (
            <section className="rounded-xl2 border border-ink/8 bg-warm-white p-5">
              <h2 className="font-serif text-lg text-ink">Snapshot ugovorenih uslova</h2>
              <p className="mt-1 text-xs text-ink-soft">Snimljeno {formatDateTime(booking.snapshot.createdAt)} — kasnija izmena ponude ne menja ovaj snapshot.</p>
              <div className="mt-3 space-y-3">
                <div className="rounded-lg bg-cream p-3 text-sm">
                  <p className="font-semibold text-ink">Smeštaj: {booking.snapshot.accommodation.partnerName}</p>
                  <ul className="mt-1 list-inside list-disc text-ink-soft">
                    {booking.snapshot.accommodation.inclusions.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                </div>
                {booking.snapshot.experiences.map((exp) => (
                  <div key={exp.offerId || exp.partnerId} className="rounded-lg bg-cream p-3 text-sm">
                    <p className="font-semibold text-ink">{exp.offerName} — {exp.partnerName}</p>
                    {exp.priceBreakdown && <p className="text-ink-soft">Cena u trenutku slanja: {formatPrice(exp.priceBreakdown.totalAmount)}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-xl2 border border-ink/8 bg-warm-white p-5">
            <h2 className="font-serif text-lg text-ink">Beleške</h2>
            <div className="mt-3 flex gap-2">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Dodaj belešku…"
                className="min-h-[40px] flex-1 rounded-lg border border-ink/15 bg-warm-white px-3 text-sm text-ink"
              />
              <button type="button" onClick={handleAddNote} className="min-h-[40px] flex-none rounded-full bg-forest px-4 text-sm font-semibold text-warm-white">Dodaj</button>
            </div>
            <ul className="mt-3 space-y-2">
              {booking.notes.slice().reverse().map((note) => (
                <li key={note.id} className="rounded-lg bg-cream p-3 text-sm">
                  <p className="text-ink">{note.text}</p>
                  <p className="mt-1 text-xs text-ink-soft">{note.authorName} · {formatDateTime(note.createdAt)}</p>
                </li>
              ))}
              {booking.notes.length === 0 && <li className="text-sm text-ink-soft">Još nema beleški.</li>}
            </ul>
          </section>

          <section className="rounded-xl2 border border-ink/8 bg-warm-white p-5">
            <h2 className="font-serif text-lg text-ink">Istorija aktivnosti</h2>
            <ul className="mt-3 space-y-2">
              {booking.activity.slice().reverse().map((entry) => (
                <li key={entry.id} className="text-sm">
                  <span className="text-ink">{entry.description}</span> <span className="text-xs text-ink-soft">— {formatDateTime(entry.createdAt)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="rounded-xl2 border border-ink/8 bg-warm-white p-4">
          <h2 className="font-serif text-base text-ink">Status upita</h2>
          <select
            value={booking.status}
            onChange={(e) => handleStatusChange(e.target.value as BookingStatus)}
            className="mt-2 min-h-[40px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{bookingStatusLabels[s]}</option>
            ))}
          </select>
        </aside>
      </div>
    </div>
  );
}
