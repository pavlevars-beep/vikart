import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ConfiguratorAnswers, Experience, GeneratedPlan } from '@/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { readStorage, writeStorage, storageKeys } from '@/utils/storage';
import { removeExperience, swapExperience, addExperience, changeAccommodation } from '@/utils/planGenerator';
import PlanCard from '@/components/results/PlanCard';

export default function Results() {
  useDocumentTitle('Vaši predlozi');
  const [plans, setPlans] = useState<GeneratedPlan[] | null>(null);
  const [answers, setAnswers] = useState<ConfiguratorAnswers | null>(null);

  useEffect(() => {
    setPlans(readStorage<GeneratedPlan[]>(storageKeys.lastPlans));
    setAnswers(readStorage<ConfiguratorAnswers>(storageKeys.lastAnswers));
  }, []);

  function updatePlan(tier: GeneratedPlan['tier'], updater: (plan: GeneratedPlan) => GeneratedPlan) {
    setPlans((prev) => {
      if (!prev) return prev;
      const next = prev.map((plan) => (plan.tier === tier ? updater(plan) : plan));
      writeStorage(storageKeys.lastPlans, next);
      return next;
    });
  }

  if (plans === null) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-ink">Još nemate predloge</h1>
        <p className="mt-3 text-ink-soft">Prođite kroz konfigurator da bismo napravili tri predloga plana za vas.</p>
        <Link to="/konfigurator" className="mt-6 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-warm-white">
          Idi na konfigurator
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl text-ink sm:text-4xl">Vaša tri predloga</h1>
        <p className="mt-2 text-ink-soft">
          Na osnovu vaših odgovora sastavili smo tri izvodljiva plana. Svaki možete prilagoditi — uklonite, zamenite ili
          dodajte iskustvo, a procena cene se odmah ažurira.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.tier}
            plan={plan}
            highlighted={plan.tier === 'preporuka'}
            onRemove={(expId) => answers && updatePlan(plan.tier, (p) => removeExperience(p, expId, answers))}
            onSwap={(expId) => answers && updatePlan(plan.tier, (p) => swapExperience(p, expId, answers))}
            onAdd={(exp: Experience) => answers && updatePlan(plan.tier, (p) => addExperience(p, exp, answers))}
            onChangeAccommodation={(partnerId) => updatePlan(plan.tier, (p) => changeAccommodation(p, partnerId))}
          />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/konfigurator" className="text-sm font-semibold text-forest hover:underline">
          ← Izmeni odgovore u konfiguratoru
        </Link>
      </div>
    </div>
  );
}
