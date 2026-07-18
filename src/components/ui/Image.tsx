import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import type { ImageRef } from '@/types';

interface ImageProps {
  image: ImageRef;
  className?: string;
  eager?: boolean;
}

export default function Image({ image, className = '', eager = false }: ImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-sage text-forest/40 ${className}`}>
        <ImageOff size={28} aria-hidden="true" />
        <span className="sr-only">Fotografija trenutno nije dostupna: {image.alt}</span>
      </div>
    );
  }

  return (
    <img
      src={image.src}
      alt={image.alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
