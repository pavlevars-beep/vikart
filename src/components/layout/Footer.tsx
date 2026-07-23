import { Link } from 'react-router-dom';
import Logo from '@/components/brand/Logo';
import { photoCredits } from '@/data/photoCredits';

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-forest text-warm-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo tone="light" />
            <p className="mt-3 max-w-xs text-sm text-warm-white/70">Umetnost dobrog vikenda.</p>
          </div>

          <nav aria-label="Istraži">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">Istraži</h3>
            <ul className="mt-3 space-y-2 text-sm text-warm-white/80">
              <li><Link to="/iskustva" className="hover:text-warm-white">Iskustva</Link></li>
              <li><Link to="/paketi" className="hover:text-warm-white">Paketi</Link></li>
              <li><Link to="/partneri" className="hover:text-warm-white">Partneri</Link></li>
              <li><Link to="/kako-funkcionise" className="hover:text-warm-white">Kako funkcioniše</Link></li>
              <li><Link to="/konfigurator" className="hover:text-warm-white">Napravi moje iskustvo</Link></li>
            </ul>
          </nav>

          <nav aria-label="Partneri">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">Partneri</h3>
            <ul className="mt-3 space-y-2 text-sm text-warm-white/80">
              <li><Link to="/za-partnere" className="hover:text-warm-white">Postani VikArt partner</Link></li>
              <li><Link to="/za-partnere/prijava" className="hover:text-warm-white">Prijavi interesovanje</Link></li>
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gold">Pilot destinacija</h3>
            <p className="mt-3 text-sm text-warm-white/80">Zlatibor, Srbija</p>
            <p className="mt-4 text-xs text-warm-white/50">
              Cene i ponude u ovoj verziji su demonstracione. Dostupnost dobavljača se potvrđuje pojedinačno.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-warm-white/10 pt-6">
          <details className="text-xs text-warm-white/50">
            <summary className="cursor-pointer select-none text-warm-white/60 hover:text-warm-white/80">
              Izvori fotografija
            </summary>
            <ul className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {photoCredits.map((credit) => (
                <li key={credit.file}>
                  <a href={credit.source} target="_blank" rel="noopener noreferrer" className="hover:text-warm-white/80">
                    {credit.title}
                  </a>{' '}
                  — {credit.artist} ({credit.license})
                </li>
              ))}
            </ul>
            <p className="mt-3">Fotografije: Wikimedia Commons (javno dobro / CC0 / CC BY / CC BY-SA).</p>
          </details>
          <p className="mt-4 text-xs text-warm-white/40">© {new Date().getFullYear()} VikArt. Demonstracioni prikaz proizvoda.</p>
        </div>
      </div>
    </footer>
  );
}
