import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Phone, Mail, ExternalLink, CalendarClock, UserCheck, Ban, ArrowRightCircle, Clock } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  getPartnerInquiryById,
  addPartnerInquiryNote,
  logPartnerInquiryActivity,
  updatePartnerInquiryStatus,
  rejectPartnerInquiry,
  linkPartnerInquiryToPartner,
} from '@/services/partnerInquiriesStore';
import { createDraftPartnerFromInquiry } from '@/services/partnersStore';
import { partnerCategoryLabels } from '@/utils/labels';
import { partnerInquiryStatusLabels, partnerInquiryStatusTone } from '@/utils/adminLabels';
import { formatDateTime } from '@/utils/format';
import StatusPill from '@/components/admin/StatusPill';
import ConfirmButton from '@/components/admin/ConfirmButton';

const rejectionReasons = [
  'Ne uklapa se u trenutnu ponudu VikArt-a',
  'Nedovoljno informacija za procenu',
  'Nije bilo moguće uspostaviti kontakt',
  'Partner je odustao',
  'Drugo',
];

export default function AdminPartnerInquiryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [, forceRerender] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState(rejectionReasons[0]);
  const [rejectionCustom, setRejectionCustom] = useState('');

  const inquiry = id ? getPartnerInquiryById(id) : undefined;
  useDocumentTitle(inquiry ? `Upit — ${inquiry.businessName}` : 'Upit nije pronađen');

  function refresh() {
    forceRerender((n) => n + 1);
  }

  if (!inquiry) {
    return (
      <div>
        <p className="text-ink-soft">Upit nije pronađen.</p>
        <Link to="/admin/upiti-partnera" className="mt-3 inline-block text-sm font-semibold text-forest hover:underline">
          ← Nazad na listu upita
        </Link>
      </div>
    );
  }

  const handleAddNote = () => {
    if (!noteText.trim() || !id) return;
    addPartnerInquiryNote(id, noteText.trim());
    setNoteText('');
    refresh();
  };

  const handleMarkContacted = () => {
    if (!id) return;
    updatePartnerInquiryStatus(id, 'reviewing', 'Označeno kao kontaktirano.');
    refresh();
  };

  const handleScheduleMeeting = () => {
    if (!id) return;
    updatePartnerInquiryStatus(id, 'meeting_scheduled', 'Zakazan razgovor sa partnerom.');
    refresh();
  };

  const handleReject = () => {
    if (!id) return;
    const reason = rejectionReason === 'Drugo' ? rejectionCustom.trim() || 'Drugo' : rejectionReason;
    rejectPartnerInquiry(id, reason);
    setRejecting(false);
    refresh();
  };

  const handleAcceptForOnboarding = () => {
    if (!id) return;
    const partner = createDraftPartnerFromInquiry(inquiry);
    linkPartnerInquiryToPartner(id, partner.id);
    navigate(`/admin/partneri/${partner.id}`);
  };

  const handleOpenLink = () => {
    if (!id || !inquiry.link) return;
    logPartnerInquiryActivity(id, 'link_opened', `Otvoren dostavljeni link: ${inquiry.link}`);
    refresh();
  };

  return (
    <div>
      <Link to="/admin/upiti-partnera" className="text-sm font-semibold text-forest hover:underline">
        ← Svi upiti partnera
      </Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ink">{inquiry.businessName}</h1>
          <p className="text-sm text-ink-soft">{inquiry.categories.map((c) => partnerCategoryLabels[c]).join(', ')}</p>
        </div>
        <StatusPill label={partnerInquiryStatusLabels[inquiry.status]} tone={partnerInquiryStatusTone[inquiry.status]} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl2 border border-ink/8 bg-warm-white p-5">
            <h2 className="font-serif text-lg text-ink">Podaci iz prijave</h2>
            <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-sm">
              <div><dt className="text-ink-soft">Kontakt osoba</dt><dd className="font-medium text-ink">{inquiry.contactName}</dd></div>
              <div><dt className="text-ink-soft">Telefon</dt><dd className="font-medium text-ink">{inquiry.phone}</dd></div>
              <div><dt className="text-ink-soft">Email</dt><dd className="font-medium text-ink">{inquiry.email || '—'}</dd></div>
              <div><dt className="text-ink-soft">Link</dt><dd className="font-medium text-ink">{inquiry.link || '—'}</dd></div>
              <div><dt className="text-ink-soft">Izvor</dt><dd className="font-medium text-ink">{inquiry.source}</dd></div>
              <div><dt className="text-ink-soft">Datum prijave</dt><dd className="font-medium text-ink">{formatDateTime(inquiry.createdAt)}</dd></div>
            </dl>
            {inquiry.note && (
              <div className="mt-3 rounded-lg bg-cream p-3 text-sm text-ink-soft">
                <span className="font-semibold text-ink">Napomena partnera: </span>{inquiry.note}
              </div>
            )}
            {inquiry.rejectionReason && (
              <div className="mt-3 rounded-lg bg-terracotta/10 p-3 text-sm text-terracotta">
                <span className="font-semibold">Razlog odbijanja: </span>{inquiry.rejectionReason}
              </div>
            )}
            {inquiry.linkedPartnerId && (
              <p className="mt-3 text-sm">
                Povezan Partner draft:{' '}
                <Link to={`/admin/partneri/${inquiry.linkedPartnerId}`} className="font-semibold text-forest hover:underline">
                  otvori →
                </Link>
              </p>
            )}
          </section>

          <section className="rounded-xl2 border border-ink/8 bg-warm-white p-5">
            <h2 className="font-serif text-lg text-ink">Beleške</h2>
            <div className="mt-3 flex gap-2">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Dodaj belešku…"
                className="min-h-[40px] flex-1 rounded-lg border border-ink/15 bg-warm-white px-3 text-sm text-ink"
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="min-h-[40px] flex-none rounded-full bg-forest px-4 text-sm font-semibold text-warm-white"
              >
                Dodaj
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {inquiry.notes.slice().reverse().map((note) => (
                <li key={note.id} className="rounded-lg bg-cream p-3 text-sm">
                  <p className="text-ink">{note.text}</p>
                  <p className="mt-1 text-xs text-ink-soft">{note.authorName} · {formatDateTime(note.createdAt)}</p>
                </li>
              ))}
              {inquiry.notes.length === 0 && <li className="text-sm text-ink-soft">Još nema beleški.</li>}
            </ul>
          </section>

          <section className="rounded-xl2 border border-ink/8 bg-warm-white p-5">
            <h2 className="inline-flex items-center gap-1.5 font-serif text-lg text-ink">
              <Clock size={16} aria-hidden="true" /> Istorija aktivnosti
            </h2>
            <ul className="mt-3 space-y-2">
              {inquiry.activity.slice().reverse().map((entry) => (
                <li key={entry.id} className="text-sm">
                  <span className="text-ink">{entry.description}</span>{' '}
                  <span className="text-xs text-ink-soft">— {formatDateTime(entry.createdAt)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-3">
          <div className="rounded-xl2 border border-ink/8 bg-warm-white p-4">
            <h2 className="font-serif text-base text-ink">Akcije</h2>
            <div className="mt-3 flex flex-col gap-2">
              <a href={`tel:${inquiry.phone}`} className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-ink/15 px-3 text-sm font-medium text-ink hover:bg-cream">
                <Phone size={14} aria-hidden="true" /> Pozovi
              </a>
              {inquiry.email && (
                <a href={`mailto:${inquiry.email}`} className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-ink/15 px-3 text-sm font-medium text-ink hover:bg-cream">
                  <Mail size={14} aria-hidden="true" /> Pošalji email
                </a>
              )}
              {inquiry.link && (
                <a
                  href={inquiry.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleOpenLink}
                  className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-ink/15 px-3 text-sm font-medium text-ink hover:bg-cream"
                >
                  <ExternalLink size={14} aria-hidden="true" /> Otvori link
                </a>
              )}
              <button type="button" onClick={handleMarkContacted} className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-ink/15 px-3 text-sm font-medium text-ink hover:bg-cream">
                <UserCheck size={14} aria-hidden="true" /> Označi kao kontaktiran
              </button>
              <button type="button" onClick={handleScheduleMeeting} className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-ink/15 px-3 text-sm font-medium text-ink hover:bg-cream">
                <CalendarClock size={14} aria-hidden="true" /> Zakaži razgovor
              </button>

              <div className="mt-2 border-t border-ink/8 pt-3">
                <ConfirmButton
                  label="Prihvati za unos"
                  confirmLabel="Da, kreiraj Partner draft"
                  onConfirm={handleAcceptForOnboarding}
                  className="w-full justify-center border-forest text-forest hover:bg-sage"
                />
              </div>

              {!rejecting ? (
                <button
                  type="button"
                  onClick={() => setRejecting(true)}
                  className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-full border border-terracotta/30 px-3 text-sm font-medium text-terracotta hover:bg-terracotta/10"
                >
                  <Ban size={14} aria-hidden="true" /> Odbij
                </button>
              ) : (
                <div className="rounded-lg border border-terracotta/20 bg-terracotta/5 p-3">
                  <label className="text-xs font-medium text-ink">Razlog odbijanja</label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="mt-1 min-h-[36px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm"
                  >
                    {rejectionReasons.map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                  {rejectionReason === 'Drugo' && (
                    <input
                      value={rejectionCustom}
                      onChange={(e) => setRejectionCustom(e.target.value)}
                      placeholder="Unesite razlog…"
                      className="mt-2 min-h-[36px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm"
                    />
                  )}
                  <div className="mt-2 flex gap-2">
                    <button type="button" onClick={handleReject} className="min-h-[36px] flex-1 rounded-full bg-terracotta px-3 text-xs font-semibold text-warm-white">
                      Potvrdi odbijanje
                    </button>
                    <button type="button" onClick={() => setRejecting(false)} className="min-h-[36px] flex-1 rounded-full border border-ink/15 px-3 text-xs font-medium text-ink-soft">
                      Otkaži
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {inquiry.status === 'accepted_for_onboarding' && inquiry.linkedPartnerId && (
            <Link
              to={`/admin/partneri/${inquiry.linkedPartnerId}`}
              className="flex min-h-[44px] items-center justify-center gap-1.5 rounded-full bg-forest px-4 text-sm font-semibold text-warm-white hover:bg-forest/90"
            >
              Otvori onboarding <ArrowRightCircle size={16} aria-hidden="true" />
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}
