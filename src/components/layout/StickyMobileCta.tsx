import { Link } from 'react-router-dom';

export default function StickyMobileCta() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/10 bg-warm-white/95 px-4 py-3 backdrop-blur lg:hidden"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <Link
        to="/konfigurator"
        className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-forest px-5 text-base font-semibold text-warm-white"
      >
        Napravi moje iskustvo
      </Link>
    </div>
  );
}
