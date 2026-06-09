'use client';

import { Incident, IncidentCategory } from '@/types';

interface Props {
  incident: Incident;
  index: number;
}

const CATEGORY_CONFIG: Record<
  IncidentCategory,
  { label: string; color: string; bg: string; icon: string }
> = {
  PROTEST:   { label: 'Protest',    color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  icon: '✊' },
  FIRE:      { label: 'Požar',      color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   icon: '🔥' },
  CYBER:     { label: 'Sajber',     color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  icon: '⚡' },
  MILITARY:  { label: 'Vojska',     color: '#f97316', bg: 'rgba(249,115,22,0.1)',  icon: '⚔' },
  DISASTER:  { label: 'Katastrofa', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', icon: '⚠' },
  CRIME:     { label: 'Kriminal',   color: '#ec4899', bg: 'rgba(236,72,153,0.1)',  icon: '🔒' },
  TERROR:    { label: 'Bezbednost', color: '#dc2626', bg: 'rgba(220,38,38,0.12)',  icon: '🚨' },
  BORDER:    { label: 'Granica',    color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   icon: '🛡' },
  POLITICAL: { label: 'Politika',   color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  icon: '🏛' },
  GENERAL:   { label: 'Opšte',      color: '#64748b', bg: 'rgba(100,116,139,0.1)', icon: '📡' },
};

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return '';
  }
}

export default function IncidentCard({ incident, index }: Props) {
  const cat = CATEGORY_CONFIG[incident.category] || CATEGORY_CONFIG.GENERAL;

  return (
    <a
      href={incident.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block fade-in-up"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms`, textDecoration: 'none' }}
    >
      <article
        className="rounded-lg transition-all duration-200 group"
        style={{
          background: '#0d1117',
          border: '1px solid #1a2235',
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = '#111827';
          el.style.borderColor = '#253347';
          el.style.transform = 'translateX(2px)';
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.background = '#0d1117';
          el.style.borderColor = '#1a2235';
          el.style.transform = 'translateX(0)';
        }}
      >
        {/* Top section */}
        <div className="flex items-start gap-3 p-3 pb-2">
          {/* Category icon */}
          <div
            className="flex items-center justify-center rounded w-8 h-8 text-sm flex-shrink-0 mt-0.5"
            style={{ background: cat.bg, border: `1px solid ${cat.color}25` }}
          >
            {cat.icon}
          </div>

          <div className="flex-1 min-w-0">
            {/* Headline */}
            <h3
              style={{
                color: '#e2e8f0',
                fontSize: '13px',
                fontWeight: 600,
                lineHeight: 1.45,
                marginBottom: 6,
              }}
            >
              {incident.headline}
            </h3>

            {/* Summary */}
            {incident.summary && incident.summary !== incident.headline && (
              <p
                style={{
                  color: '#64748b',
                  fontSize: '11.5px',
                  lineHeight: 1.55,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {incident.summary}
              </p>
            )}
          </div>
        </div>

        {/* Bottom meta row */}
        <div
          className="flex items-center justify-between px-3 pb-2.5"
          style={{ borderTop: '1px solid #111827', paddingTop: 7 }}
        >
          <div className="flex items-center gap-2">
            {/* Category tag */}
            <span
              className="rounded px-1.5 py-0.5"
              style={{
                background: cat.bg,
                color: cat.color,
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}
            >
              {cat.label.toUpperCase()}
            </span>
            {/* Medijski izveštaj label */}
            <span
              style={{
                color: '#374151',
                fontSize: '9px',
                letterSpacing: '0.05em',
              }}
            >
              Medijski izveštaj → {incident.sourceName}
            </span>
          </div>
          <span
            style={{
              color: '#374151',
              fontSize: '9px',
              fontFamily: 'monospace',
              flexShrink: 0,
            }}
          >
            {formatTimestamp(incident.timestamp)}
          </span>
        </div>
      </article>
    </a>
  );
}
