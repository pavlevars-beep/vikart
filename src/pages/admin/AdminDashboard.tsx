import { Link } from 'react-router-dom';
import { Inbox, PhoneCall, Wrench, CheckCircle2, Globe2, Package, CalendarCheck, AlertTriangle } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { listPartnerInquiries } from '@/services/partnerInquiriesStore';
import { listPartners } from '@/services/partnersStore';
import { listPartnerOffers } from '@/services/partnerOffersStore';
import { listBookings } from '@/services/bookingsStore';
import AdminStatCard from '@/components/admin/AdminStatCard';
import StatusPill from '@/components/admin/StatusPill';
import { partnerInquiryStatusLabels, partnerInquiryStatusTone } from '@/utils/adminLabels';
import { formatDateTime } from '@/utils/format';

export default function AdminDashboard() {
  useDocumentTitle('Admin — Dashboard');

  const inquiries = listPartnerInquiries();
  const partners = listPartners();
  const offers = listPartnerOffers();
  const bookings = listBookings();

  const newInquiries = inquiries.filter((i) => i.status === 'new').length;
  const waitingContact = inquiries.filter((i) => i.status === 'contact_needed' || i.status === 'reviewing').length;
  const onboarding = partners.filter((p) => p.lifecycleStatus === 'onboarding' || p.lifecycleStatus === 'draft').length;
  const readyForReview = partners.filter((p) => p.lifecycleStatus === 'ready_for_review' || p.lifecycleStatus === 'approved').length;
  const published = partners.filter((p) => p.lifecycleStatus === 'published').length;
  const activeOffers = offers.filter((o) => o.lifecycleStatus === 'active').length;
  const inactiveOffers = offers.filter((o) => o.lifecycleStatus !== 'active').length;
  const newBookings = bookings.filter((b) => b.status === 'nov_upit' || b.status === 'u_proveri').length;

  const needsReaction = [
    ...inquiries
      .filter((i) => i.status === 'new' || i.status === 'contact_needed')
      .map((i) => ({ id: i.id, label: `Upit partnera: ${i.businessName}`, to: `/admin/upiti-partnera/${i.id}`, when: i.createdAt })),
    ...bookings
      .filter((b) => b.status === 'nov_upit' || b.status === 'u_proveri')
      .map((b) => ({ id: b.id, label: `Rezervacija ${b.referenceCode}: ${b.fullName}`, to: `/admin/rezervacije/${b.id}`, when: b.createdAt })),
  ]
    .sort((a, b) => b.when.localeCompare(a.when))
    .slice(0, 8);

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Dashboard</h1>
      <p className="mt-1.5 text-ink-soft">Pregled ključnih brojki i onoga što čeka vašu reakciju.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <AdminStatCard label="Novi partnerski upiti" value={newInquiries} icon={Inbox} to="/admin/upiti-partnera" tone={newInquiries > 0 ? 'gold' : 'default'} />
        <AdminStatCard label="Čekaju kontakt" value={waitingContact} icon={PhoneCall} to="/admin/upiti-partnera" />
        <AdminStatCard label="Partneri u ugovaranju" value={onboarding} icon={Wrench} to="/admin/partneri" />
        <AdminStatCard label="Spremni za objavu" value={readyForReview} icon={CheckCircle2} to="/admin/partneri" tone={readyForReview > 0 ? 'gold' : 'default'} />
        <AdminStatCard label="Objavljeni partneri" value={published} icon={Globe2} to="/admin/partneri" />
        <AdminStatCard label="Aktivne ponude" value={activeOffers} icon={Package} to="/admin/ponude" />
        <AdminStatCard label="Neaktivne ponude" value={inactiveOffers} icon={Package} to="/admin/ponude" />
        <AdminStatCard label="Novi korisnički upiti" value={newBookings} icon={CalendarCheck} to="/admin/rezervacije" tone={newBookings > 0 ? 'gold' : 'default'} />
      </div>

      <section className="mt-8 rounded-xl2 border border-ink/8 bg-warm-white p-5">
        <h2 className="inline-flex items-center gap-2 font-serif text-xl text-ink">
          <AlertTriangle size={18} className="text-gold" aria-hidden="true" /> Čeka vašu reakciju
        </h2>
        {needsReaction.length === 0 ? (
          <p className="mt-3 text-sm text-ink-soft">Trenutno nema stavki koje čekaju reakciju.</p>
        ) : (
          <ul className="mt-3 divide-y divide-ink/8">
            {needsReaction.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                <Link to={item.to} className="text-sm font-medium text-ink hover:text-forest">
                  {item.label}
                </Link>
                <span className="flex-none text-xs text-ink-soft">{formatDateTime(item.when)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-xl2 border border-ink/8 bg-warm-white p-5">
        <h2 className="font-serif text-xl text-ink">Poslednji partnerski upiti</h2>
        <ul className="mt-3 divide-y divide-ink/8">
          {inquiries.slice(0, 5).map((inquiry) => (
            <li key={inquiry.id} className="flex items-center justify-between gap-3 py-2.5">
              <Link to={`/admin/upiti-partnera/${inquiry.id}`} className="text-sm font-medium text-ink hover:text-forest">
                {inquiry.businessName}
              </Link>
              <StatusPill label={partnerInquiryStatusLabels[inquiry.status]} tone={partnerInquiryStatusTone[inquiry.status]} />
            </li>
          ))}
          {inquiries.length === 0 && <li className="py-2.5 text-sm text-ink-soft">Još nema partnerskih upita.</li>}
        </ul>
      </section>
    </div>
  );
}
