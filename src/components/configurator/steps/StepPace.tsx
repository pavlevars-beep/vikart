import type { ConfiguratorAnswers, PaceKey } from '@/types';
import { paceLabels } from '@/utils/labels';
import OptionButton from '../OptionButton';

const options = Object.keys(paceLabels) as PaceKey[];

interface StepProps {
  answers: ConfiguratorAnswers;
  update: (patch: Partial<ConfiguratorAnswers>) => void;
}

export default function StepPace({ answers, update }: StepProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink sm:text-3xl">Kakav tempo želite?</h2>
      <div className="mt-6 grid gap-3">
        {options.map((key) => (
          <OptionButton
            key={key}
            title={paceLabels[key]}
            selected={answers.pace === key}
            onClick={() => update({ pace: key })}
          />
        ))}
      </div>
    </div>
  );
}
