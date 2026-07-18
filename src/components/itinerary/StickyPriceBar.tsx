import { formatPrice } from '@/utils/format';

interface StickyPriceBarProps {
  totalPrice: number;
  groupSize: number;
  onSubmit: () => void;
}

export default function StickyPriceBar({ totalPrice, groupSize, onSubmit }: StickyPriceBarProps) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-ink/10 bg-warm-white/95 px-4 py-3 backdrop-blur"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div>
        <p className="font-serif text-lg leading-tight text-forest">{formatPrice(totalPrice)}</p>
        <p className="text-xs text-ink-soft">za {groupSize} {groupSize === 1 ? 'osobu' : 'osoba'}</p>
      </div>
      <button
        type="button"
        onClick={onSubmit}
        className="flex min-h-[44px] flex-none items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-warm-white hover:bg-forest/90"
      >
        Pošalji plan na proveru
      </button>
    </div>
  );
}
