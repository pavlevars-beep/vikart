import type { ConfiguratorAnswers, TravelerTypeKey } from '@/types';
import { travelerTypeLabels } from '@/utils/labels';
import OptionButton from '../OptionButton';

const options = Object.keys(travelerTypeLabels) as TravelerTypeKey[];

interface StepProps {
  answers: ConfiguratorAnswers;
  update: (patch: Partial<ConfiguratorAnswers>) => void;
}

export default function StepTravelers({ answers, update }: StepProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink sm:text-3xl">Ko putuje?</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((key) => (
          <OptionButton
            key={key}
            title={travelerTypeLabels[key]}
            selected={answers.travelerType === key}
            onClick={() => update({ travelerType: key, groupSize: key === 'par' ? 2 : answers.groupSize })}
          />
        ))}
      </div>

      <label className="mt-6 block max-w-xs text-sm">
        <span className="mb-1.5 block font-medium text-ink">Broj osoba</span>
        <input
          type="number"
          inputMode="numeric"
          min={answers.travelerType === 'par' ? 2 : 1}
          max={30}
          value={answers.groupSize}
          disabled={answers.travelerType === 'par'}
          onChange={(e) => update({ groupSize: Math.max(1, Number(e.target.value) || 1) })}
          className="min-h-[44px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-ink disabled:opacity-60"
        />
      </label>
    </div>
  );
}
