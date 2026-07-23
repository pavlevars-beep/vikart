import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  to?: string;
  tone?: 'default' | 'gold' | 'terracotta';
}

export default function AdminStatCard({ label, value, icon: Icon, to, tone = 'default' }: AdminStatCardProps) {
  const toneClass =
    tone === 'gold' ? 'border-gold/40 bg-gold/10' : tone === 'terracotta' ? 'border-terracotta/30 bg-terracotta/5' : 'border-ink/8 bg-warm-white';

  const content = (
    <div className={`rounded-xl2 border p-4 ${toneClass}`}>
      <Icon size={18} className="text-ink-soft" aria-hidden="true" />
      <p className="mt-2 font-serif text-2xl text-ink">{value}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block transition-shadow hover:shadow-card">
        {content}
      </Link>
    );
  }
  return content;
}
