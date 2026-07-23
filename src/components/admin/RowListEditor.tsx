import type { ReactNode } from 'react';
import { Plus, X } from 'lucide-react';

interface RowListEditorProps<T> {
  label: string;
  items: T[];
  onChange: (next: T[]) => void;
  makeEmpty: () => T;
  renderRow: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  addLabel?: string;
}

/** Generički editor za liste objekata (facts, inclusions, tiers, add-ons...). */
export default function RowListEditor<T>({ label, items, onChange, makeEmpty, renderRow, addLabel = 'Dodaj' }: RowListEditorProps<T>) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-2 rounded-lg border border-ink/10 p-2.5">
            <div className="flex-1">
              {renderRow(item, (patch) => {
                const next = items.map((existing, i) => (i === index ? { ...existing, ...patch } : existing));
                onChange(next);
              })}
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="Ukloni stavku"
              className="flex h-8 w-8 flex-none items-center justify-center rounded-lg text-ink-soft hover:bg-terracotta/10 hover:text-terracotta"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...items, makeEmpty()])}
        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline"
      >
        <Plus size={14} aria-hidden="true" /> {addLabel}
      </button>
    </div>
  );
}
