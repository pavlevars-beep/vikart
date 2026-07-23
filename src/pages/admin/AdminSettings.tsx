import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import type { VikArtSettings, Currency } from '@/types';
import { getSettings, saveSettings } from '@/services/settingsStore';

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="text-sm">
      <span className="mb-1 block font-medium text-ink">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="min-h-[40px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-sm text-ink" />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full rounded-lg border border-ink/15 bg-warm-white p-3 text-sm text-ink" />
    </label>
  );
}

export default function AdminSettings() {
  useDocumentTitle('Admin — Podešavanja');
  const [settings, setSettings] = useState<VikArtSettings>(() => getSettings());
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function update(patch: Partial<VikArtSettings>) {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
    setSavedAt(new Date().toISOString());
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-ink">Podešavanja</h1>
          <p className="mt-1.5 text-ink-soft">Politika plaćanja, otkazivanja i osnovni kontakt — koriste ih sve stranice sajta.</p>
        </div>
        {savedAt && <span className="inline-flex items-center gap-1 text-xs text-ink-soft"><CheckCircle2 size={13} aria-hidden="true" /> Sačuvano</span>}
      </div>

      <div className="mt-6 space-y-5 rounded-xl2 border border-ink/8 bg-warm-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Procenat avansa (%)" type="number" value={String(settings.depositPercent)} onChange={(v) => update({ depositPercent: Number(v) || 0 })} />
          <label className="text-sm">
            <span className="mb-1 block font-medium text-ink">Valuta</span>
            <select value={settings.currency} onChange={(e) => update({ currency: e.target.value as Currency })} className="min-h-[40px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-sm">
              <option value="RSD">RSD</option>
              <option value="EUR">EUR</option>
            </select>
          </label>
        </div>

        <TextArea label="Osnovni tekst politike plaćanja" value={settings.paymentPolicyText} onChange={(v) => update({ paymentPolicyText: v })} />
        <Field label="Rok za uplatu ostatka (tekst)" value={settings.remainingDueLabel} onChange={(v) => update({ remainingDueLabel: v })} />
        <TextArea label="Otkazivanje — više od roka" value={settings.cancellationFreeUntilLabel} onChange={(v) => update({ cancellationFreeUntilLabel: v })} />
        <TextArea label="Otkazivanje — kasno / no-show" value={settings.cancellationLatePolicyText} onChange={(v) => update({ cancellationLatePolicyText: v })} />
        <TextArea label="Izuzeci i povraćaj sredstava" value={settings.cancellationNoShowText} onChange={(v) => update({ cancellationNoShowText: v })} />
        <TextArea label="Napomena o strožim uslovima partnera" value={settings.exceptionPolicyText} onChange={(v) => update({ exceptionPolicyText: v })} />
        <TextArea label="Politika kada VikArt ili partner otkaže uslugu" value={settings.partnerUnavailablePolicyText} onChange={(v) => update({ partnerUnavailablePolicyText: v })} />

        <div className="grid gap-4 sm:grid-cols-2 border-t border-ink/8 pt-4">
          <Field label="Kontakt telefon" value={settings.contactPhone} onChange={(v) => update({ contactPhone: v })} />
          <Field label="Kontakt email" value={settings.contactEmail} onChange={(v) => update({ contactEmail: v })} />
        </div>
      </div>
    </div>
  );
}
