import { ArrowUp, ArrowDown, X, Plus } from 'lucide-react';
import type { ImageRef } from '@/types';
import { images } from '@/data/images';
import AdminImagePicker from './AdminImagePicker';

export default function AdminGalleryEditor({ values, onChange }: { values: ImageRef[]; onChange: (next: ImageRef[]) => void }) {
  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= values.length) return;
    const next = [...values];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">Galerija (redosled je isti kao ovde)</span>
      <div className="space-y-2">
        {values.map((photo, index) => (
          <div key={index} className="flex items-start gap-2 rounded-lg border border-ink/10 p-2.5">
            <div className="flex-1">
              <AdminImagePicker
                label={`Fotografija ${index + 1}`}
                value={photo}
                onChange={(next) => {
                  if (!next) return;
                  const copy = [...values];
                  copy[index] = next;
                  onChange(copy);
                }}
              />
            </div>
            <div className="flex flex-none flex-col gap-1">
              <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Pomeri gore" className="flex h-7 w-7 items-center justify-center rounded text-ink-soft hover:bg-cream disabled:opacity-30">
                <ArrowUp size={14} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => move(index, 1)} disabled={index === values.length - 1} aria-label="Pomeri dole" className="flex h-7 w-7 items-center justify-center rounded text-ink-soft hover:bg-cream disabled:opacity-30">
                <ArrowDown size={14} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} aria-label="Ukloni fotografiju" className="flex h-7 w-7 items-center justify-center rounded text-ink-soft hover:bg-terracotta/10 hover:text-terracotta">
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange([...values, images.zlatiborHero])}
        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline"
      >
        <Plus size={14} aria-hidden="true" /> Dodaj fotografiju
      </button>
    </div>
  );
}
