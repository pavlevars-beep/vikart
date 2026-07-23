import { Clock, DoorOpen, LogOut, Coffee } from 'lucide-react';
import type { ItineraryDay } from '@/types';
import { getExperienceById } from '@/data/experiences';
import { getPartnerById } from '@/data/partners';
import { getPartnerOfferById } from '@/data/partnerOffers';
import PartnerMiniCard from '@/components/partners/PartnerMiniCard';
import ExperienceAccordion from '@/components/partners/ExperienceAccordion';

const LOGISTICS_ICONS: Record<string, typeof Clock> = {
  DoorOpen,
  LogOut,
  Coffee,
};

export default function Timeline({ days }: { days: ItineraryDay[] }) {
  return (
    <div className="space-y-8">
      {days.map((day) => (
        <div key={day.dayLabel}>
          <h3 className="font-serif text-xl text-ink">{day.dayLabel}</h3>
          <ol className="mt-3 space-y-0">
            {day.items.map((item, index) => {
              const experience = item.experienceId ? getExperienceById(item.experienceId) : undefined;
              const partner = experience ? getPartnerById(experience.partnerId) : undefined;
              const offer = experience ? getPartnerOfferById(experience.offerId) : undefined;
              const LogisticsIcon = item.icon ? LOGISTICS_ICONS[item.icon] ?? Clock : Clock;

              return (
                <li key={`${item.time}-${item.title}-${index}`} className="relative flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${
                        item.kind === 'logistika' ? 'bg-cream text-ink-soft' : 'bg-sage text-forest'
                      }`}
                    >
                      {item.kind === 'logistika' ? (
                        <LogisticsIcon size={14} aria-hidden="true" />
                      ) : (
                        <Clock size={14} aria-hidden="true" />
                      )}
                    </span>
                    {index < day.items.length - 1 && <span className="mt-1 w-px flex-1 bg-ink/10" aria-hidden="true" />}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gold">{item.time}</p>
                    <p className="font-medium text-ink">{item.title}</p>
                    {item.description && <p className="mt-0.5 text-sm text-ink-soft">{item.description}</p>}

                    {item.kind === 'usluga' && partner && (
                      <div className="mt-2.5 space-y-2">
                        <PartnerMiniCard partner={partner} />
                        {offer && <ExperienceAccordion offer={offer} />}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
}
