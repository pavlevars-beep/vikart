import type { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface OptionButtonProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export default function OptionButton({ selected, onClick, title, description, icon, disabled }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={`relative flex min-h-[44px] flex-col items-start gap-1 rounded-xl2 border p-4 text-left transition-colors ${
        selected
          ? 'border-forest bg-sage/70 ring-1 ring-forest'
          : 'border-ink/12 bg-warm-white hover:border-forest/40'
      } ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
    >
      {icon && <span className="text-forest" aria-hidden="true">{icon}</span>}
      <span className="font-serif text-base text-ink">{title}</span>
      {description && <span className="text-xs text-ink-soft">{description}</span>}
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-forest text-warm-white">
          <Check size={13} aria-hidden="true" />
        </span>
      )}
    </button>
  );
}
