import { useState, type FormEvent } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { PartnerInquiry, PartnerType } from '@/types';
import { appendToList, storageKeys } from '@/utils/storage';

const partnerTypeLabels: Record<PartnerType, string> = {
  hotel: 'Hotel',
  apartman: 'Apartman',
  'kuca-brvnara': 'Kuća ili brvnara',
  vila: 'Vila',
  'wellness-spa': 'Wellness i spa',
  restoran: 'Restoran',
  avantura: 'Avanturistička aktivnost',
  vodic: 'Vodič',
  prevoz: 'Prevoz',
  fotograf: 'Fotograf',
  dekoracija: 'Dekoracija i pokloni',
  domacinstvo: 'Autentično domaćinstvo',
  ostalo: 'Ostalo',
};

const emptyForm: Omit<PartnerInquiry, 'createdAt'> = {
  type: 'hotel',
  businessName: '',
  contactName: '',
  phone: '',
  email: '',
  location: '',
  website: '',
  instagram: '',
  description: '',
  priceRange: '',
  capacity: '',
  seasonality: '',
  confirmationMethod: '',
  responseTime: '',
  photosLink: '',
  note: '',
};

export default function PartnerForm() {
  useDocumentTitle('Prijava partnera');
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [sending, setSending] = useState(false);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.businessName.trim()) next.businessName = 'Unesite naziv objekta ili usluge.';
    if (!form.contactName.trim()) next.contactName = 'Unesite ime kontakt osobe.';
    if (!form.phone.trim()) next.phone = 'Unesite broj telefona.';
    if (!form.email.trim()) next.email = 'Unesite email adresu.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Email adresa nije validna.';
    if (!form.location.trim()) next.location = 'Unesite lokaciju.';
    if (!form.description.trim()) next.description = 'Opišite ukratko vašu ponudu.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    const inquiry: PartnerInquiry = { ...form, createdAt: new Date().toISOString() };
    appendToList<PartnerInquiry>(storageKeys.partnerInquiries, inquiry);
    setSubmitError(false);
    setSending(true);

    try {
      const res = await fetch('/api/partner-inquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setSubmitError(true);
      }
    } catch {
      // Nema dostupnog API-ja (lokalni razvoj bez `vercel dev` ili samostalan preview) — ponašaj se kao demo prijava.
      setSubmitted(true);
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
      <p className="mt-2 text-ink-soft">Popunite formu i naš tim će vas kontaktirati u vezi sa saradnjom.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 grid gap-4 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium text-ink">Tip partnera</span>
          <select
            value={form.type}
            onChange={(e) => set('type', e.target.value as PartnerType)}
            className="min-h-[44px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-ink"
          >
            {(Object.keys(partnerTypeLabels) as PartnerType[]).map((key) => (
              <option key={key} value={key}>
                {partnerTypeLabels[key]}
              </option>
            ))}
          </select>
        </label>

        <Field label="Naziv objekta ili usluge" value={form.businessName} onChange={(v) => set('businessName', v)} error={errors.businessName} className="sm:col-span-2" />
        <Field label="Ime kontakt osobe" value={form.contactName} onChange={(v) => set('contactName', v)} error={errors.contactName} />
        <Field label="Telefon" value={form.phone} onChange={(v) => set('phone', v)} error={errors.phone} type="tel" />
        <Field label="Email" value={form.email} onChange={(v) => set('email', v)} error={errors.email} type="email" />
        <Field label="Lokacija" value={form.location} onChange={(v) => set('location', v)} error={errors.location} />
        <Field label="Web-sajt (opciono)" value={form.website} onChange={(v) => set('website', v)} />
        <Field label="Instagram (opciono)" value={form.instagram} onChange={(v) => set('instagram', v)} />
        <Field label="Okvirne cene" value={form.priceRange} onChange={(v) => set('priceRange', v)} placeholder="npr. od 8.000 RSD po noćenju" />
        <Field label="Kapacitet" value={form.capacity} onChange={(v) => set('capacity', v)} placeholder="npr. do 6 osoba" />
        <Field label="Sezonalnost" value={form.seasonality} onChange={(v) => set('seasonality', v)} placeholder="npr. celu godinu / sezonski" />
        <Field label="Način potvrđivanja termina" value={form.confirmationMethod} onChange={(v) => set('confirmationMethod', v)} />
        <Field label="Okvirno vreme odgovora" value={form.responseTime} onChange={(v) => set('responseTime', v)} placeholder="npr. do 24h" />
        <Field label="Link ka fotografijama (opciono)" value={form.photosLink} onChange={(v) => set('photosLink', v)} className="sm:col-span-2" />

        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium text-ink">Opis ponude</span>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-ink/15 bg-warm-white p-3 text-ink"
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description && <span className="mt-1 block text-xs text-terracotta">{errors.description}</span>}
        </label>

        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium text-ink">Dodatna napomena (opciono)</span>
          <textarea
            value={form.note}
            onChange={(e) => set('note', e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-ink/15 bg-warm-white p-3 text-ink"
          />
        </label>

        {submitError && (
          <p role="alert" className="flex items-start gap-2 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta sm:col-span-2">
            <AlertCircle size={16} className="mt-0.5 flex-none" aria-hidden="true" />
            Nismo uspeli da pošaljemo prijavu. Proverite konekciju i pokušajte ponovo.
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="mt-2 flex min-h-[44px] items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-warm-white hover:bg-forest/90 disabled:opacity-60 sm:col-span-2 sm:w-fit"
        >
          {sending ? 'Slanje…' : 'Pošalji prijavu'}
        </button>
      </form>
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
