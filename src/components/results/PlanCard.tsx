import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, RefreshCw, Plus, Check, Minus, Users2 } from 'lucide-react';
import type { Experience, GeneratedPlan } from '@/types';
import { formatPrice } from '@/utils/format';
import { availabilityLabels } from '@/utils/labels';
import { listExperiences } from '@/services/experiencesStore';
import { listPartners } from '@/services/partnersStore';
import InclusionList from '@/components/partners/InclusionList';

function involvedPartnerCount(plan: GeneratedPlan): number {
  const ids = new Set<string>([plan.accommodation.id, ...plan.experiences.map((exp) => exp.partnerId)]);
  return ids.size;
}

interface PlanCardProps {
  plan: GeneratedPlan;
  highlighted?: boolean;
  onRemove: (experienceId: string) => void;
  onSwap: (experienceId: string) => void;
  onAdd: (experience: Experience) => void;
  onChangeAccommodation: (partnerId: string) => void;
}

export default function PlanCard({ plan, highlighted, onRemove, onSwap, onAdd, onChangeAccommodation }: PlanCardProps) {
  const [addOpen, setAddOpen] = useState(false);
  const availableToAdd = listExperiences().filter((exp) => !plan.experiences.some((p) => p.id === exp.id));
  const accommodationOptions = listPartners().filter((p) => p.categories.includes('smestaj') && p.lifecycleStatus === 'published');

  return (
    <article
      className={`flex flex-col rounded-xl2 border bg-warm-white p-6 shadow-card ${
        highlighted ? 'border-gold ring-2 ring-gold/40' : 'border-ink/8'
      }`}
    >
      {highlighted && (
        <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
          <Check size={13} aria-hidden="true" /> Najbolji balans
        </span>
      )}

      <h3 className="font-serif text-2xl text-ink">{plan.title}</h3>
      <p className="mt-1.5 text-sm text-ink-soft">{plan.reason}</p>

      <div className="mt-4 flex items-baseline gap-2">
        <p className="font-serif text-3xl text-forest">{formatPrice(plan.totalPrice)}</p>
        <span className="text-sm text-ink-soft">ukupno</span>
      </div>
      <p className="text-sm text-ink-soft">{formatPrice(plan.pricePerPerson)} po osobi · {plan.nights} {plan.nights === 1 ? 'noćenje' : 'noćenja'}</p>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="inline-flex w-fit rounded-full bg-sage px-2.5 py-1 text-xs font-medium text-forest">
          {availabilityLabels[plan.availability]}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
          <Users2 size={13} aria-hidden="true" /> {involvedPartnerCount(plan)} partnera uključeno
        </span>
      </div>

      <div className="mt-5 rounded-xl2 bg-cream p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Smeštaj</p>
        <p className="mt-1 font-serif text-lg text-ink">{plan.accommodation.name}</p>
        <p className="text-sm text-ink-soft">{plan.accommodation.oneLiner}</p>
        <p className="mt-1.5 text-xs text-ink-soft">{plan.locationReason}</p>
        {accommodationOptions.length > 1 && (
          <label className="mt-2 block text-xs">
            <span className="mb-1 block font-medium text-ink-soft">Promeni smeštaj</span>
            <select
              value={plan.accommodation.id}
              onChange={(e) => onChangeAccommodation(e.target.value)}
              className="min-h-[36px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm text-ink"
            >
              {accommodationOptions.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Uključena iskustva</p>
        <ul className="mt-2 space-y-2">
          {plan.experiences.map((exp) => (
            <li key={exp.id} className="flex items-center justify-between gap-2 rounded-lg border border-ink/8 px-3 py-2">
              <span className="text-sm text-ink">{exp.name}</span>
              <span className="flex flex-none gap-1">
                <button
                  type="button"
                  onClick={() => onSwap(exp.id)}
                  aria-label={`Zameni ${exp.name}`}
                  title="Zameni iskustvo"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-sage hover:text-forest"
                >
                  <RefreshCw size={15} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(exp.id)}
                  aria-label={`Ukloni ${exp.name}`}
                  title="Ukloni iskustvo"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft hover:bg-terracotta/10 hover:text-terracotta"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              </span>
            </li>
          ))}
          {plan.experiences.length === 0 && (
            <li className="rounded-lg border border-dashed border-ink/15 px-3 py-3 text-sm text-ink-soft">
              Nema dodatih iskustava — dodajte bar jedno ispod.
            </li>
          )}
        </ul>

        {addOpen ? (
          <div className="mt-2 flex items-center gap-2">
            <select
              className="min-h-[40px] flex-1 rounded-lg border border-ink/15 bg-warm-white px-2 text-sm"
              onChange={(e) => {
                const exp = availableToAdd.find((item) => item.id === e.target.value);
                if (exp) onAdd(exp);
                setAddOpen(false);
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Izaberite iskustvo za dodavanje…
              </option>
              {availableToAdd.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  {exp.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              aria-label="Otkaži dodavanje"
              className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-ink-soft hover:bg-sage"
            >
              <Minus size={16} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="mt-2 inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-forest hover:underline"
          >
            <Plus size={16} aria-hidden="true" /> Dodaj iskustvo
          </button>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="font-semibold text-ink">Uključeno</p>
          <div className="mt-1"><InclusionList items={plan.included.slice(0, 3)} variant="included" /></div>
        </div>
        <div>
          <p className="font-semibold text-ink">Nije uključeno</p>
          <div className="mt-1"><InclusionList items={plan.excluded.slice(0, 3)} variant="excluded" /></div>
        </div>
      </div>
      {plan.pendingConfirmation.length > 0 && (
        <p className="mt-3 rounded-lg bg-gold/10 px-3 py-2 text-xs text-ink">
          {plan.pendingConfirmation.length} {plan.pendingConfirmation.length === 1 ? 'stavka čeka' : 'stavke čekaju'} proveru dostupnosti pre potvrde plana.
        </p>
      )}

      <Link
        to={`/plan/${plan.tier}`}
        className="mt-6 flex min-h-[44px] items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-warm-white hover:bg-forest/90"
      >
        Pogledaj kompletan plan
      </Link>
    </article>
  );
}
