import type { ImageRef } from '@/types';
import { images, type ImageKey } from '@/data/images';
import Image from '@/components/ui/Image';

const imageKeys = Object.keys(images) as ImageKey[];

interface AdminImagePickerProps {
  label: string;
  value: ImageRef | undefined;
  onChange: (next: ImageRef | undefined) => void;
  allowClear?: boolean;
}

/**
 * Prototype izbor fotografije — bira iz postojećeg legalnog fonda fotografija
 * (`data/images.ts`) ili unosi proizvoljan URL. Kada partner dostavi stvarne
 * fotografije, dovoljno je da admin ovde unese pravi URL i alt tekst — nema
 * potrebe za izmenom bilo koje UI komponente koja fotografiju prikazuje.
 */
export default function AdminImagePicker({ label, value, onChange, allowClear = false }: AdminImagePickerProps) {
  const matchedKey = imageKeys.find((key) => images[key].src === value?.src);

  return (
    <div>
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <div className="flex gap-3">
        {value?.src && (
          <div className="h-16 w-16 flex-none overflow-hidden rounded-lg border border-ink/10">
            <Image image={value} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <select
            value={matchedKey ?? ''}
            onChange={(e) => {
              const key = e.target.value as ImageKey;
              if (!key) {
                if (allowClear) onChange(undefined);
                return;
              }
              onChange(images[key]);
            }}
            className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm"
          >
            {allowClear && <option value="">— nema —</option>}
            {!allowClear && !matchedKey && <option value="">Izaberite iz postojećeg fonda…</option>}
            {imageKeys.map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          <input
            value={value?.src ?? ''}
            placeholder="Ili unesite direktan URL fotografije"
            onChange={(e) => onChange({ src: e.target.value, alt: value?.alt ?? '' })}
            className="min-h-[36px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-xs text-ink"
          />
          <input
            value={value?.alt ?? ''}
            placeholder="Alt tekst (opis fotografije)"
            onChange={(e) => onChange({ src: value?.src ?? '', alt: e.target.value })}
            className="min-h-[36px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-xs text-ink"
          />
        </div>
      </div>
    </div>
  );
}
