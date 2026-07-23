import { Plus, X } from 'lucide-react';

interface StringListEditorProps {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}

export default function StringListEditor({ label, values, onChange, placeholder }: StringListEditorProps) {
  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              value={value}
              placeholder={placeholder}
              onChange={(e) => {
                const next = [...values];
                next[index] = e.target.value;
                onChange(next);
              }}
              className="min-h-[38px] flex-1 rounded-lg border border-ink/15 bg-warm-white px-3 text-sm text-ink"
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              aria-label="Ukloni stavku"
              className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-lg text-ink-soft hover:bg-terracotta/10 hover:text-terracotta"
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...values, ''])}
        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline"
      >
        <Plus size={14} aria-hidden="true" /> Dodaj
      </button>
    </div>
  );
}
