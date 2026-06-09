'use client';

import { Incident, IncidentCategory } from '@/types';

interface Props {
  incidents: Incident[];
}

const CATEGORIES: Array<{ key: IncidentCategory; label: string; color: string }> = [
  { key: 'TERROR',    label: 'Bzbdnost', color: '#dc2626' },
  { key: 'PROTEST',   label: 'Protest',  color: '#f59e0b' },
  { key: 'FIRE',      label: 'Požar',    color: '#ef4444' },
  { key: 'MILITARY',  label: 'Vojska',   color: '#f97316' },
  { key: 'DISASTER',  label: 'Katast.',  color: '#a78bfa' },
  { key: 'CYBER',     label: 'Sajber',   color: '#3b82f6' },
  { key: 'CRIME',     label: 'Kriminal', color: '#ec4899' },
  { key: 'POLITICAL', label: 'Politika', color: '#8b5cf6' },
];

export default function CategoryStats({ incidents }: Props) {
  const counts = incidents.reduce<Record<string, number>>((acc, inc) => {
    acc[inc.category] = (acc[inc.category] || 0) + 1;
    return acc;
  }, {});

  const total = incidents.length;

  return (
    <div
      className="rounded-lg p-3"
      style={{ background: '#0d1117', border: '1px solid #1a2235' }}
    >
      <div
        className="flex items-center gap-2 mb-3"
        style={{ borderBottom: '1px solid #1a2235', paddingBottom: 8 }}
      >
        <span style={{ color: '#475569', fontSize: '9px', letterSpacing: '0.2em' }}>
          INCIDENTI PO KATEGORIJAMA (24h)
        </span>
        <span
          className="rounded px-1.5 py-0.5"
          style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontSize: '9px', fontWeight: 700 }}
        >
          {total}
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {CATEGORIES.map(cat => {
          const count = counts[cat.key] || 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={cat.key} className="flex flex-col items-center gap-1">
              <div
                className="w-full rounded-sm overflow-hidden"
                style={{ height: 24, background: '#111827' }}
              >
                <div
                  className="rounded-sm transition-all"
                  style={{
                    width: '100%',
                    height: `${pct}%`,
                    minHeight: count > 0 ? 3 : 0,
                    background: cat.color,
                    opacity: 0.7,
                    marginTop: `${100 - pct}%`,
                    transition: 'height 0.5s ease',
                  }}
                />
              </div>
              <span
                style={{
                  color: count > 0 ? cat.color : '#374151',
                  fontSize: '14px',
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {count}
              </span>
              <span style={{ color: '#374151', fontSize: '8px', textAlign: 'center', lineHeight: 1.2 }}>
                {cat.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
