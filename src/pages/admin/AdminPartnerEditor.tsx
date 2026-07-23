import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { Partner, PartnerOffer, PartnerStatus, PartnerCategory, AccommodationLocationTag } from '@/types';
import { emptyPlacement } from '@/types';
import { getPartnerById, savePartner } from '@/services/partnersStore';
import { listOffersForPartner, savePartnerOffer, deletePartnerOffer, createOfferId } from '@/services/partnerOffersStore';
import { listPartnerInquiries } from '@/services/partnerInquiriesStore';
import { partnerCategoryLabels } from '@/utils/labels';
import { partnerStatusLabels, partnerStatusTone } from '@/utils/adminLabels';
import { getPublishBlockers, getCompletenessPercent } from '@/utils/partnerPublishValidation';
import StatusPill from '@/components/admin/StatusPill';
import ConfirmButton from '@/components/admin/ConfirmButton';
import AdminOfferEditor from '@/components/admin/AdminOfferEditor';
import AdminImagePicker from '@/components/admin/AdminImagePicker';
import AdminGalleryEditor from '@/components/admin/AdminGalleryEditor';
import RowListEditor from '@/components/admin/RowListEditor';

const categoryOptions = Object.keys(partnerCategoryLabels) as PartnerCategory[];
const locationTagLabels: Record<AccommodationLocationTag, string> = {
  central: 'Centar',
  near_center: 'Blizu centra',
  quiet_area: 'Mirniji kraj',
  nature: 'Priroda',
  remote: 'Izdvojeno',
};

const TABS = ['Osnovno', 'Identitet i mediji', 'Ponude', 'Objavljivanje'] as const;

function Field({ label, value, onChange, type = 'text', className = '' }: { label: string; value: string; onChange: (v: string) => void; type?: string; className?: string }) {
  return (
    <label className={`text-sm ${className}`}>
      <span className="mb-1 block font-medium text-ink">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="min-h-[40px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-sm text-ink" />
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number | undefined; onChange: (v: number | undefined) => void }) {
  return (
    <label className="text-sm">
      <span className="mb-1 block font-medium text-ink">{label}</span>
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        className="min-h-[40px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-sm text-ink"
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-ink/30" />
      {label}
    </label>
  );
}

