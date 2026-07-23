import { useState } from 'react';
import { Copy, ChevronDown, ChevronUp } from 'lucide-react';
import type {
  PartnerOffer,
  OfferStatus,
  PartnerOfferStatus,
  PricingUnit,
  Currency,
  DietaryOption,
  IntensityLevel,
  OccasionKey,
  BudgetKey,
  AccommodationLocationTag,
} from '@/types';
import { listPackages } from '@/services/packagesStore';
import { offerStatusLabels, dietaryOptionLabels, occasionLabels, budgetLabels, intensityLabels } from '@/utils/labels';
import StringListEditor from './StringListEditor';
import RowListEditor from './RowListEditor';
import ConfirmButton from './ConfirmButton';
import StatusPill from './StatusPill';
import { partnerOfferStatusLabels, partnerOfferStatusTone } from '@/utils/adminLabels';

const pricingUnitLabels: Record<PricingUnit, string> = {
  fiksna: 'Fiksna cena',
  po_osobi: 'Po osobi',
  po_detetu: 'Po detetu',
  po_paru: 'Po paru',
  po_sobi: 'Po sobi / smeštajnoj jedinici',
  po_nocenju: 'Po noćenju',
  po_vozilu: 'Po vozilu',
  po_grupi: 'Po grupi',
  po_satu: 'Po satu',
  po_terminu: 'Po terminu',
  kombinovano: 'Kombinovano (fiksno + po osobi)',
  na_upit: 'Cena na upit',
};

const locationTagLabels: Record<AccommodationLocationTag, string> = {
  central: 'Centar',
  near_center: 'Blizu centra',
  quiet_area: 'Mirniji kraj',
  nature: 'Priroda',
  remote: 'Izdvojeno',
};

function Field({ label, value, onChange, type = 'text', className = '' }: { label: string; value: string; onChange: (v: string) => void; type?: string; className?: string }) {
  return (
    <label className={`text-sm ${className}`}>
      <span className="mb-1 block font-medium text-ink">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2.5 text-sm text-ink" />
    </label>
  );
}

function NumberField({ label, value, onChange, className = '' }: { label: string; value: number | undefined; onChange: (v: number | undefined) => void; className?: string }) {
  return (
    <label className={`text-sm ${className}`}>
      <span className="mb-1 block font-medium text-ink">{label}</span>
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
        className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2.5 text-sm text-ink"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-ink">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full rounded-lg border border-ink/15 bg-warm-white p-2.5 text-sm text-ink" />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-ink/30" />
      {label}
    </label>
  );
}

interface AdminOfferEditorProps {
  offer: PartnerOffer;
  onChange: (patch: Partial<PartnerOffer>) => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

const SECTIONS = ['Osnovno', 'Cena', 'Detalji iskustva', 'Uključeno / isključeno', 'Hrana i piće', 'Bezbednost i otkazivanje', 'Plasman', 'Komercijalno (interno)'] as const;

export default function AdminOfferEditor({ offer, onChange, onDuplicate, onArchive, onDelete }: AdminOfferEditorProps) {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<(typeof SECTIONS)[number]>('Osnovno');
  const pricing = offer.pricingModel;
  const packages = listPackages();

  function updatePricing(patch: Partial<typeof pricing>) {
    onChange({ pricingModel: { ...pricing, ...patch } });
  }

  function updatePlacement(patch: Partial<typeof offer.placement>) {
    onChange({ placement: { ...offer.placement, ...patch } });
  }

  function updateSchedule(patch: Partial<typeof offer.schedule>) {
    onChange({ schedule: { ...offer.schedule, ...patch } });
  }

  function updateSafety(patch: Partial<typeof offer.safety>) {
    onChange({ safety: { ...offer.safety, ...patch } });
  }

  function updateCancellation(patch: Partial<typeof offer.cancellation>) {
    onChange({ cancellation: { ...offer.cancellation, ...patch } });
  }

  function updateSubstitution(patch: Partial<typeof offer.substitution>) {
    onChange({ substitution: { ...offer.substitution, ...patch } });
  }

  function updateCommercial(patch: Partial<NonNullable<typeof offer.commercial>>) {
    onChange({ commercial: { ...(offer.commercial ?? {}), ...patch } });
  }

  function toggleArrayValue<T>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }

