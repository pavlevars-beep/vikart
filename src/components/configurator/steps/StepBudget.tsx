import type { ConfiguratorAnswers, BudgetKey } from '@/types';
import { budgetLabels, budgetMidpoints } from '@/utils/labels';
import { formatPrice } from '@/utils/format';
import OptionButton from '../OptionButton';

const options = Object.keys(budgetLabels) as BudgetKey[];

interface StepProps {
  answers: ConfiguratorAnswers;
  update: (patch: Partial<ConfiguratorAnswers>) => void;
}

export default function StepBudget({ answers, update }: StepProps) {
  const groupSize = answers.groupSize || 2;
  const showPerPerson = groupSize > 2;

  return (
    <div>
      <h2 className="font-serif text-2xl text-ink sm:text-3xl">Koliki je ukupan budžet?</h2>
      <p className="mt-1.5 text-sm text-ink-soft">Okvirna ukupna suma za ceo boravak, za {groupSize} {groupSize === 1 ? 'osobu' : 'osoba'}.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((key) => (
          <OptionButton
            key={key}
            title={budgetLabels[key]}
            description={showPerPerson ? `≈ ${formatPrice(Math.round(budgetMidpoints[key] / groupSize))} po osobi` : undefined}
            selected={answers.budget === key}
            onClick={() => update({ budget: key })}
          />
        ))}
      </div>
    </div>
  );
}
