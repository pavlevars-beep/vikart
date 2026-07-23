import { useState, type FormEvent } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { PartnerCategory } from '@/types';
import { partnerCategoryLabels } from '@/utils/labels';
import { createPartnerInquiry } from '@/services/partnerInquiriesStore';

const categoryOptions = Object.keys(partnerCategoryLabels) as PartnerCategory[];

/**
 * Kratka javna forma interesovanja — cilj je da se popuni za manje od minuta.
 * Detaljno ugovaranje (cene, uslovi, fotografije, operativni tok) obavlja se
 * kasnije, interno, kroz /admin/partneri onboarding nakon što VikArt tim
 * kontaktira partnera.
 */
export default function PartnerForm() {
  useDocumentTitle('Prijavi interesovanje');
  const [category, setCategory] = useState<PartnerCategory>('smestaj');
  const [businessName, setBusinessName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [sending, setSending] = useState(false);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!businessName.trim()) next.businessName = 'Unesite naziv objekta, preduzeća ili iskustva.';
    if (!contactName.trim()) next.contactName = 'Unesite ime i prezime kontakt osobe.';
    if (!phone.trim()) next.phone = 'Unesite broj telefona.';
    if (email && !/^\S+@\S+\.\S+$/.test(email)) next.email = 'Email adresa nije validna.';
    if (!consent) next.consent = 'Potrebna je saglasnost za kontakt i obradu podataka.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    // Uvek prvo sačuvaj lokalno — upit mora biti vidljiv u admin panelu bez obzira na Telegram/API dostupnost.
    createPartnerInquiry({
      categories: [category],
      businessName,
      contactName,
      phone,
      email: email || undefined,
      link: link || undefined,
      note: note || undefined,
      consent,
    });

    setSubmitError(false);
    setSending(true);
    try {
      const res = await fetch('/api/partner-inquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ categories: [category], businessName, contactName, phone, email, link, note }),
      });
      if (!res.ok) setSubmitError(true);
    } catch {
      // Nema dostupnog API-ja (lokalni razvoj bez `vercel dev` ili samostalan preview) — upit je već sačuvan lokalno.
    } finally {
      setSending(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <CheckCircle2 size={44} className="mx-auto text-forest" aria-hidden="true" />
        <h1 className="mt-4 font-serif text-3xl text-ink">Hvala na interesovanju.</h1>
        <p className="mt-3 text-ink-soft">
          Pregledaćemo osnovne podatke i kontaktirati vas radi kratkog razgovora o mogućoj saradnji.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl text-ink sm:text-4xl">Prijavi interesovanje</h1>
      <p className="mt-2 text-ink-soft">
        Ostavite osnovne podatke — traje manje od minuta. Detalje ponude, cene i uslove dogovaramo naknadno, u kratkom
        razgovoru.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 grid gap-4">
        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-ink">Kategorija</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as PartnerCategory)}
            className="min-h-[44px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-ink"
          >
            {categoryOptions.map((key) => (
              <option key={key} value={key}>
                {partnerCategoryLabels[key]}
              </option>
            ))}
          </select>
        </label>

        <Field label="Naziv objekta, preduzeća ili iskustva" value={businessName} onChange={setBusinessName} error={errors.businessName} />
        <Field label="Ime i prezime kontakt osobe" value={contactName} onChange={setContactName} error={errors.contactName} />
        <Field label="Telefon" value={phone} onChange={setPhone} error={errors.phone} type="tel" />
        <Field label="Email (opciono)" value={email} onChange={setEmail} error={errors.email} type="email" />
        <Field
          label="Link — sajt, Instagram, Facebook, Booking ili Google Maps (opciono)"
          value={link}
          onChange={setLink}
        />

        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-ink">Kratka napomena (opciono)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-ink/15 bg-warm-white p-3 text-ink"
          />
        </label>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 flex-none rounded border-ink/30"
            aria-invalid={Boolean(errors.consent)}
          />
          <span className="text-ink-soft">Saglasan/na sam da me VikArt kontaktira i obradi ove podatke radi razmatranja saradnje.</span>
        </label>
        {errors.consent && <span className="-mt-2 block text-xs text-terracotta">{errors.consent}</span>}

        {submitError && (
          <p role="alert" className="flex items-start gap-2 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
            <AlertCircle size={16} className="mt-0.5 flex-none" aria-hidden="true" />
            Prijava je sačuvana, ali nismo uspeli da pošaljemo obaveštenje. Naš tim će je ipak pregledati.
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="mt-2 flex min-h-[44px] items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-warm-white hover:bg-forest/90 disabled:opacity-60 sm:w-fit"
        >
          {sending ? 'Slanje…' : 'Pošalji interesovanje'}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <label className="text-sm">
      <span className="mb-1.5 block font-medium text-ink">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[44px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-ink"
        aria-invalid={Boolean(error)}
      />
      {error && <span className="mt-1 block text-xs text-terracotta">{error}</span>}
    </label>
  );
}
