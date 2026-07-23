import { NavLink, Outlet, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import AdminAuthGuard from './AdminAuthGuard';
import { logout } from '@/services/adminAuth';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/upiti-partnera', label: 'Upiti partnera' },
  { to: '/admin/partneri', label: 'Partneri' },
  { to: '/admin/ponude', label: 'Ponude' },
  { to: '/admin/iskustva', label: 'Iskustva' },
  { to: '/admin/paketi', label: 'Paketi' },
  { to: '/admin/rezervacije', label: 'Rezervacije' },
  { to: '/admin/podesavanja', label: 'Podešavanja' },
];

export default function AdminLayout() {
  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-cream">
        <header className="border-b border-ink/10 bg-forest text-warm-white">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link to="/admin" className="font-serif text-lg">
              VikArt <span className="text-gold">admin</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                window.location.href = '/';
              }}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-warm-white/80 hover:bg-warm-white/10 hover:text-warm-white"
            >
              <LogOut size={15} aria-hidden="true" /> Odjava
            </button>
          </div>
          <nav className="mx-auto flex max-w-[1400px] gap-1 overflow-x-auto px-4 pb-3 sm:px-6" aria-label="Admin navigacija">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex-none rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap ${
                    isActive ? 'bg-gold text-ink' : 'text-warm-white/80 hover:bg-warm-white/10 hover:text-warm-white'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:py-8">
          <Outlet />
        </main>
      </div>
    </AdminAuthGuard>
  );
}
