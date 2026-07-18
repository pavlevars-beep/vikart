interface ProgressBarProps {
  step: number;
  total: number;
  stepLabels: string[];
}

export default function ProgressBar({ step, total, stepLabels }: ProgressBarProps) {
  return (
    <div role="group" aria-label={`Korak ${step} od ${total}`}>
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            className={`h-1.5 flex-1 rounded-full ${n <= step ? 'bg-forest' : 'bg-ink/10'}`}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="mt-2 text-xs font-medium text-ink-soft">
        Korak {step} od {total} · {stepLabels[step - 1]}
      </p>
    </div>
  );
}
