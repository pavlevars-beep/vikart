import type { ConfiguratorAnswers, OccasionKey } from '@/types';
import { occasionLabels } from '@/utils/labels';
import OptionButton from '../OptionButton';

const options = Object.keys(occasionLabels) as OccasionKey[];

interface StepProps {
  answers: ConfiguratorAnswers;
  update: (patch: Partial<ConfiguratorAnswers>) => void;
}

export default function StepOccasion({ answers, update }: StepProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink sm:text-3xl">Koji je vaš povod?</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((key) => (
          <OptionButton
            key={key}
            title={occasionLabels[key]}
            selected={answers.occasion === key}
            onClick={() => update({ occasion: key })}
          />
        ))}
      </div>
    </div>
  );
}
