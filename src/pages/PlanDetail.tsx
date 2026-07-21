import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Users, Moon, CloudRain } from 'lucide-react';
import type { GeneratedPlan } from '@/types';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { readStorage, storageKeys } from '@/utils/storage';
import { formatPrice } from '@/utils/format';
import { availabilityLabels } from '@/utils/labels';
import Timeline from '@/components/itinerary/Timeline';
import StickyPriceBar from '@/components/itinerary/StickyPriceBar';
import PlanReviewForm from '@/components/forms/PlanReviewForm';
import DemoTag from '@/components/ui/DemoTag';

export default function PlanDetail() {
  const { planId, slug } = useParams<{ planId?: string; slug?: string }>();
  const key = planId ?? slug;
  const [plan, setPlan] = useState<GeneratedPlan | null | undefined>(undefined);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const plans = readStorage<GeneratedPlan[]>(storageKeys.lastPlans) ?? [];
    const found = plans.find((p) => p.id === key) ?? plans.find((p) => p.tier === key) ?? plans[0] ?? null;
    setPlan(found);
  }, [key]);

  useDocumentTitle(plan ? plan.title : 'Detaljan plan');

  if (plan === undefined) return null;

  if (!plan) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-ink">Plan nije pronađen</h1>
        <p className="mt-3 text-ink-soft">Prošao je previše vremena ili plan još nije generisan. Vratite se na konfigurator ili pakete.</p>
        <div className="mt-6 flex gap-3">
          <Link to="/konfigurator" className="rounded-full bg-forest px-5 py-3 text-sm font-semibold text-warm-white">
            Konfigurator
          </Link>
          <Link to="/paketi" className="rounded-full bg-sage px-5 py-3 text-sm font-semibold text-forest">
            Paketi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold">{plan.title}</p>
        <h1 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">{plan.accommodation.name}</h1>
        <p className="mt-3 max-w-2xl text-ink-soft">{plan.reason}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1.5"><Users size={16} aria-hidden="true" /> {plan.groupSize} {plan.groupSize === 1 ? 'osoba' : 'osobe/a'}</span>
          <span className="inline-flex items-center gap-1.5"><Moon size={16} aria-hidden="true" /> {plan.nights} {plan.nights === 1 ? 'noćenje' : 'noćenja'}</span>
          <span className="rounded-full bg-sage px-2.5 py-1 text-xs font-medium text-forest">{availabilityLabels[plan.availability]}</span>
        </div>

        <div className="mt-6 flex items-baseline gap-2">
          <p className="font-serif text-4xl text-forest">{formatPrice(plan.totalPrice)}</p>
          <span className="text-ink-soft">ukupna procena</span>
        </div>
        <p className="text-sm text-ink-soft">{formatPrice(plan.pricePerPerson)} po osobi</p>
        <DemoTag className="mt-2" />

        <section className="mt-10">
          <h2 className="font-serif text-2xl text-ink">Raspored po danima</h2>
          <div className="mt-5">
            <Timeline days={plan.days} />
          </div>
        </section>

        <section className="mt-10 rounded-xl2 border border-gold/30 bg-gold/10 p-5">
          <p className="inline-flex items-center gap-2 font-semibold text-ink">
            <CloudRain size={18} className="text-gold" aria-hidden="true" /> Plan B za loše vreme
          </p>
          <p className="mt-1.5 text-sm text-ink-soft">{plan.badWeatherAlternative}</p>
        </section>

        <section className="mt-10 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="font-serif text-xl text-ink">Šta je uključeno</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-ink-soft">
              {plan.included.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-xl text-ink">Šta nije uključeno</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-ink-soft">
              {plan.excluded.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <div ref={formRef} className="mt-12 scroll-mt-20">
          <PlanReviewForm
            planTitle={plan.title}
            totalPrice={plan.totalPrice}
            nights={plan.nights}
            groupSize={plan.groupSize}
            accommodationName={plan.accommodation.name}
            experienceNames={plan.experiences.map((exp) => exp.name)}
          />
        </div>
      </div>

      <StickyPriceBar
        totalPrice={plan.totalPrice}
        groupSize={plan.groupSize}
        onSubmit={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
      />
    </div>
  );
}
