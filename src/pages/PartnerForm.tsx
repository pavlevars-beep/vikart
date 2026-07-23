import { useEffect, useState, type FormEvent } from 'react';
import { CheckCircle2, AlertCircle, MapPin, Check } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { PartnerApplication, PartnerCategory, DietaryOption } from '@/types';
import { readStorage, writeStorage, removeStorage, appendToList, storageKeys } from '@/utils/storage';
import { partnerCategoryLabels, dietaryOptionLabels } from '@/utils/labels';

const emptyApplication: PartnerApplication = {
  basics: { businessName: '', categories: [], contactName: '', phone: '', email: '', location: '' },
  story: { oneLiner: '', story: '', photosLink: '', logoLink: '' },
  offer: { offerName: '', offerDescription: '', priceLabel: '', capacity: '', durationLabel: '' },
  food: { hasFoodOrDrink: false, mealType: '', courseCount: '', dietaryOptions: [], allergyProcess: '' },
  policies: { cancellationTerms: '', substitutionAllowed: true, substitutionNotes: '', backupContact: '' },
  operations: { meetingPoint: '', responseTime: '', dayOfContact: '', badWeatherProcedure: '' },
  createdAt: '',
};

const steps = ['Osnovni podaci', 'Priča i fotografije', 'Konkretna ponuda', 'Hrana i piće', 'Otkazivanje i zamene', 'Operativni tok', 'Pregled'];

const allCategories = Object.keys(partnerCategoryLabels) as PartnerCategory[];
const allDietary = Object.keys(dietaryOptionLabels) as DietaryOption[];

