import { useState, type FormEvent, type ReactNode } from 'react';
import { ShieldAlert, AlertCircle } from 'lucide-react';
import { isAuthenticated, login } from '@/services/adminAuth';

export default function AdminAuthGuard({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(isAuthenticated());
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (authed) return <>{children}</>;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (login(password)) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl2 bg-warm-white p-8 shadow-card">
        <ShieldAlert size={28} className="text-forest" aria-hidden="true" />
        <h1 className="mt-3 font-serif text-2xl text-ink">VikArt admin</h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          Prototip zaštite pristupa — zameniti pravim authentication sistemom pre produkcijske upotrebe.
        </p>

        <label className="mt-6 block text-sm">
          <span className="mb-1.5 block font-medium text-ink">Lozinka</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="min-h-[44px] w-full rounded-lg border border-ink/15 bg-warm-white px-3 text-ink"
            aria-invalid={error}
          />
        </label>

        {error && (
          <p role="alert" className="mt-3 flex items-start gap-2 rounded-lg bg-terracotta/10 px-3 py-2 text-sm text-terracotta">
            <AlertCircle size={16} className="mt-0.5 flex-none" aria-hidden="true" /> Pogrešna lozinka.
          </p>
        )}

        <button
          type="submit"
          className="mt-5 flex min-h-[44px] w-full items-center justify-center rounded-full bg-forest px-6 text-sm font-semibold text-warm-white hover:bg-forest/90"
        >
          Uloguj se
        </button>
      </form>
    </div>
  );
}
