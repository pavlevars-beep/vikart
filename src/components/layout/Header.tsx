import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '@/components/brand/Logo';
import { useCatalogPicks } from '@/hooks/useCatalogPicks';

const navLinks = [
  { to: '/iskustva', label: 'Iskustva' },
  { to: '/paketi', label: 'Paketi' },
  { to: '/kako-funkcionise', label: 'Kako funkcioniše' },
  { to: '/za-partnere', label: 'Za partnere' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { picks } = useCatalogPicks();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-warm-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center" aria-label="VikArt — početna">
          <Logo variant="mark" className="sm:hidden" />
          <Logo variant="full" className="hidden sm:block" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Glavna navigacija">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-forest ${
                  isActive ? 'text-forest' : 'text-ink-soft'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/konfigurator"
            className="relative hidden rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-warm-white transition-colors hover:bg-forest/90 lg:inline-flex"
          >
            Napravi moje iskustvo
            {picks.length > 0 && (
              <span
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-xs font-bold text-ink"
                aria-label={`${picks.length} sačuvanih iskustava`}
              >
                {picks.length}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink lg:hidden"
            aria-label={open ? 'Zatvori meni' : 'Otvori meni'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/5 bg-warm-white lg:hidden" role="dialog" aria-modal="true">
          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobilna navigacija">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `min-h-[44px] rounded-lg px-3 py-3 text-base font-medium ${
                    isActive ? 'bg-sage text-forest' : 'text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/konfigurator"
              className="mt-2 flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-center text-base font-semibold text-warm-white"
            >
              Napravi moje iskustvo
              {picks.length > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-ink">
                  {picks.length}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
