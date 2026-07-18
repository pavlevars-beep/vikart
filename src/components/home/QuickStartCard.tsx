import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import type { TravelerTypeKey, FeelingKey } from '@/types';
import { travelerTypeLabels, feelingLabels } from '@/utils/labels';

const travelerOptions = Object.keys(travelerTypeLabels) as TravelerTypeKey[];
const feelingOptions = Object.keys(feelingLabels) as FeelingKey[];

export default function QuickStartCard() {
  const navigate = useNavigate();
  const [travelerType, setTravelerType] = useState<TravelerTypeKey>('par');
  const [groupSize, setGroupSize] = useState(2);
  const [feeling, setFeeling] = useState<FeelingKey>('opusteno');
  const [term, setTerm] = useState<'fleksibilni' | 'konkretan-termin'>('fleksibilni');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams({
      travelerType,
      groupSize: String(groupSize),
      feeling,
      dateMode: term,
    });
    navigate(`/konfigurator?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl rounded-xl2 border border-ink/8 bg-warm-white/95 p-5 shadow-card-hover backdrop-blur sm:p-6"
      aria-label="Brzi početak konfiguratora"
    >
      <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
        <Sparkles size={16} aria-hidden="true" /> Napravite predlog za par minuta
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-ink">Ko putuje</span>
          <select
            value={travelerType}
            onChange={(e) => setTravelerType(e.target.value as TravelerTypeKey)}
            className="min-h-[44px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-ink"
          >
            {travelerOptions.map((key) => (
              <option key={key} value={key}>
                {travelerTypeLabels[key]}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-ink">Broj osoba</span>
          <input
            type="number"
            min={1}
            max={20}
            value={groupSize}
            onChange={(e) => setGroupSize(Math.max(1, Number(e.target.value) || 1))}
            className="min-h-[44px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-ink"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-ink">Okvirni termin</span>
          <select
            value={term}
            onChange={(e) => setTerm(e.target.value as typeof term)}
            className="min-h-[44px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-ink"
          >
            <option value="fleksibilni">Fleksibilni smo</option>
            <option value="konkretan-termin">Imamo konkretan datum</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-ink">Željeni stil</span>
          <select
            value={feeling}
            onChange={(e) => setFeeling(e.target.value as FeelingKey)}
            className="min-h-[44px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-ink"
          >
            {feelingOptions.map((key) => (
              <option key={key} value={key}>
                {feelingLabels[key]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="submit"
        className="mt-4 flex min-h-[44px] w-full items-center justify-center rounded-full bg-terracotta px-5 text-sm font-semibold text-warm-white transition-colors hover:bg-terracotta/90"
      >
        Kreiraj predloge
      </button>
    </form>
  );
}