  return (
    <div className="rounded-xl2 border border-ink/8 bg-warm-white">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <div className="flex items-center gap-2.5">
          <span className="font-serif text-lg text-ink">{offer.name || 'Nova ponuda'}</span>
          <StatusPill label={partnerOfferStatusLabels[offer.lifecycleStatus]} tone={partnerOfferStatusTone[offer.lifecycleStatus]} />
        </div>
        {open ? <ChevronUp size={18} className="text-ink-soft" aria-hidden="true" /> : <ChevronDown size={18} className="text-ink-soft" aria-hidden="true" />}
      </button>

      {open && (
        <div className="border-t border-ink/8 p-4">
          <div className="flex flex-wrap gap-1.5 border-b border-ink/8 pb-3">
            {SECTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSection(s)}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${section === s ? 'bg-sage text-forest' : 'text-ink-soft hover:bg-cream'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-4">
            {section === 'Osnovno' && (
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Naziv ponude" value={offer.name} onChange={(v) => onChange({ name: v })} className="sm:col-span-2" />
                <Field label="Kratak opis" value={offer.shortDescription} onChange={(v) => onChange({ shortDescription: v })} className="sm:col-span-2" />
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-ink">Status ponude (gostujući)</span>
                  <select value={offer.status} onChange={(e) => onChange({ status: e.target.value as OfferStatus })} className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm">
                    {(Object.keys(offerStatusLabels) as OfferStatus[]).map((s) => (
                      <option key={s} value={s}>{offerStatusLabels[s]}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-ink">CRM status ponude</span>
                  <select value={offer.lifecycleStatus} onChange={(e) => onChange({ lifecycleStatus: e.target.value as PartnerOfferStatus })} className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm">
                    {(Object.keys(partnerOfferStatusLabels) as PartnerOfferStatus[]).map((s) => (
                      <option key={s} value={s}>{partnerOfferStatusLabels[s]}</option>
                    ))}
                  </select>
                </label>
                <Field label="Vezano Experience ID (opciono)" value={offer.experienceId ?? ''} onChange={(v) => onChange({ experienceId: v || undefined })} className="sm:col-span-2" />
                <TextArea label="Narativ toka iskustva" value={offer.narrative} onChange={(v) => onChange({ narrative: v })} />
                <div className="sm:col-span-2 flex flex-wrap gap-2 border-t border-ink/8 pt-3">
                  <button type="button" onClick={onDuplicate} className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink hover:bg-cream">
                    <Copy size={13} aria-hidden="true" /> Kopiraj ponudu
                  </button>
                  <ConfirmButton label="Arhiviraj" confirmLabel="Da, arhiviraj" onConfirm={onArchive} />
                  <ConfirmButton label="Obriši" confirmLabel="Da, obriši" onConfirm={onDelete} tone="danger" />
                </div>
              </div>
            )}

            {section === 'Cena' && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="text-sm">
                    <span className="mb-1 block font-medium text-ink">Model cene</span>
                    <select value={pricing.unit} onChange={(e) => updatePricing({ unit: e.target.value as PricingUnit })} className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm">
                      {(Object.keys(pricingUnitLabels) as PricingUnit[]).map((u) => (
                        <option key={u} value={u}>{pricingUnitLabels[u]}</option>
                      ))}
                    </select>
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block font-medium text-ink">Valuta</span>
                    <select value={pricing.currency} onChange={(e) => updatePricing({ currency: e.target.value as Currency })} className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm">
                      <option value="RSD">RSD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </label>
                  <NumberField label="Osnovna cena" value={pricing.basePrice} onChange={(v) => updatePricing({ basePrice: v ?? 0 })} />
                  <NumberField label="Kapacitet po jedinici (npr. osoba/vozilo)" value={pricing.capacityPerUnit} onChange={(v) => updatePricing({ capacityPerUnit: v })} />
                  <NumberField label="Minimalna naplativa količina" value={pricing.minBillableUnits} onChange={(v) => updatePricing({ minBillableUnits: v })} />
                  <NumberField label="Maksimalan kapacitet" value={pricing.maxCapacity} onChange={(v) => updatePricing({ maxCapacity: v })} />
                  <NumberField label="Doplata za dodatnu osobu" value={pricing.extraPersonSurcharge} onChange={(v) => updatePricing({ extraPersonSurcharge: v })} />
                  <NumberField label="Min. broj vozila" value={pricing.minVehicles} onChange={(v) => updatePricing({ minVehicles: v })} />
                  <NumberField label="Max. broj vozila" value={pricing.maxVehicles} onChange={(v) => updatePricing({ maxVehicles: v })} />
                  <NumberField label="Fiksni deo (kombinovana cena)" value={pricing.combinedFixedPart} onChange={(v) => updatePricing({ combinedFixedPart: v })} />
                  <NumberField label="Doplata za privatnu turu" value={pricing.privateTourSurcharge} onChange={(v) => updatePricing({ privateTourSurcharge: v })} />
                  <NumberField label="Promotivna cena" value={pricing.promoPrice} onChange={(v) => updatePricing({ promoPrice: v })} />
                  <Field label="Važi od" value={pricing.validFrom ?? ''} onChange={(v) => updatePricing({ validFrom: v || undefined })} type="date" />
                  <Field label="Važi do" value={pricing.validTo ?? ''} onChange={(v) => updatePricing({ validTo: v || undefined })} type="date" />
                </div>

                <RowListEditor
                  label="Tiered cene (po broju osoba/jedinica)"
                  items={pricing.tiers ?? []}
                  onChange={(next) => updatePricing({ tiers: next })}
                  makeEmpty={() => ({ id: `tier-${Date.now()}`, minUnits: 1, maxUnits: null, pricePerUnit: 0, label: '' })}
                  renderRow={(tier, update) => (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <NumberField label="Od" value={tier.minUnits} onChange={(v) => update({ minUnits: v ?? 1 })} />
                      <NumberField label="Do (prazno = bez limita)" value={tier.maxUnits ?? undefined} onChange={(v) => update({ maxUnits: v ?? null })} />
                      <NumberField label="Cena po jedinici" value={tier.pricePerUnit} onChange={(v) => update({ pricePerUnit: v ?? 0 })} />
                      <Field label="Oznaka" value={tier.label ?? ''} onChange={(v) => update({ label: v })} />
                    </div>
                  )}
                />

                <RowListEditor
                  label="Sezonske cene"
                  items={pricing.seasonalPrices ?? []}
                  onChange={(next) => updatePricing({ seasonalPrices: next })}
                  makeEmpty={() => ({ id: `season-${Date.now()}`, label: '', startDate: '', endDate: '', priceOverride: 0, appliesTo: 'sve-dane' as const })}
                  renderRow={(s, update) => (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                      <Field label="Oznaka" value={s.label} onChange={(v) => update({ label: v })} />
                      <Field label="Od" value={s.startDate} onChange={(v) => update({ startDate: v })} type="date" />
                      <Field label="Do" value={s.endDate} onChange={(v) => update({ endDate: v })} type="date" />
                      <NumberField label="Cena" value={s.priceOverride} onChange={(v) => update({ priceOverride: v ?? 0 })} />
                      <label className="text-sm">
                        <span className="mb-1 block font-medium text-ink">Period</span>
                        <select value={s.appliesTo} onChange={(e) => update({ appliesTo: e.target.value as typeof s.appliesTo })} className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm">
                          <option value="sve-dane">Sve dane</option>
                          <option value="radni-dan">Radni dan</option>
                          <option value="vikend">Vikend</option>
                          <option value="praznik">Praznik</option>
                        </select>
                      </label>
                    </div>
                  )}
                />

                <RowListEditor
                  label="Grupni popusti"
                  items={pricing.groupDiscounts ?? []}
                  onChange={(next) => updatePricing({ groupDiscounts: next })}
                  makeEmpty={() => ({ id: `discount-${Date.now()}`, minGroupSize: 6, discountType: 'procenat' as const, discountValue: 5, label: '' })}
                  renderRow={(d, update) => (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      <NumberField label="Min. grupa" value={d.minGroupSize} onChange={(v) => update({ minGroupSize: v ?? 1 })} />
                      <label className="text-sm">
                        <span className="mb-1 block font-medium text-ink">Tip</span>
                        <select value={d.discountType} onChange={(e) => update({ discountType: e.target.value as typeof d.discountType })} className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm">
                          <option value="procenat">Procenat</option>
                          <option value="fiksno">Fiksan iznos</option>
                        </select>
                      </label>
                      <NumberField label="Vrednost" value={d.discountValue} onChange={(v) => update({ discountValue: v ?? 0 })} />
                      <Field label="Oznaka" value={d.label} onChange={(v) => update({ label: v })} />
                    </div>
                  )}
                />

                <RowListEditor
                  label="Dodaci (add-on) sa cenom"
                  items={pricing.addOns ?? []}
                  onChange={(next) => updatePricing({ addOns: next })}
                  makeEmpty={() => ({ id: `addon-${Date.now()}`, name: '', priceValue: 0, unit: 'fiksna' as PricingUnit })}
                  renderRow={(a, update) => (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      <Field label="Naziv" value={a.name} onChange={(v) => update({ name: v })} />
                      <NumberField label="Cena" value={a.priceValue} onChange={(v) => update({ priceValue: v ?? 0 })} />
                      <label className="text-sm">
                        <span className="mb-1 block font-medium text-ink">Jedinica</span>
                        <select value={a.unit} onChange={(e) => update({ unit: e.target.value as PricingUnit })} className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm">
                          {(Object.keys(pricingUnitLabels) as PricingUnit[]).map((u) => (
                            <option key={u} value={u}>{pricingUnitLabels[u]}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}
                />

                <div className="rounded-lg border border-terracotta/20 bg-terracotta/5 p-3">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-terracotta">Interno — nikad javno</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <NumberField label="Nabavna cena za VikArt" value={pricing.costPrice} onChange={(v) => updatePricing({ costPrice: v })} />
                    <Field label="Napomena o marži" value={pricing.marginNote ?? ''} onChange={(v) => updatePricing({ marginNote: v })} />
                  </div>
                </div>
              </div>
            )}

            {section === 'Detalji iskustva' && (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Mesto okupljanja" value={offer.schedule.meetingPoint} onChange={(v) => updateSchedule({ meetingPoint: v })} />
                  <Field label="Vreme dolaska" value={offer.schedule.meetingTime} onChange={(v) => updateSchedule({ meetingTime: v })} />
                  <NumberField label="Koliko ranije gost dolazi (min)" value={offer.schedule.arrivalBufferMinutes} onChange={(v) => updateSchedule({ arrivalBufferMinutes: v ?? 0 })} />
                  <Field label="Trajanje" value={offer.schedule.durationLabel} onChange={(v) => updateSchedule({ durationLabel: v })} />
                  <Field label="Preporučena odeća/obuća" value={offer.schedule.dressCode ?? ''} onChange={(v) => updateSchedule({ dressCode: v || undefined })} className="sm:col-span-2" />
                  <label className="text-sm">
                    <span className="mb-1 block font-medium text-ink">Nivo fizičke zahtevnosti</span>
                    <select value={offer.intensity} onChange={(e) => onChange({ intensity: e.target.value as IntensityLevel })} className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm">
                      {(Object.keys(intensityLabels) as IntensityLevel[]).map((i) => (
                        <option key={i} value={i}>{intensityLabels[i]}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <StringListEditor label="Tok iskustva (korak po korak)" values={offer.schedule.sequence} onChange={(v) => updateSchedule({ sequence: v })} />
                <StringListEditor label="Šta gost treba da ponese" values={offer.schedule.whatToBring} onChange={(v) => updateSchedule({ whatToBring: v })} />
              </div>
            )}

            {section === 'Uključeno / isključeno' && (
              <div className="space-y-4">
                <RowListEditor
                  label="Uključeno u cenu"
                  items={offer.inclusions}
                  onChange={(next) => onChange({ inclusions: next })}
                  makeEmpty={() => ({ label: '', detail: '' })}
                  renderRow={(item, update) => (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Field label="Stavka" value={item.label} onChange={(v) => update({ label: v })} />
                      <Field label="Detalj (opciono)" value={item.detail ?? ''} onChange={(v) => update({ detail: v })} />
                    </div>
                  )}
                />
                <RowListEditor
                  label="Nije uključeno"
                  items={offer.exclusions}
                  onChange={(next) => onChange({ exclusions: next })}
                  makeEmpty={() => ({ label: '', detail: '' })}
                  renderRow={(item, update) => (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Field label="Stavka" value={item.label} onChange={(v) => update({ label: v })} />
                      <Field label="Detalj (opciono)" value={item.detail ?? ''} onChange={(v) => update({ detail: v })} />
                    </div>
                  )}
                />
                <RowListEditor
                  label="Dostupno uz doplatu"
                  items={offer.addOns}
                  onChange={(next) => onChange({ addOns: next })}
                  makeEmpty={() => ({ name: '', priceLabel: '' })}
                  renderRow={(item, update) => (
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Field label="Naziv" value={item.name} onChange={(v) => update({ name: v })} />
                      <Field label="Cena (tekst)" value={item.priceLabel} onChange={(v) => update({ priceLabel: v })} />
                    </div>
                  )}
                />
              </div>
            )}

            {section === 'Hrana i piće' && (
              <div className="space-y-3">
                <Toggle label="Ova ponuda uključuje hranu ili piće" checked={Boolean(offer.food)} onChange={(v) => onChange({ food: v ? { mealType: '', courseCount: 1, drinkCount: 0, dishChoices: [], portionNotes: '', dietary: [], allergyReportingDeadline: '', exclusions: [] } : undefined })} />
                {offer.food && (
                  <div className="space-y-3 rounded-lg border border-ink/10 p-3">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="Tip obroka" value={offer.food.mealType} onChange={(v) => onChange({ food: { ...offer.food!, mealType: v } })} />
                      <NumberField label="Broj sledovanja" value={offer.food.courseCount} onChange={(v) => onChange({ food: { ...offer.food!, courseCount: v ?? 1 } })} />
                      <NumberField label="Broj uključenih pića" value={offer.food.drinkCount} onChange={(v) => onChange({ food: { ...offer.food!, drinkCount: v ?? 0 } })} />
                    </div>
                    <StringListEditor label="Izbor jela" values={offer.food.dishChoices} onChange={(v) => onChange({ food: { ...offer.food!, dishChoices: v } })} />
                    <Field label="Napomena o veličini porcije" value={offer.food.portionNotes} onChange={(v) => onChange({ food: { ...offer.food!, portionNotes: v } })} />
                    <div>
                      <span className="mb-1.5 block text-sm font-medium text-ink">Dijetarne opcije</span>
                      <div className="flex flex-wrap gap-2">
                        {(Object.keys(dietaryOptionLabels) as DietaryOption[]).map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => onChange({ food: { ...offer.food!, dietary: toggleArrayValue(offer.food!.dietary, d) } })}
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${offer.food!.dietary.includes(d) ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'}`}
                          >
                            {dietaryOptionLabels[d]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Field label="Rok za prijavu posebne ishrane" value={offer.food.allergyReportingDeadline} onChange={(v) => onChange({ food: { ...offer.food!, allergyReportingDeadline: v } })} />
                    <StringListEditor label="Šta nije uključeno (hrana/piće)" values={offer.food.exclusions} onChange={(v) => onChange({ food: { ...offer.food!, exclusions: v } })} />
                  </div>
                )}
              </div>
            )}

            {section === 'Bezbednost i otkazivanje' && (
              <div className="space-y-4">
                <StringListEditor label="Ograničenja (uzrast, zdravlje...)" values={offer.safety.restrictions} onChange={(v) => updateSafety({ restrictions: v })} />
                <StringListEditor label="Bezbednosna pravila" values={offer.safety.safetyRules} onChange={(v) => updateSafety({ safetyRules: v })} />
                <TextArea label="Postupak u slučaju lošeg vremena" value={offer.safety.badWeatherProcedure} onChange={(v) => updateSafety({ badWeatherProcedure: v })} />
                <Field label="Kontakt za dan realizacije" value={offer.safety.dayOfContact} onChange={(v) => updateSafety({ dayOfContact: v })} />

                <div className="grid gap-3 sm:grid-cols-2 border-t border-ink/8 pt-3">
                  <Field label="Besplatno otkazivanje do" value={offer.cancellation.freeUntilLabel} onChange={(v) => updateCancellation({ freeUntilLabel: v })} className="sm:col-span-2" />
                  <Field label="Politika kasnog otkazivanja" value={offer.cancellation.latePolicy} onChange={(v) => updateCancellation({ latePolicy: v })} className="sm:col-span-2" />
                  <Field label="No-show pravilo" value={offer.cancellation.noShowPolicy} onChange={(v) => updateCancellation({ noShowPolicy: v })} className="sm:col-span-2" />
                </div>

                <div className="grid gap-3 sm:grid-cols-2 border-t border-ink/8 pt-3">
                  <Field label="Rezervni partner (ID, opciono)" value={offer.substitution.backupPartnerId ?? ''} onChange={(v) => updateSubstitution({ backupPartnerId: v || undefined })} className="sm:col-span-2" />
                  <Field label="Dozvoljene zamene" value={offer.substitution.allowedSubstitutions} onChange={(v) => updateSubstitution({ allowedSubstitutions: v })} className="sm:col-span-2" />
                  <Field label="Uslovi zamene" value={offer.substitution.conditions} onChange={(v) => updateSubstitution({ conditions: v })} className="sm:col-span-2" />
                  <Field label="Uticaj zamene na cenu" value={offer.substitution.priceImpact} onChange={(v) => updateSubstitution({ priceImpact: v })} />
                  <Toggle label="Zamena zahteva saglasnost gosta" checked={offer.substitution.consentRequired} onChange={(v) => updateSubstitution({ consentRequired: v })} />
                </div>
              </div>
            )}

            {section === 'Plasman' && (
              <div className="space-y-4">
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-ink">Pojavljuje se u paketima</span>
                  <div className="flex flex-wrap gap-2">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        type="button"
                        onClick={() => updatePlacement({ packageIds: toggleArrayValue(offer.placement.packageIds, pkg.id) })}
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${offer.placement.packageIds.includes(pkg.id) ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'}`}
                      >
                        {pkg.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-1.5 block text-sm font-medium text-ink">Tip putovanja / povod</span>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(occasionLabels) as OccasionKey[]).map((o) => (
                      <button key={o} type="button" onClick={() => updatePlacement({ occasions: toggleArrayValue(offer.placement.occasions, o) })} className={`rounded-full border px-2.5 py-1 text-xs font-medium ${offer.placement.occasions.includes(o) ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'}`}>
                        {occasionLabels[o]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <NumberField label="Minimalan broj gostiju" value={offer.placement.groupSizeMin} onChange={(v) => updatePlacement({ groupSizeMin: v })} />
                  <NumberField label="Maksimalan broj gostiju" value={offer.placement.groupSizeMax} onChange={(v) => updatePlacement({ groupSizeMax: v })} />
                  <NumberField label="Prioritet prikaza" value={offer.placement.priority} onChange={(v) => updatePlacement({ priority: v ?? 0 })} />
                </div>

                <div>
                  <span className="mb-1.5 block text-sm font-medium text-ink">Budžetske grupe</span>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(budgetLabels) as BudgetKey[]).map((b) => (
                      <button key={b} type="button" onClick={() => updatePlacement({ budgetKeys: toggleArrayValue(offer.placement.budgetKeys, b) })} className={`rounded-full border px-2.5 py-1 text-xs font-medium ${offer.placement.budgetKeys.includes(b) ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'}`}>
                        {budgetLabels[b]}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="mb-1.5 block text-sm font-medium text-ink">Lokacijska preferencija</span>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(locationTagLabels) as AccommodationLocationTag[]).map((tag) => (
                      <button key={tag} type="button" onClick={() => updatePlacement({ locationPreferences: toggleArrayValue(offer.placement.locationPreferences, tag) })} className={`rounded-full border px-2.5 py-1 text-xs font-medium ${offer.placement.locationPreferences.includes(tag) ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'}`}>
                        {locationTagLabels[tag]}
                      </button>
                    ))}
                  </div>
                </div>

                <StringListEditor label="Sezone (slobodan tekst)" values={offer.placement.seasons} onChange={(v) => updatePlacement({ seasons: v })} />

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <Toggle label="Romantični vikend" checked={offer.placement.suitableForRomanticWeekend} onChange={(v) => updatePlacement({ suitableForRomanticWeekend: v })} />
                  <Toggle label="Porodica" checked={offer.placement.suitableForFamily} onChange={(v) => updatePlacement({ suitableForFamily: v })} />
                  <Toggle label="Manje društvo" checked={offer.placement.suitableForSmallGroup} onChange={(v) => updatePlacement({ suitableForSmallGroup: v })} />
                  <Toggle label="Veća grupa" checked={offer.placement.suitableForLargeGroup} onChange={(v) => updatePlacement({ suitableForLargeGroup: v })} />
                  <Toggle label="Team building" checked={offer.placement.suitableForTeamBuilding} onChange={(v) => updatePlacement({ suitableForTeamBuilding: v })} />
                  <Toggle label="Primarna opcija" checked={offer.placement.isPrimary} onChange={(v) => updatePlacement({ isPrimary: v })} />
                  <Toggle label="Rezervna opcija" checked={offer.placement.isBackup} onChange={(v) => updatePlacement({ isBackup: v })} />
                </div>
              </div>
            )}

            {section === 'Komercijalno (interno)' && (
              <div className="rounded-lg border border-terracotta/20 bg-terracotta/5 p-3">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-terracotta">Interno — nikad vidljivo gostu niti u javnom prikazu</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Način rezervisanja kod partnera" value={offer.commercial?.reservationMethod ?? ''} onChange={(v) => updateCommercial({ reservationMethod: v })} />
                  <Field label="Rok provere raspoloživosti" value={offer.commercial?.availabilityCheckLeadTime ?? ''} onChange={(v) => updateCommercial({ availabilityCheckLeadTime: v })} />
                  <Field label="Rok odgovora partnera" value={offer.commercial?.partnerResponseTime ?? ''} onChange={(v) => updateCommercial({ partnerResponseTime: v })} />
                  <Field label="Prepoznavanje VikArt rezervacije" value={offer.commercial?.vikartBookingRecognition ?? ''} onChange={(v) => updateCommercial({ vikartBookingRecognition: v })} />
                  <Field label="Podaci o gostu koje partner dobija" value={offer.commercial?.guestDataSharedWithPartner ?? ''} onChange={(v) => updateCommercial({ guestDataSharedWithPartner: v })} />
                  <Field label="Šta partner priprema" value={offer.commercial?.partnerPreparation ?? ''} onChange={(v) => updateCommercial({ partnerPreparation: v })} />
                  <Field label="Način potvrde realizacije" value={offer.commercial?.fulfillmentConfirmationMethod ?? ''} onChange={(v) => updateCommercial({ fulfillmentConfirmationMethod: v })} />
                  <Field label="Rok i način isplate partneru" value={offer.commercial?.payoutTerms ?? ''} onChange={(v) => updateCommercial({ payoutTerms: v })} />
                  <Field label="Otkazivanje od strane partnera" value={offer.commercial?.partnerCancellationPolicy ?? ''} onChange={(v) => updateCommercial({ partnerCancellationPolicy: v })} />
                  <Field label="No-show pravila (partner)" value={offer.commercial?.noShowPolicy ?? ''} onChange={(v) => updateCommercial({ noShowPolicy: v })} />
                  <Field label="Poreski tretman" value={offer.commercial?.taxTreatment ?? ''} onChange={(v) => updateCommercial({ taxTreatment: v })} />
                </div>
                <TextArea label="Interna napomena" value={offer.commercial?.internalNote ?? ''} onChange={(v) => updateCommercial({ internalNote: v })} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
