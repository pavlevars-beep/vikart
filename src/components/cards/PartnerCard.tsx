import { MapPin } from 'lucide-react';
import type { Partner } from '@/types';
import Image from '@/components/ui/Image';
import OfferStatusBadge from '@/components/partners/OfferStatusBadge';
import { partnerCategoryLabels } from '@/utils/labels';

export default function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl2 border border-ink/8 bg-warm-white shadow-card">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image image={partner.media.mainPhoto} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-warm-white/90 px-2.5 py-1 text-xs font-medium text-forest">
          {partner.categories.map((c) => partnerCategoryLabels[c]).join(' · ')}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg text-ink">{partner.name}</h3>
        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
          <MapPin size={13} aria-hidden="true" /> {partner.location.area}
        </p>
        <p className="mt-2 text-sm text-ink-soft">{partner.oneLiner}</p>
        <OfferStatusBadge status={partner.status} className="mt-3" />
      </div>
    </article>
  );
}
