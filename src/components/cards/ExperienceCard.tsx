import { Clock, Users, CloudSun, CheckCircle2, Plus } from 'lucide-react';
import type { Experience } from '@/types';
import Image from '@/components/ui/Image';
import { formatPrice } from '@/utils/format';
import { categoryLabels, availabilityLabels } from '@/utils/labels';
import { useCatalogPicks } from '@/hooks/useCatalogPicks';

const availabilityStyles: Record<Experience['availability'], string> = {
  'brza-potvrda': 'bg-sage text-forest',
  'potrebna-provera': 'bg-gold/20 text-gold',
  'concierge-zahtev': 'bg-terracotta/15 text-terracotta',
};

const priceUnitLabel: Record<Experience['priceUnit'], string> = {
  po_osobi: 'po osobi',
  po_paru: 'po paru',
  po_grupi: 'po grupi',
};

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const { isPicked, togglePick } = useCatalogPicks();
  const picked = isPicked(experience.id);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl2 border border-ink/8 bg-warm-white shadow-card">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image image={experience.image} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-warm-white/90 px-2.5 py-1 text-xs font-medium text-forest">
          {categoryLabels[experience.category]}
        </span>
        <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${availabilityStyles[experience.availability]}`}>
          {availabilityLabels[experience.availability]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-serif text-lg text-ink">{experience.name}</h3>
        <p className="mt-1 text-sm text-ink-soft">{experience.shortDescription}</p>

        <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-soft">
          <div className="inline-flex items-center gap-1.5">
            <Clock size={14} aria-hidden="true" />
            <dt className="sr-only">Trajanje</dt>
            <dd>{experience.durationLabel}</dd>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <Users size={14} aria-hidden="true" />
            <dt className="sr-only">Minimalan broj učesnika</dt>
            <dd>min. {experience.minParticipants}</dd>
          </div>
          {experience.weatherDependent && (
            <div className="inline-flex items-center gap-1.5">
              <CloudSun size={14} aria-hidden="true" />
              <dt className="sr-only">Zavisnost od vremena</dt>
              <dd>Zavisi od vremena</dd>
            </div>
          )}
        </dl>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <p className="font-serif text-base text-forest">
            od {formatPrice(experience.priceFrom)}
            <span className="ml-1 text-xs font-sans text-ink-soft">{priceUnitLabel[experience.priceUnit]}</span>
          </p>
        </div>

        <button
          type="button"
          onClick={() => togglePick(experience.id)}
          aria-pressed={picked}
          className={`mt-3 flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${
            picked ? 'bg-sage text-forest' : 'bg-forest text-warm-white hover:bg-forest/90'
          }`}
        >
          {picked ? <CheckCircle2 size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
          {picked ? 'Dodato u iskustvo' : 'Dodaj u iskustvo'}
        </button>
      </div>
    </article>
  );
}
