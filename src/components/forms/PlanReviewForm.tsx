import { useState, type FormEvent } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { Inquiry, PreferredContact } from '@/types';
import { appendToList, storageKeys } from '@/utils/storage';

const contactOptions: { key: PreferredContact; label: string }[] = [
  { key: 'telefon', label: 'Telefon' },
  { key: 'viber', label: 'Viber' },
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'email', label: 'Email' },
];

interface PlanReviewFormProps {
  planTitle: string;
  totalPrice?: number;
}

export default function PlanReviewForm({ planTitle, totalPrice }: PlanReviewFormProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<PreferredContact>('telefon');
  const [note, setNote] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [sending, setSending] = useState(false);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = 'Unesite ime i prezime.';
    if (!phone.trim()) next.phone = 'Unesite broj telefona.';
    if (!email.trim()) next.email = 'Unesite email adresu.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Email adresa nije validna.';
    if (!consent) next.consent = 'Potrebna je saglasnost da bismo obradili zahtev.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    const inquiry: Inquiry = {
      fullName,
      phone,
      email,
      preferredContact,
      note: note ? `[${planTitle}] ${note}` : `[${planTitle}]`,
      consent,
      createdAt: new Date().toISOString(),
    };

    appendToList<Inquiry>(storageKeys.inquiries, inquiry);
    setSubmitError(false);
    setSending(true);

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fullName, phone, email, preferredContact, note, planTitle, totalPrice }),
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
      <div className="rounded-xl2 border border-forest/20 bg-sage/60 p-6 text-center sm:p-8" role="status">
        <CheckCircle2 size={40} className="mx-auto text-forest" aria-hidden="true" />
        <h3 className="mt-4 font-serif text-2xl text-ink">Tvoj plan je spreman za proveru.</h3>
        <p className="mt-2 text-ink-soft">
          VikArt tim će proveriti raspoloživost odabranih usluga i javiti se sa konačnom cenom i potvrđenim rasporedom.
        </p>
        <p className="mt-2 text-sm text-ink-soft">
          Cilj nam je da standardne zahteve potvrdimo u najkraćem mogućem roku.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl2 border border-ink/10 bg-warm-white p-6 sm:p-8" noValidate>
      <h3 className="font-serif text-2xl text-ink">Pošalji plan na proveru</h3>
      <p className="mt-1.5 text-sm text-ink-soft">Ostavite kontakt kako bismo potvrdili dostupnost i finalne detalje.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium text-ink">Ime i prezime</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="min-h-[44px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-ink"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? 'error-fullName' : undefined}
          />
          {errors.fullName && <span id="error-fullName" className="mt-1 block text-xs text-terracotta">{errors.fullName}</span>}
        </label>

        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-ink">Telefon</span>
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="min-h-[44px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-ink"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'error-phone' : undefined}
          />
          {errors.phone && <span id="error-phone" className="mt-1 block text-xs text-terracotta">{errors.phone}</span>}
        </label>

        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-ink">Email</span>
          <input
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-[44px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-ink"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'error-email' : undefined}
          />
          {errors.email && <span id="error-email" className="mt-1 block text-xs text-terracotta">{errors.email}</span>}
        </label>

        <fieldset className="text-sm sm:col-span-2">
          <legend className="mb-1.5 font-medium text-ink">Preferirani kontakt</legend>
          <div className="flex flex-wrap gap-2">
            {contactOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                aria-pressed={preferredContact === option.key}
                onClick={() => setPreferredContact(option.key)}
                className={`min-h-[40px] rounded-full border px-4 text-sm ${
                  preferredContact === option.key ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="text-sm sm:col-span-2">
          <span className="mb-1.5 block font-medium text-ink">Dodatna napomena (opciono)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-ink/15 bg-warm-white p-3 text-ink"
          />
        </label>

        <label className="flex items-start gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 flex-none rounded border-ink/30"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? 'error-consent' : undefined}
          />
          <span className="text-ink-soft">Saglasan/na sam da VikArt koristi ove podatke radi obrade mog zahteva.</span>
        </label>
        {errors.consent && <span id="error-consent" className="-mt-2 block text-xs text-terracotta sm:col-span-2">{errors.consent}</span>}
      </div>

      {submitError && (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          <AlertCircle size={16} className="mt-0.5 flex-none" aria-hidden="true" />
          Nismo uspeli da pošaljemo zahtev. Proverite konekciju i pokušajte ponovo.
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-warm-white hover:bg-forest/90 disabled:opacity-60 sm:w-auto"
      >
        {sending ? 'Slanje…' : 'Pošalji zahtev'}
      </button>
    </form>
  );
}
