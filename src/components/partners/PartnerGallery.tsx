import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ImageRef } from '@/types';
import Image from '@/components/ui/Image';

export default function PartnerGallery({ photos }: { photos: ImageRef[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {photos.map((photo, index) => (
          <button
            key={photo.src + index}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="aspect-square overflow-hidden rounded-lg"
            aria-label={`Prikaži fotografiju ${index + 1} od ${photos.length}`}
          >
            <Image image={photo} className="h-full w-full object-cover transition-transform hover:scale-105" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galerija fotografija"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            aria-label="Zatvori galeriju"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-warm-white/10 text-warm-white hover:bg-warm-white/20"
          >
            <X size={22} aria-hidden="true" />
          </button>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
              }}
              aria-label="Prethodna fotografija"
              className="absolute left-2 flex h-11 w-11 flex-none items-center justify-center rounded-full bg-warm-white/10 text-warm-white hover:bg-warm-white/20 sm:left-4"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
          )}

          <img
            src={photos[openIndex].src}
            alt={photos[openIndex].alt}
            className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length));
              }}
              aria-label="Sledeća fotografija"
              className="absolute right-2 flex h-11 w-11 flex-none items-center justify-center rounded-full bg-warm-white/10 text-warm-white hover:bg-warm-white/20 sm:right-4"
            >
              <ChevronRight size={24} aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
