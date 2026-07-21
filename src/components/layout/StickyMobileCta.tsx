import { Link } from 'react-router-dom';
import { useCatalogPicks } from '@/hooks/useCatalogPicks';

export default function StickyMobileCta() {
  const { picks } = useCatalogPicks();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-warm-white/95 px-4 py-3 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <Link
        to="/konfigurator"
        className="relative flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-forest px-5 text-base font-semibold text-warm-white"
      >
        Napravi moje iskustvo
        {picks.length > 0 && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-ink">
            {picks.length}
          </span>
        )}
      </Link>
    </div>
  );
}
