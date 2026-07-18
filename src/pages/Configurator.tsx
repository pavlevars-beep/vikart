import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ConfiguratorAnswers } from '@/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { readStorage, writeStorage, storageKeys } from '@/utils/storage';
import { defaultAnswers, hydrateFromSearchParams } from '@/utils/configuratorDefaults';
import { generatePlans } from '@/utils/planGenerator';
import ProgressBar from '@/components/configurator/ProgressBar';
import StepOccasion from '@/components/configurator/steps/StepOccasion';
import StepTravelers from '@/components/configurator/steps/StepTravelers';
import StepDates from '@/components/configurator/steps/StepDates';
import StepFeelings from '@/components/configurator/steps/StepFeelings';
import StepWants from '@/components/configurator/steps/StepWants';
import StepBudget from '@/components/configurator/steps/StepBudget';
import StepPace from '@/components/configurator/steps/StepPace';
import StepSpecialRequest from '@/components/configurator/steps/StepSpecialRequest';

const stepLabels = [
  'Povod',
  'Ko putuje',
  'Termin',
  'Osećaj',
  'Uključeno',
  'Budžet',
  'Tempo',
  'Poseban zahtev',
];

const TOTAL_STEPS = stepLabels.length;

export default function Configurator() {
  useDocumentTitle('Konfigurator iskustva');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [answers, setAnswers] = useState<ConfiguratorAnswers>(() => {
    const draft = readStorage<ConfiguratorAnswers>(storageKeys.lastAnswers);
    const patch = hydrateFromSearchParams(searchParams);
    return { ...defaultAnswers, ...(draft ?? {}), ...patch };
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    writeStorage(storageKeys.lastAnswers, answers);
  }, [answers]);

  function update(patch: Partial<ConfiguratorAnswers>) {
    setError(null);
    setAnswers((prev) => ({ ...prev, ...patch }));
  }

  const validateStep = useMemo(
    () =>
      (): string | null => {
        switch (step) {
          case 1:
            return answers.occasion ? null : 'Izaberite povod da bismo nastavili.';
          case 2:
            if (!answers.travelerType) return 'Recite nam ko putuje.';
            if (!answers.groupSize || answers.groupSize < 1) return 'Unesite broj osoba.';
            return null;
          case 3:
            if (!answers.dateMode) return 'Izaberite kada dolazite.';
            if (answers.dateMode === 'konkretan-termin' && !answers.specificDate) return 'Unesite datum dolaska.';
            return null;
          case 4:
            return answers.feelings.length > 0 ? null : 'Izaberite bar jedan osećaj.';
          case 5:
            return answers.wants.length > 0 ? null : 'Izaberite bar jednu stvar koju želite da uključimo.';
          case 6:
            return answers.budget ? null : 'Izaberite okvirni budžet.';
          case 7:
            return answers.pace ? null : 'Izaberite željeni tempo.';
          default:
            return null;
        }
      },
    [step, answers],
  );

  function goNext() {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (step === TOTAL_STEPS) {
      const plans = generatePlans(answers);
      writeStorage(storageKeys.lastPlans, plans);
      navigate('/rezultati');
      return;
    }
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <ProgressBar step={step} total={TOTAL_STEPS} stepLabels={stepLabels} />

      <div className="mt-8">
        {step === 1 && <StepOccasion answers={answers} update={update} />}
        {step === 2 && <StepTravelers answers={answers} update={update} />}
        {step === 3 && <StepDates answers={answers} update={update} />}
        {step === 4 && <StepFeelings answers={answers} update={update} />}
        {step === 5 && <StepWants answers={answers} update={update} />}
        {step === 6 && <StepBudget answers={answers} update={update} />}
        {step === 7 && <StepPace answers={answers} update={update} />}
        {step === 8 && <StepSpecialRequest answers={answers} update={update} />}
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className="inline-flex min-h-[44px] items-center gap-1 rounded-full px-4 text-sm font-semibold text-ink-soft disabled:opacity-0"
        >
          <ChevronLeft size={18} aria-hidden="true" /> Nazad
        </button>
        <button
          type="button"
          onClick={goNext}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-forest px-6 text-sm font-semibold text-warm-white hover:bg-forest/90"
        >
          {step === TOTAL_STEPS ? 'Kreiraj moja tri predloga' : 'Dalje'}
          {step !== TOTAL_STEPS && <ChevronRight size={18} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
