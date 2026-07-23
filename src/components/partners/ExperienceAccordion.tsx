import { MapPin, Clock, ShieldAlert, CloudRain, Phone, Ban } from 'lucide-react';
import type { PartnerOffer } from '@/types';
import { dietaryOptionLabels, PARTNER_AVAILABILITY_DISCLAIMER } from '@/utils/labels';

export default function ExperienceAccordion({ offer }: { offer: PartnerOffer }) {
  return (
    <details className="group rounded-xl2 border border-ink/8 bg-warm-white">
      <summary className="cursor-pointer select-none list-none px-4 py-3 text-sm font-semibold text-forest marker:content-none">
        Detalji iskustva
      </summary>
      <div className="space-y-5 border-t border-ink/8 px-4 py-4 text-sm text-ink-soft">
        <p>{offer.narrative}</p>

        <div>
          <p className="mb-1.5 inline-flex items-center gap-1.5 font-semibold text-ink">
            <MapPin size={15} aria-hidden="true" /> Mesto i vreme okupljanja
          </p>
          <p>
            {offer.schedule.meetingPoint} — dolazak {offer.schedule.arrivalBufferMinutes > 0 ? `${offer.schedule.arrivalBufferMinutes} min pre termina` : 'tačno na vreme termina'} ({offer.schedule.meetingTime}).
          </p>
        </div>

        <div>
          <p className="mb-1.5 inline-flex items-center gap-1.5 font-semibold text-ink">
            <Clock size={15} aria-hidden="true" /> Trajanje i tok
          </p>
          <p className="mb-1.5">Trajanje: {offer.schedule.durationLabel}</p>
          <ol className="list-inside list-decimal space-y-0.5">
            {offer.schedule.sequence.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        {(offer.schedule.whatToBring.length > 0 || offer.schedule.dressCode) && (
          <div>
            <p className="mb-1.5 font-semibold text-ink">Šta poneti</p>
            <ul className="list-inside list-disc space-y-0.5">
              {offer.schedule.whatToBring.map((item) => (
                <li key={item}>{item}</li>
              ))}
              {offer.schedule.dressCode && <li>{offer.schedule.dressCode}</li>}
            </ul>
          </div>
        )}

        {offer.food && (
          <div>
            <p className="mb-1.5 font-semibold text-ink">Hrana i piće</p>
            <ul className="list-inside list-disc space-y-0.5">
              <li>{offer.food.mealType}: {offer.food.courseCount} {offer.food.courseCount === 1 ? 'sledovanje' : 'sledovanja'}, {offer.food.drinkCount} {offer.food.drinkCount === 1 ? 'piće uključeno' : 'pića uključena'} po osobi</li>
              <li>Izbor jela: {offer.food.dishChoices.join(', ')}</li>
              {offer.food.portionNotes && <li>{offer.food.portionNotes}</li>}
              {offer.food.dietary.length > 0 && (
                <li>Dostupne opcije: {offer.food.dietary.map((d) => dietaryOptionLabels[d]).join(', ')}</li>
              )}
              <li>Alergije i netolerancije prijaviti najkasnije: {offer.food.allergyReportingDeadline}</li>
              {offer.food.exclusions.map((ex) => (
                <li key={ex}>Nije uključeno: {ex}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="mb-1.5 inline-flex items-center gap-1.5 font-semibold text-ink">
            <ShieldAlert size={15} aria-hidden="true" /> Bezbednost i ograničenja
          </p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>Intenzitet: {offer.intensity}</li>
            {offer.safety.restrictions.map((r) => (
              <li key={r}>{r}</li>
            ))}
            {offer.safety.safetyRules.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-1.5 inline-flex items-center gap-1.5 font-semibold text-ink">
            <CloudRain size={15} aria-hidden="true" /> Ako vreme ne bude pogodno
          </p>
          <p>{offer.safety.badWeatherProcedure}</p>
        </div>

        <div>
          <p className="mb-1.5 inline-flex items-center gap-1.5 font-semibold text-ink">
            <Phone size={15} aria-hidden="true" /> Kontakt na dan realizacije
          </p>
          <p>{offer.safety.dayOfContact}</p>
        </div>

        <div>
          <p className="mb-1.5 inline-flex items-center gap-1.5 font-semibold text-ink">
            <Ban size={15} aria-hidden="true" /> Otkazivanje
          </p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>{offer.cancellation.freeUntilLabel}</li>
            <li>{offer.cancellation.latePolicy}</li>
            <li>{offer.cancellation.noShowPolicy}</li>
          </ul>
        </div>

        <div className="rounded-lg bg-cream p-3 text-xs text-ink-soft">
          <p className="mb-1 font-semibold text-ink">Ako partner nije dostupan</p>
          <p>{PARTNER_AVAILABILITY_DISCLAIMER}</p>
          <p className="mt-1">{offer.substitution.allowedSubstitutions} {offer.substitution.conditions}</p>
        </div>
      </div>
    </details>
  );
}
