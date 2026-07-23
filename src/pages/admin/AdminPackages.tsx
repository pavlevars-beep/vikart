import { useState } from 'react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { listPackages, savePackage } from '@/services/packagesStore';
import { listExperiences } from '@/services/experiencesStore';
import { listPartners } from '@/services/partnersStore';
import type { Package } from '@/types';

export default function AdminPackages() {
  useDocumentTitle('Admin — Paketi');
  const [packages, setPackages] = useState(() => listPackages());
  const experiences = listExperiences();
  const accommodations = listPartners().filter((p) => p.categories.includes('smestaj'));

  function update(id: string, patch: Partial<Package>) {
    setPackages((prev) => {
      const next = prev.map((pkg) => (pkg.id === id ? { ...pkg, ...patch } : pkg));
      const updated = next.find((p) => p.id === id);
      if (updated) savePackage(updated);
      return next;
    });
  }

  function toggleExperience(pkg: Package, expId: string) {
    const next = pkg.experienceIds.includes(expId) ? pkg.experienceIds.filter((id) => id !== expId) : [...pkg.experienceIds, expId];
    update(pkg.id, { experienceIds: next });
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Paketi</h1>
      <p className="mt-1.5 text-ink-soft">Polazni predlozi prikazani na /paketi i homepage-u.</p>

      <div className="mt-5 space-y-4">
        {packages.map((pkg) => (
          <details key={pkg.id} className="rounded-xl2 border border-ink/8 bg-warm-white p-4">
            <summary className="cursor-pointer select-none font-serif text-lg text-ink">{pkg.name}</summary>
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-ink">Naziv</span>
                  <input value={pkg.name} onChange={(e) => update(pkg.id, { name: e.target.value })} className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm" />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-ink">Cena od (broj)</span>
                  <input type="number" value={pkg.priceFromValue} onChange={(e) => update(pkg.id, { priceFromValue: Number(e.target.value) || 0 })} className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm" />
                </label>
                <label className="text-sm sm:col-span-2">
                  <span className="mb-1 block font-medium text-ink">Oznaka cene (tekst)</span>
                  <input value={pkg.priceFromLabel} onChange={(e) => update(pkg.id, { priceFromLabel: e.target.value })} className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm" />
                </label>
                <label className="text-sm sm:col-span-2">
                  <span className="mb-1 block font-medium text-ink">Kratak opis</span>
                  <textarea value={pkg.shortDescription} onChange={(e) => update(pkg.id, { shortDescription: e.target.value })} rows={2} className="w-full rounded-lg border border-ink/15 bg-warm-white p-2 text-sm" />
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-ink">Smeštaj</span>
                  <select value={pkg.accommodationId} onChange={(e) => update(pkg.id, { accommodationId: e.target.value })} className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm">
                    {accommodations.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="mb-1 block font-medium text-ink">Broj noćenja</span>
                  <input type="number" value={pkg.nights} onChange={(e) => update(pkg.id, { nights: Number(e.target.value) || 1 })} className="min-h-[38px] w-full rounded-lg border border-ink/15 bg-warm-white px-2 text-sm" />
                </label>
              </div>

              <div>
                <span className="mb-1.5 block text-sm font-medium text-ink">Uključena iskustva</span>
                <div className="flex flex-wrap gap-2">
                  {experiences.map((exp) => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => toggleExperience(pkg, exp.id)}
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${pkg.experienceIds.includes(exp.id) ? 'border-forest bg-sage text-forest' : 'border-ink/15 text-ink-soft'}`}
                    >
                      {exp.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
