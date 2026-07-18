import type { ConfiguratorAnswers, DateModeKey } from '@/types';
import { dateModeLabels } from '@/utils/labels';
import OptionButton from '../OptionButton';

const options = Object.keys(dateModeLabels) as DateModeKey[];
const nightsOptions: Array<1 | 2 | 3> = [1, 2, 3];

interface StepProps {
  answers: ConfiguratorAnswers;
  update: (patch: Partial<ConfiguratorAnswers>) => void;
}

export default function StepDates({ answers, update }: StepProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink sm:text-3xl">Kada dolazite?</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {options.map((key) => (
          <OptionButton
            key={key}
            title={dateModeLabels[key]}
            selected={answers.dateMode === key}
            onClick={() => update({ dateMode: key })}
          />
        ))}
      </div>

      {answers.dateMode === 'konkretan-termin' && (
        <label className="mt-5 block max-w-xs text-sm">
          <span className="mb-1.5 block font-medium text-ink">Datum dolaska</span>
          <input
            type="date"
            value={answers.specificDate}
            onChange={(e) => update({ specificDate: e.target.value })}
            className="min-h-[44px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-ink"
          />
        </label>
      )}

      <fieldset className="mt-7">
        <legend className="mb-2 font-medium text-ink">Broj noćenja</legend>
        <div className="flex gap-3">
          {nightsOptions.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={answers.nights === n}
              onClick={() => update({ nights: n })}
              className={`flex min-h-[44px] flex-1 items-center justify-center rounded-xl2 border text-sm font-medium ${
                answers.nights === n ? 'border-forest bg-sage/70 text-forest' : 'border-ink/12 bg-warm-white text-ink'
              }`}
            >
              {n} {n === 1 ? 'noćenje' : 'noćenja'}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