export default function PartnerForm() {
  useDocumentTitle('Prijava partnera');
  const [step, setStep] = useState(0);
  const [app, setApp] = useState<PartnerApplication>(emptyApplication);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const draft = readStorage<PartnerApplication>(storageKeys.partnerApplicationDraft);
    if (draft) setApp(draft);
  }, []);

  useEffect(() => {
    writeStorage(storageKeys.partnerApplicationDraft, app);
  }, [app]);

  function update<S extends Exclude<keyof PartnerApplication, 'createdAt'>>(section: S, patch: Partial<PartnerApplication[S]>) {
    setApp((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }));
  }

  function toggleCategory(category: PartnerCategory) {
    const current = app.basics.categories;
    const next = current.includes(category) ? current.filter((c) => c !== category) : [...current, category];
    update('basics', { categories: next });
  }

  function toggleDietary(option: DietaryOption) {
    const current = app.food.dietaryOptions;
    const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
    update('food', { dietaryOptions: next });
  }

  function validateStep(index: number): boolean {
    const next: Record<string, string> = {};
    if (index === 0) {
      if (!app.basics.businessName.trim()) next.businessName = 'Unesite naziv objekta ili usluge.';
      if (app.basics.categories.length === 0) next.categories = 'Izaberite bar jednu kategoriju.';
      if (!app.basics.contactName.trim()) next.contactName = 'Unesite ime kontakt osobe.';
      if (!app.basics.phone.trim()) next.phone = 'Unesite broj telefona.';
      if (!app.basics.email.trim()) next.email = 'Unesite email adresu.';
      else if (!/^\S+@\S+\.\S+$/.test(app.basics.email)) next.email = 'Email adresa nije validna.';
      if (!app.basics.location.trim()) next.location = 'Unesite lokaciju.';
    }
    if (index === 1) {
      if (!app.story.oneLiner.trim()) next.oneLiner = 'Unesite kratku jednu rečenicu o ponudi.';
      if (!app.story.story.trim()) next.story = 'Ukratko opišite svoju priču.';
    }
    if (index === 2) {
      if (!app.offer.offerName.trim()) next.offerName = 'Unesite naziv konkretne ponude.';
      if (!app.offer.priceLabel.trim()) next.priceLabel = 'Unesite orijentacionu cenu.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const application: PartnerApplication = { ...app, createdAt: new Date().toISOString() };
    appendToList<PartnerApplication>(storageKeys.partnerApplications, application);
    setSubmitError(false);
    setSending(true);

    try {
      const res = await fetch('/api/partner-inquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(application),
      });
      if (res.ok) {
        setSubmitted(true);
        removeStorage(storageKeys.partnerApplicationDraft);
      } else {
        setSubmitError(true);
      }
    } catch {
      // Nema dostupnog API-ja (lokalni razvoj bez `vercel dev` ili samostalan preview) — ponašaj se kao demo prijava.
      setSubmitted(true);
      removeStorage(storageKeys.partnerApplicationDraft);
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <CheckCircle2 size={44} className="mx-auto text-forest" aria-hidden="true" />
        <h1 className="mt-4 font-serif text-3xl text-ink">Prijava je poslata.</h1>
        <p className="mt-3 text-ink-soft">
          Hvala na interesovanju za VikArt partnerstvo. Naš tim će pregledati vašu ponudu i javiti se sa sledećim
          koracima.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">Prijavi ponudu</h1>
      <p className="mt-2 text-ink-soft">Šest kratkih koraka — na kraju vidite kako će vaša ponuda izgledati gostima, pre nego što je pošaljete.</p>

      <ol className="mt-6 flex flex-wrap gap-2 text-xs" aria-label="Koraci prijave">
        {steps.map((label, index) => (
          <li
            key={label}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 ${
              index === step ? 'border-forest bg-sage text-forest font-semibold' : index < step ? 'border-forest/40 text-forest' : 'border-ink/15 text-ink-soft'
            }`}
          >
            {index < step && <Check size={12} aria-hidden="true" />}
            {index + 1}. {label}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit} noValidate className="mt-8">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Naziv objekta ili usluge" value={app.basics.businessName} onChange={(v) => update('basics', { businessName: v })} error={errors.businessName} className="sm:col-span-2" />

            <fieldset className="text-sm sm:col-span-2">
              <legend className="mb-1.5 font-medium text-ink">Kategorije ponude</legend>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={app.basics.categories.includes(c)}
                    onClick={() => toggleCategory(c)}
                    className={`min-h-[36px] rounded-full border px-3 text-xs font-medium ${
                      app.basics.categories.includes(c) ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'
                    }`}
                  >
                    {partnerCategoryLabels[c]}
                  </button>
                ))}
              </div>
              {errors.categories && <span className="mt-1 block text-xs text-terracotta">{errors.categories}</span>}
            </fieldset>

            <Field label="Ime kontakt osobe" value={app.basics.contactName} onChange={(v) => update('basics', { contactName: v })} error={errors.contactName} />
            <Field label="Telefon" value={app.basics.phone} onChange={(v) => update('basics', { phone: v })} error={errors.phone} type="tel" />
            <Field label="Email" value={app.basics.email} onChange={(v) => update('basics', { email: v })} error={errors.email} type="email" />
            <Field label="Lokacija" value={app.basics.location} onChange={(v) => update('basics', { location: v })} error={errors.location} placeholder="npr. Zlatibor centar" />
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4">
            <Field label="Jedna rečenica o ponudi" value={app.story.oneLiner} onChange={(v) => update('story', { oneLiner: v })} error={errors.oneLiner} placeholder="npr. Vođene e-bike ture prilagođene kondiciji grupe." />
            <label className="text-sm">
              <span className="mb-1.5 block font-medium text-ink">Vaša priča</span>
              <textarea
                value={app.story.story}
                onChange={(e) => update('story', { story: e.target.value })}
                rows={5}
                className="w-full rounded-lg border border-ink/15 bg-warm-white p-3 text-ink"
                aria-invalid={Boolean(errors.story)}
              />
              {errors.story && <span className="mt-1 block text-xs text-terracotta">{errors.story}</span>}
            </label>
            <Field label="Link ka fotografijama (opciono)" value={app.story.photosLink} onChange={(v) => update('story', { photosLink: v })} />
            <Field label="Link ka logu (opciono)" value={app.story.logoLink} onChange={(v) => update('story', { logoLink: v })} />
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Naziv konkretne ponude" value={app.offer.offerName} onChange={(v) => update('offer', { offerName: v })} error={errors.offerName} className="sm:col-span-2" placeholder="npr. Vođena tura, 2h" />
            <label className="text-sm sm:col-span-2">
              <span className="mb-1.5 block font-medium text-ink">Opis ponude</span>
              <textarea
                value={app.offer.offerDescription}
                onChange={(e) => update('offer', { offerDescription: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-ink/15 bg-warm-white p-3 text-ink"
              />
            </label>
            <Field label="Orijentaciona cena" value={app.offer.priceLabel} onChange={(v) => update('offer', { priceLabel: v })} error={errors.priceLabel} placeholder="npr. 6.000 RSD po osobi" />
            <Field label="Kapacitet" value={app.offer.capacity} onChange={(v) => update('offer', { capacity: v })} placeholder="npr. do 8 osoba po terminu" />
            <Field label="Trajanje" value={app.offer.durationLabel} onChange={(v) => update('offer', { durationLabel: v })} placeholder="npr. 90 min" />
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={app.food.hasFoodOrDrink}
                onChange={(e) => update('food', { hasFoodOrDrink: e.target.checked })}
                className="h-5 w-5 rounded border-ink/30"
              />
              Moja ponuda uključuje hranu ili piće
            </label>
            {app.food.hasFoodOrDrink ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tip obroka" value={app.food.mealType} onChange={(v) => update('food', { mealType: v })} placeholder="npr. Večera, degustacija, ručak" />
                <Field label="Broj sledovanja" value={app.food.courseCount} onChange={(v) => update('food', { courseCount: v })} placeholder="npr. 3" />
                <fieldset className="text-sm sm:col-span-2">
                  <legend className="mb-1.5 font-medium text-ink">Dijetarne opcije koje nudite</legend>
                  <div className="flex flex-wrap gap-2">
                    {allDietary.map((d) => (
                      <button
                        key={d}
                        type="button"
                        aria-pressed={app.food.dietaryOptions.includes(d)}
                        onClick={() => toggleDietary(d)}
                        className={`min-h-[36px] rounded-full border px-3 text-xs font-medium ${
                          app.food.dietaryOptions.includes(d) ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'
                        }`}
                      >
                        {dietaryOptionLabels[d]}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="text-sm sm:col-span-2">
                  <span className="mb-1.5 block font-medium text-ink">Kako prikupljate podatke o alergijama</span>
                  <textarea
                    value={app.food.allergyProcess}
                    onChange={(e) => update('food', { allergyProcess: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-ink/15 bg-warm-white p-3 text-ink"
                    placeholder="npr. Gost prijavljuje alergije najkasnije 24h pre termina."
                  />
                </label>
              </div>
            ) : (
              <p className="text-sm text-ink-soft">Ovaj korak preskačete jer vaša ponuda ne uključuje hranu ili piće.</p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-4">
            <label className="text-sm">
              <span className="mb-1.5 block font-medium text-ink">Uslovi otkazivanja</span>
              <textarea
                value={app.policies.cancellationTerms}
                onChange={(e) => update('policies', { cancellationTerms: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-ink/15 bg-warm-white p-3 text-ink"
                placeholder="npr. Besplatno otkazivanje do 48h pre termina, kasnije 50% cene."
              />
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={app.policies.substitutionAllowed}
                onChange={(e) => update('policies', { substitutionAllowed: e.target.checked })}
                className="h-5 w-5 rounded border-ink/30"
              />
              Prihvatam da me VikArt predloži kao zamenu drugom partneru iz iste kategorije ako ja nisam dostupan/na
            </label>
            <label className="text-sm">
              <span className="mb-1.5 block font-medium text-ink">Napomena o zamenama (opciono)</span>
              <textarea
                value={app.policies.substitutionNotes}
                onChange={(e) => update('policies', { substitutionNotes: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-ink/15 bg-warm-white p-3 text-ink"
              />
            </label>
            <Field label="Kontakt za slučaj da vi niste dostupni (opciono)" value={app.policies.backupContact} onChange={(v) => update('policies', { backupContact: v })} />
          </div>
        )}

        {step === 5 && (
          <div className="grid gap-4">
            <Field label="Mesto okupljanja / prijave gostiju" value={app.operations.meetingPoint} onChange={(v) => update('operations', { meetingPoint: v })} />
            <Field label="Okvirno vreme potvrde termina" value={app.operations.responseTime} onChange={(v) => update('operations', { responseTime: v })} placeholder="npr. do 24h" />
            <Field label="Kontakt na dan realizacije" value={app.operations.dayOfContact} onChange={(v) => update('operations', { dayOfContact: v })} />
            <label className="text-sm">
              <span className="mb-1.5 block font-medium text-ink">Šta se dešava kod lošeg vremena</span>
              <textarea
                value={app.operations.badWeatherProcedure}
                onChange={(e) => update('operations', { badWeatherProcedure: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-ink/15 bg-warm-white p-3 text-ink"
              />
            </label>
          </div>
        )}

        {step === 6 && <ApplicationPreview app={app} />}

        {submitError && (
          <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
            <AlertCircle size={16} className="mt-0.5 flex-none" aria-hidden="true" />
            Nismo uspeli da pošaljemo prijavu. Proverite konekciju i pokušajte ponovo.
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="flex min-h-[44px] items-center justify-center rounded-full border border-ink/15 px-5 text-sm font-semibold text-ink disabled:opacity-40"
          >
            Nazad
          </button>
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex min-h-[44px] items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-warm-white hover:bg-forest/90"
            >
              Dalje
            </button>
          ) : (
            <button
              type="submit"
              disabled={sending}
              className="flex min-h-[44px] items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-warm-white hover:bg-forest/90 disabled:opacity-60"
            >
              {sending ? 'Slanje…' : 'Pošalji prijavu'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function ApplicationPreview({ app }: { app: PartnerApplication }) {
  return (
    <div>
      <h2 className="font-serif text-xl text-ink">Ovako će vas videti gosti</h2>
      <p className="mt-1 text-sm text-ink-soft">Pregled pre slanja — proverite da li sve deluje tačno.</p>

      <article className="mt-4 overflow-hidden rounded-xl2 border border-ink/8 bg-warm-white shadow-card">
        <div className="flex aspect-[16/9] items-center justify-center bg-sage text-sm text-forest/60">
          Fotografija se dodaje nakon odobrenja prijave
        </div>
        <div className="p-5">
          <h3 className="font-serif text-2xl text-ink">{app.basics.businessName || 'Naziv vaše ponude'}</h3>
          <p className="mt-1 text-sm text-ink-soft">
            {app.basics.categories.map((c) => partnerCategoryLabels[c]).join(' · ') || 'Kategorija'}
          </p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
            <MapPin size={13} aria-hidden="true" /> {app.basics.location || 'Lokacija'}
          </p>
          <p className="mt-3 text-ink-soft">{app.story.oneLiner || 'Vaša kratka rečenica o ponudi.'}</p>
          <p className="mt-2 text-sm text-ink-soft">{app.story.story || 'Vaša priča.'}</p>

          <div className="mt-4 rounded-lg bg-cream p-3 text-sm">
            <p className="font-semibold text-ink">{app.offer.offerName || 'Konkretna ponuda'}</p>
            <p className="mt-1 text-ink-soft">{app.offer.offerDescription}</p>
            <p className="mt-1 text-ink-soft">
              {app.offer.priceLabel || 'Cena'} · {app.offer.durationLabel || 'Trajanje'} · {app.offer.capacity || 'Kapacitet'}
            </p>
          </div>

          {app.food.hasFoodOrDrink && (
            <div className="mt-3 rounded-lg bg-cream p-3 text-sm">
              <p className="font-semibold text-ink">Hrana i piće</p>
              <p className="mt-1 text-ink-soft">
                {app.food.mealType || 'Tip obroka'} · {app.food.courseCount || '—'} sledovanja
              </p>
              {app.food.dietaryOptions.length > 0 && (
                <p className="mt-1 text-ink-soft">{app.food.dietaryOptions.map((d) => dietaryOptionLabels[d]).join(', ')}</p>
              )}
            </div>
          )}

          <div className="mt-3 rounded-lg bg-cream p-3 text-sm">
            <p className="font-semibold text-ink">Otkazivanje i zamene</p>
            <p className="mt-1 text-ink-soft">{app.policies.cancellationTerms || 'Uslovi otkazivanja'}</p>
            <p className="mt-1 text-ink-soft">
              {app.policies.substitutionAllowed
                ? 'Partner prihvata da bude predložen kao zamena u okviru VikArt sistema.'
                : 'Partner ne prihvata da bude ponuđen kao zamena drugim gostima.'}
            </p>
          </div>

          <div className="mt-3 rounded-lg bg-cream p-3 text-sm">
            <p className="font-semibold text-ink">Operativni tok</p>
            <p className="mt-1 text-ink-soft">Mesto: {app.operations.meetingPoint || '—'}</p>
            <p className="mt-1 text-ink-soft">Potvrda termina: {app.operations.responseTime || '—'}</p>
            <p className="mt-1 text-ink-soft">Loše vreme: {app.operations.badWeatherProcedure || '—'}</p>
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-terracotta">
            Status do odobrenja: Demonstracioni prikaz
          </p>
        </div>
      </article>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`text-sm ${className}`}>
      <span className="mb-1.5 block font-medium text-ink">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[44px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-ink"
        aria-invalid={Boolean(error)}
      />
      {error && <span className="mt-1 block text-xs text-terracotta">{error}</span>}
    </label>
  );
}
