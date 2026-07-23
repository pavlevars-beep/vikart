import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface ConfirmButtonProps {
  label: string;
  confirmLabel?: string;
  onConfirm: () => void;
  className?: string;
  tone?: 'default' | 'danger';
}

/** Dugme koje pre izvršenja rizične akcije traži jednu dodatnu potvrdu, inline. */
export default function ConfirmButton({ label, confirmLabel = 'Da, potvrdi', onConfirm, className = '', tone = 'default' }: ConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            onConfirm();
            setConfirming(false);
          }}
          className={`inline-flex min-h-[36px] items-center gap-1 rounded-full px-3 text-xs font-semibold text-warm-white ${
            tone === 'danger' ? 'bg-terracotta' : 'bg-forest'
          }`}
        >
          <Check size={13} aria-hidden="true" /> {confirmLabel}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="inline-flex min-h-[36px] items-center gap-1 rounded-full border border-ink/15 px-3 text-xs font-medium text-ink-soft"
        >
          <X size={13} aria-hidden="true" /> Otkaži
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className={`inline-flex min-h-[36px] items-center rounded-full border px-3 text-xs font-semibold ${
        tone === 'danger' ? 'border-terracotta/40 text-terracotta hover:bg-terracotta/10' : 'border-ink/15 text-ink hover:bg-cream'
      } ${className}`}
    >
      {label}
    </button>
  );
}
