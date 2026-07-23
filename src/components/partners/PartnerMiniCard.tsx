import { Link } from 'react-router-dom';
import { MapPin, ArrowUpRight } from 'lucide-react';
import type { Partner } from '@/types';
import Image from '@/components/ui/Image';
import OfferStatusBadge from './OfferStatusBadge';
import { partnerCategoryLabels } from '@/utils/labels';

interface PartnerMiniCardProps {
  partner: Partner;
  className?: string;
}

/**
 * Sitna referenca na partnera — koristi se svuda gde iskustvo ili paket "imenuje"
 * konkretnog partnera koji ga realizuje (itinerer, kartica plana, paket).
 */
export default function PartnerMiniCard({ partner, className = '' }: PartnerMiniCardProps) {
  return (
    <div className={`flex gap-3 rounded-xl2 border border-ink/8 bg-warm-white p-3 ${className}`}>
      <div className="h-16 w-16 flex-none overflow-hidden rounded-lg">
        <Image image={partner.media.mainPhoto} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="font-serif text-base leading-tight text-ink">{partner.name}</p>
          <OfferStatusBadge status={partner.status} />
        </div>
        <p className="mt-0.5 text-xs text-ink-soft">
          {partner.categories.map((c) => partnerCategoryLabels[c]).join(' · ')}
        </p>
        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-soft">
          <MapPin size={12} aria-hidden="true" /> {partner.location.area}
        </p>
        <p className="mt-1 text-sm text-ink-soft">{partner.oneLiner}</p>
        <Link
          to={`/partneri/${partner.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline"
        >
          Pogledaj partnera <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
