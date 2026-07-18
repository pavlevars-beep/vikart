import type { ConfiguratorAnswers, WantKey } from '@/types';
import { wantLabels } from '@/utils/labels';
import OptionButton from '../OptionButton';

const options = Object.keys(wantLabels) as WantKey[];

interface StepProps {
  answers: ConfiguratorAnswers;
  update: (patch: Partial<ConfiguratorAnswers>) => void;
}

export default function StepWants({ answers, update }: StepProps) {
  function toggle(key: WantKey) {
    const isSelected = answers.wants.includes(key);
    update({
      wants: isSelected ? answers.wants.filter((w) => w !== key) : [...answers.wants, key],
    });
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-ink sm:text-3xl">Šta želite da uključimo?</h2>
      <p className="mt-1.5 text-sm text-ink-soft">Izaberite sve što vas zanima — kasnije možete i da menjate.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((key) => (
          <OptionButton
            key={key}
            title={wantLabels[key]}
            selected={answers.wants.includes(key)}
            onClick={() => toggle(key)}
          />
        ))}
      </div>
    </div>
  );
}