export default function AdminPartnerEditor() {
  const { id } = useParams<{ id: string }>();
  const initial = id ? getPartnerById(id) : undefined;
  const [partner, setPartner] = useState<Partner | undefined>(initial);
  const [offers, setOffers] = useState<PartnerOffer[]>(id ? listOffersForPartner(id) : []);
  const [tab, setTab] = useState<(typeof TABS)[number]>('Osnovno');
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useDocumentTitle(partner ? `Partner — ${partner.name || '(bez naziva)'}` : 'Partner nije pronađen');

  if (!partner || !id) {
    return (
      <div>
        <p className="text-ink-soft">Partner nije pronađen.</p>
        <Link to="/admin/partneri" className="mt-3 inline-block text-sm font-semibold text-forest hover:underline">← Nazad na listu partnera</Link>
      </div>
    );
  }

  function updatePartner(patch: Partial<Partner>) {
    setPartner((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      savePartner(next);
      setSavedAt(new Date().toISOString());
      return next;
    });
  }

  const toggleCategory = (category: PartnerCategory) => {
    const next = partner.categories.includes(category) ? partner.categories.filter((c) => c !== category) : [...partner.categories, category];
    updatePartner({ categories: next });
  };

  const toggleLocationTag = (tag: AccommodationLocationTag) => {
    const current = partner.locationTags ?? [];
    const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    updatePartner({ locationTags: next });
  };

  function updateOffer(offerId: string, patch: Partial<PartnerOffer>) {
    setOffers((prev) => {
      const next = prev.map((o) => (o.id === offerId ? { ...o, ...patch } : o));
      const updated = next.find((o) => o.id === offerId);
      if (updated) savePartnerOffer(updated);
      return next;
    });
  }

  const addOffer = () => {
    const newOffer: PartnerOffer = {
      id: createOfferId(partner.id),
      partnerId: partner.id,
      name: 'Nova ponuda',
      shortDescription: '',
      status: 'available_on_request',
      lifecycleStatus: 'draft',
      pricingModel: { unit: 'na_upit', currency: 'RSD', basePrice: 0 },
      placement: emptyPlacement(),
      narrative: '',
      primaryVariant: { name: '', description: '', priceImpact: '' },
      substitution: { allowedSubstitutions: '', conditions: '', priceImpact: 'bez promene cene', consentRequired: true },
      cancellation: { freeUntilLabel: '', latePolicy: '', noShowPolicy: '' },
      safety: { restrictions: [], safetyRules: [], badWeatherProcedure: '', dayOfContact: '' },
      intensity: 'lagano',
      schedule: { meetingPoint: '', meetingTime: '', arrivalBufferMinutes: 0, durationLabel: '', sequence: [], whatToBring: [] },
      inclusions: [],
      exclusions: [],
      addOns: [],
    };
    savePartnerOffer(newOffer);
    setOffers((prev) => [...prev, newOffer]);
  };

  const duplicateOffer = (offer: PartnerOffer) => {
    const copy: PartnerOffer = { ...offer, id: createOfferId(partner.id), name: `${offer.name} (kopija)`, lifecycleStatus: 'draft' };
    savePartnerOffer(copy);
    setOffers((prev) => [...prev, copy]);
  };

  function removeOffer(offerId: string) {
    deletePartnerOffer(offerId);
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
  }

  const blockers = getPublishBlockers(partner, offers);
  const completeness = getCompletenessPercent(partner, offers);
  const sourceInquiry = listPartnerInquiries().find((i) => i.linkedPartnerId === partner.id);

  function setLifecycle(status: PartnerStatus) {
    updatePartner({ lifecycleStatus: status });
  }

  return (
    <div>
      <Link to="/admin/partneri" className="text-sm font-semibold text-forest hover:underline">← Svi partneri</Link>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ink">{partner.name || '(bez naziva)'}</h1>
          {sourceInquiry && (
            <p className="text-sm text-ink-soft">
              Nastao iz upita: <Link to={`/admin/upiti-partnera/${sourceInquiry.id}`} className="font-semibold text-forest hover:underline">{sourceInquiry.businessName}</Link>
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {savedAt && <span className="inline-flex items-center gap-1 text-xs text-ink-soft"><CheckCircle2 size={13} aria-hidden="true" /> Sačuvano</span>}
          <StatusPill label={partnerStatusLabels[partner.lifecycleStatus]} tone={partnerStatusTone[partner.lifecycleStatus]} />
        </div>
      </div>

      <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-ink/10">
        <div className="h-full bg-forest transition-all" style={{ width: `${completeness}%` }} />
      </div>
      <p className="mt-1 text-xs text-ink-soft">{completeness}% spremno za objavu</p>

      <div className="mt-5 flex flex-wrap gap-1.5 border-b border-ink/10 pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${tab === t ? 'bg-sage text-forest' : 'text-ink-soft hover:bg-cream'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === 'Osnovno' && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Poslovni i javni naziv" value={partner.name} onChange={(v) => updatePartner({ name: v })} className="sm:col-span-2" />
              <fieldset className="text-sm sm:col-span-2">
                <legend className="mb-1.5 font-medium text-ink">Kategorije</legend>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((c) => (
                    <button key={c} type="button" onClick={() => toggleCategory(c)} className={`rounded-full border px-2.5 py-1 text-xs font-medium ${partner.categories.includes(c) ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'}`}>
                      {partnerCategoryLabels[c]}
                    </button>
                  ))}
                </div>
              </fieldset>
              <Field label="Pravno lice" value={partner.legalEntityName ?? ''} onChange={(v) => updatePartner({ legalEntityName: v })} />
              <Field label="PIB" value={partner.taxId ?? ''} onChange={(v) => updatePartner({ taxId: v })} />
              <Field label="Matični broj" value={partner.registrationNumber ?? ''} onChange={(v) => updatePartner({ registrationNumber: v })} />
              <Field label="Radno vreme" value={partner.hoursLabel ?? ''} onChange={(v) => updatePartner({ hoursLabel: v })} />
              <Field label="Telefon" value={partner.contact.phone ?? ''} onChange={(v) => updatePartner({ contact: { ...partner.contact, phone: v } })} />
              <Field label="Email" value={partner.contact.email ?? ''} onChange={(v) => updatePartner({ contact: { ...partner.contact, email: v } })} />
              <Field label="Sajt" value={partner.contact.website ?? ''} onChange={(v) => updatePartner({ contact: { ...partner.contact, website: v } })} />
              <Field label="Instagram" value={partner.contact.instagram ?? ''} onChange={(v) => updatePartner({ contact: { ...partner.contact, instagram: v } })} />
              <Field label="Facebook" value={partner.contact.facebook ?? ''} onChange={(v) => updatePartner({ contact: { ...partner.contact, facebook: v } })} />
              <Field label="Adresa" value={partner.location.address} onChange={(v) => updatePartner({ location: { ...partner.location, address: v } })} />
              <Field label="Oblast / naselje" value={partner.location.area} onChange={(v) => updatePartner({ location: { ...partner.location, area: v } })} />
              <Field label="Link ka mapi" value={partner.location.mapUrl ?? ''} onChange={(v) => updatePartner({ location: { ...partner.location, mapUrl: v } })} className="sm:col-span-2" />
              <NumberField label="Geolokacija — lat" value={partner.geoLocation?.lat} onChange={(v) => updatePartner({ geoLocation: v !== undefined ? { lat: v, lng: partner.geoLocation?.lng ?? 0 } : undefined })} />
              <NumberField label="Geolokacija — lng" value={partner.geoLocation?.lng} onChange={(v) => updatePartner({ geoLocation: v !== undefined ? { lat: partner.geoLocation?.lat ?? 0, lng: v } : undefined })} />
              <Field label="Način i rok komunikacije" value={partner.communicationNotes ?? ''} onChange={(v) => updatePartner({ communicationNotes: v })} className="sm:col-span-2" />
            </div>

            {partner.categories.includes('smestaj') && (
              <div className="rounded-lg border border-ink/10 p-3">
                <p className="mb-2 text-sm font-semibold text-ink">Lokacijske oznake (koristi konfigurator za preporuku)</p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(locationTagLabels) as AccommodationLocationTag[]).map((tag) => (
                    <button key={tag} type="button" onClick={() => toggleLocationTag(tag)} className={`rounded-full border px-2.5 py-1 text-xs font-medium ${(partner.locationTags ?? []).includes(tag) ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'}`}>
                      {locationTagLabels[tag]}
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <NumberField label="Udaljenost od centra (km)" value={partner.distanceFromCenterKm} onChange={(v) => updatePartner({ distanceFromCenterKm: v })} />
                  <NumberField label="Vreme vožnje do centra (min)" value={partner.driveTimeFromCenterMinutes} onChange={(v) => updatePartner({ driveTimeFromCenterMinutes: v })} />
                  <Toggle label="Moguć pešački pristup centru" checked={Boolean(partner.walkableToCenter)} onChange={(v) => updatePartner({ walkableToCenter: v })} />
                  <Toggle label="Dostupan parking" checked={Boolean(partner.parkingAvailable)} onChange={(v) => updatePartner({ parkingAvailable: v })} />
                  <Toggle label="Dostupan prevoz" checked={Boolean(partner.transportAvailable)} onChange={(v) => updatePartner({ transportAvailable: v })} />
                </div>
              </div>
            )}

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-ink">Interna napomena (nikad vidljivo gostu)</span>
              <textarea value={partner.internalNote ?? ''} onChange={(e) => updatePartner({ internalNote: e.target.value })} rows={3} className="w-full rounded-lg border border-terracotta/20 bg-terracotta/5 p-2.5 text-sm text-ink" />
            </label>
          </div>
        )}

        {tab === 'Identitet i mediji' && (
          <div className="space-y-5">
            <Field label="Kratak opis za karticu (jedna rečenica)" value={partner.oneLiner} onChange={(v) => updatePartner({ oneLiner: v })} />
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-ink">Priča o partneru</span>
              <textarea value={partner.story} onChange={(e) => updatePartner({ story: e.target.value })} rows={4} className="w-full rounded-lg border border-ink/15 bg-warm-white p-2.5 text-sm text-ink" />
            </label>
            <Toggle label="Ovo je demonstracioni (demo) partner" checked={partner.isDemo} onChange={(v) => updatePartner({ isDemo: v })} />

            <RowListEditor
              label="Konkretne činjenice (kapacitet, kuhinja, oprema...)"
              items={partner.facts}
              onChange={(next) => updatePartner({ facts: next })}
              makeEmpty={() => ({ label: '', value: '' })}
              renderRow={(fact, update) => (
                <div className="grid gap-2 sm:grid-cols-2">
                  <input value={fact.label} placeholder="Oznaka" onChange={(e) => update({ label: e.target.value })} className="min-h-[36px] rounded-lg border border-ink/15 bg-warm-white px-2 text-sm" />
                  <input value={fact.value} placeholder="Vrednost" onChange={(e) => update({ value: e.target.value })} className="min-h-[36px] rounded-lg border border-ink/15 bg-warm-white px-2 text-sm" />
                </div>
              )}
            />

            <AdminImagePicker label="Glavna fotografija" value={partner.media.mainPhoto} onChange={(next) => next && updatePartner({ media: { ...partner.media, mainPhoto: next } })} />
            <AdminImagePicker label="Logo (opciono)" value={partner.media.logo} onChange={(next) => updatePartner({ media: { ...partner.media, logo: next } })} allowClear />
            <AdminGalleryEditor values={partner.media.gallery} onChange={(next) => updatePartner({ media: { ...partner.media, gallery: next } })} />
          </div>
        )}

        {tab === 'Ponude' && (
          <div className="space-y-3">
            {offers.map((offer) => (
              <AdminOfferEditor
                key={offer.id}
                offer={offer}
                onChange={(patch) => updateOffer(offer.id, patch)}
                onDuplicate={() => duplicateOffer(offer)}
                onArchive={() => updateOffer(offer.id, { lifecycleStatus: 'archived' })}
                onDelete={() => removeOffer(offer.id)}
              />
            ))}
            {offers.length === 0 && <p className="text-sm text-ink-soft">Partner još nema nijednu ponudu.</p>}
            <button type="button" onClick={addOffer} className="mt-2 inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-forest px-4 text-sm font-semibold text-warm-white hover:bg-forest/90">
              Dodaj ponudu
            </button>
          </div>
        )}

        {tab === 'Objavljivanje' && (
          <div className="space-y-5">
            <div className="rounded-xl2 border border-ink/8 bg-warm-white p-5">
              <h2 className="font-serif text-lg text-ink">Provera pre objavljivanja</h2>
              {blockers.length === 0 ? (
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-forest"><CheckCircle2 size={15} aria-hidden="true" /> Svi obavezni podaci su uneti.</p>
              ) : (
                <ul className="mt-2 space-y-1.5">
                  {blockers.map((b) => (
                    <li key={b} className="inline-flex items-start gap-1.5 text-sm text-terracotta">
                      <AlertCircle size={14} className="mt-0.5 flex-none" aria-hidden="true" /> {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setLifecycle('draft')} className="min-h-[40px] rounded-full border border-ink/15 px-4 text-sm font-medium text-ink hover:bg-cream">Sačuvaj draft</button>
              <a href={`/partneri/${partner.slug}?preview=1`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-ink/15 px-4 text-sm font-medium text-ink hover:bg-cream">
                Pregledaj kao korisnik <ExternalLink size={14} aria-hidden="true" />
              </a>
              <button type="button" onClick={() => setLifecycle('ready_for_review')} className="min-h-[40px] rounded-full border border-ink/15 px-4 text-sm font-medium text-ink hover:bg-cream">Pošalji na proveru</button>
              <button type="button" onClick={() => setLifecycle('approved')} className="min-h-[40px] rounded-full border border-ink/15 px-4 text-sm font-medium text-ink hover:bg-cream">Odobri</button>
              <ConfirmButton
                label="Objavi"
                confirmLabel="Da, objavi"
                onConfirm={() => {
                  if (blockers.length === 0) setLifecycle('published');
                }}
                className="border-forest text-forest hover:bg-sage"
              />
              <ConfirmButton label="Pauziraj" confirmLabel="Da, pauziraj" onConfirm={() => setLifecycle('paused')} />
              <ConfirmButton label="Arhiviraj" confirmLabel="Da, arhiviraj" onConfirm={() => setLifecycle('archived')} tone="danger" />
            </div>
            {blockers.length > 0 && (
              <p className="text-xs text-terracotta">Objavljivanje je onemogućeno dok ne popunite obavezne podatke iznad.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
