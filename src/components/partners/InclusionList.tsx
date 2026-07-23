import { CheckSquare, XSquare, CircleDollarSign, Clock3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type InclusionVariant = 'included' | 'excluded' | 'addon' | 'pending';

const ICONS: Record<InclusionVariant, LucideIcon> = {
  included: CheckSquare,
  excluded: XSquare,
  addon: CircleDollarSign,
  pending: Clock3,
};

const COLORS: Record<InclusionVariant, string> = {
  included: 'text-forest',
  excluded: 'text-terracotta',
  addon: 'text-gold',
  pending: 'text-gold',
};

/**
 * Dosledan prikaz uključeno/nije uključeno/doplata/čeka potvrdu — bez emoji
 * simbola, iste Lucide ikonice svuda na sajtu.
 */
export default function InclusionList({ items, variant }: { items: string[]; variant: InclusionVariant }) {
  const Icon = ICONS[variant];
  if (items.length === 0) return null;
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
          <Icon size={16} className={`mt-0.5 flex-none ${COLORS[variant]}`} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
