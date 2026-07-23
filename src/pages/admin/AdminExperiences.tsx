import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { listExperiences, saveExperience } from '@/services/experiencesStore';
import { getPartnerById } from '@/services/partnersStore';
import type { AvailabilityLevel } from '@/types';
import { availabilityLabels, categoryLabels } from '@/utils/labels';

export default function AdminExperiences() {
  useDocumentTitle('Admin — Iskustva');
  const [experiences, setExperiences] = useState(() => listExperiences());

  function update(id: string, patch: Partial<(typeof experiences)[number]>) {
    setExperiences((prev) => {
      const next = prev.map((exp) => (exp.id === id ? { ...exp, ...patch } : exp));
      const updated = next.find((e) => e.id === id);
      if (updated) saveExperience(updated);
      return next;
    });
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Iskustva</h1>
      <p className="mt-1.5 text-ink-soft">
        Katalog iskustava koje konfigurator i paketi biraju. Detaljna ponuda (cena, uključeno, raspored) uređuje se kroz partnera.
      </p>

      <div className="mt-4 overflow-x-auto rounded-xl2 border border-ink/8 bg-warm-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-ink/8 text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Naziv</th>
              <th className="px-4 py-3">Kategorija</th>
              <th className="px-4 py-3">Partner</th>
              <th className="px-4 py-3">Dostupnost</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => {
              const partner = getPartnerById(exp.partnerId);
              return (
                <tr key={exp.id} className="border-b border-ink/6 last:border-0 hover:bg-cream/60">
                  <td className="px-4 py-3">
                    <input
                      value={exp.name}
                      onChange={(e) => update(exp.id, { name: e.target.value })}
                      className="min-h-[36px] w-full min-w-[220px] rounded-lg border border-ink/15 bg-warm-white px-2 text-sm text-ink"
                    />
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{categoryLabels[exp.category]}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {partner ? <Link to={`/admin/partneri/${partner.id}`} className="hover:text-forest">{partner.name}</Link> : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={exp.availability}
                      onChange={(e) => update(exp.id, { availability: e.target.value as AvailabilityLevel })}
                      className="min-h-[36px] rounded-lg border border-ink/15 bg-warm-white px-2 text-sm"
                    >
                      {(Object.keys(availabilityLabels) as AvailabilityLevel[]).map((a) => (
                        <option key={a} value={a}>{availabilityLabels[a]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
