import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Stranica nije pronađena');
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <h1 className="font-serif text-3xl text-ink">Ova strana ne postoji</h1>
      <p className="mt-3 text-ink-soft">Izgleda da ste zalutali sa staze. Vratimo vas na početak.</p>
      <Link to="/" className="mt-6 rounded-full bg-forest px-6 py-3 text-sm font-semibold text-warm-white">
        Nazad na početnu
      </Link>
    </div>
  );
}
