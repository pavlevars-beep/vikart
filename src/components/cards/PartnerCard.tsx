import { MapPin } from 'lucide-react';
import type { Partner } from '@/types';
import Image from '@/components/ui/Image';

const typeLabels: Record<Partner['type'], string> = {
  hotel: 'Hotel',
  apartman: 'Apartman',
  'kuca-brvnara': 'Kuća / brvnara',
  vila: 'Vila',
  'wellness-spa': 'Wellness i spa',
  restoran: 'Restoran',
  avantura: 'Avanturistička aktivnost',
  vodic: 'Vodič',
  prevoz: 'Prevoz',
  fotograf: 'Fotograf',
  dekoracija: 'Dekoracija i pokloni',
  domacinstvo: 'Autentično domaćinstvo',
  ostalo: 'Ostalo',
};

export default function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl2 border border-ink/8 bg-warm-white shadow-card">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image image={partner.image} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-warm-white/90 px-2.5 py-1 text-xs font-medium text-forest">
          {typeLabels[partner.type]}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg text-ink">{partner.name}</h3>
        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink-soft">
          <MapPin size={13} aria-hidden="true" /> {partner.location}
        </p>
        <p className="mt-2 text-sm text-ink-soft">{partner.description}</p>
        <p className="mt-3 text-xs text-terracotta">Ilustrativan prikaz — saradnja nije zvanično potvrđena.</p>
      </div>
    </article>
  );
}
