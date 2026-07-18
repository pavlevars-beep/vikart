import { Clock } from 'lucide-react';
import type { ItineraryDay } from '@/types';

export default function Timeline({ days }: { days: ItineraryDay[] }) {
  return (
    <div className="space-y-8">
      {days.map((day) => (
        <div key={day.dayLabel}>
          <h3 className="font-serif text-xl text-ink">{day.dayLabel}</h3>
          <ol className="mt-3 space-y-0">
            {day.items.map((item, index) => (
              <li key={`${item.time}-${item.title}-${index}`} className="relative flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-sage text-forest">
                    <Clock size={14} aria-hidden="true" />
                  </span>
                  {index < day.items.length - 1 && <span className="mt-1 w-px flex-1 bg-ink/10" aria-hidden="true" />}
                </div>
                <div className="pt-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gold">{item.time}</p>
                  <p className="font-medium text-ink">{item.title}</p>
                  {item.description && <p className="mt-0.5 text-sm text-ink-soft">{item.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
