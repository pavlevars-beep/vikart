import type { OfferStatus } from '@/types';
import { offerStatusLabels } from '@/utils/labels';

const STATUS_STYLES: Record<OfferStatus, string> = {
  demo: 'bg-ink/8 text-ink-soft',
  available_on_request: 'bg-sage text-forest',
  pending_confirmation: 'bg-gold/20 text-ink',
  confirmed: 'bg-forest text-warm-white',
  unavailable: 'bg-terracotta/10 text-terracotta',
};

export default function OfferStatusBadge({ status, className = '' }: { status: OfferStatus; className?: string }) {
  return (
    <span className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]} ${className}`}>
      {offerStatusLabels[status]}
    </span>
  );
}
