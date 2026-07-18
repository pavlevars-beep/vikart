import type { ConfiguratorAnswers, FeelingKey } from '@/types';
import { feelingLabels, feelingDescriptions } from '@/utils/labels';
import OptionButton from '../OptionButton';

const options = Object.keys(feelingLabels) as FeelingKey[];
const MAX_FEELINGS = 3;

interface StepProps {
  answers: ConfiguratorAnswers;
  update: (patch: Partial<ConfiguratorAnswers>) => void;
}

export default function StepFeelings({ answers, update }: StepProps) {
  function toggle(key: FeelingKey) {
    const isSelected = answers.feelings.includes(key);
    if (isSelected) {
      update({ feelings: answers.feelings.filter((f) => f !== key) });
    } else {
      if (answers.feelings.length >= MAX_FEELINGS) return;
      update({ feelings: [...answers.feelings, key] });
    }
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-ink sm:text-3xl">Kako želite da se osećate?</h2>
      <p className="mt-1.5 text-sm text-ink-soft">Izaberite najviše tri opcije. ({answers.feelings.length}/{MAX_FEELINGS})</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((key) => (
          <OptionButton
            key={key}
            title={feelingLabels[key]}
            description={feelingDescriptions[key]}
            selected={answers.feelings.includes(key)}
            onClick={() => toggle(key)}
            disabled={!answers.feelings.includes(key) && answers.feelings.length >= MAX_FEELINGS}
          />
        ))}
      </div>
    </div>
  );
}
