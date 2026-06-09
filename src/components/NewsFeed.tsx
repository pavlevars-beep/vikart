'use client';

import { useState } from 'react';
import { Incident, Region } from '@/types';
import IncidentCard from './IncidentCard';
import CategoryStats from './CategoryStats';

interface Props {
  serbiaIncidents: Incident[];
  worldIncidents: Incident[];
  isLoading: boolean;
}

function EmptyState({ region }: { region: Region }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'rgba(59,130,246,0.08)',
          border: '1px solid rgba(59,130,246,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      </div>
      <p style={{ color: '#374151', fontSize: '13px' }}>
        {region === 'serbia' ? 'Nema dostupnih vesti za Srbiju.' : 'Nema dostupnih međunarodnih vesti.'}
      </p>
      <p style={{ color: '#253347', fontSize: '11px' }}>
        Sistem prikuplja podatke iz izvora...
      </p>
    </div>
  );
}

function LoadingList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg p-3"
          style={{ background: '#0d1117', border: '1px solid #1a2235', opacity: 0.5 - i * 0.07 }}
        >
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded flex-shrink-0" style={{ background: '#1a2235' }} />
            <div className="flex-1 space-y-2">
              <div className="h-3 rounded" style={{ background: '#1a2235', width: '85%' }} />
              <div className="h-2.5 rounded" style={{ background: '#111827', width: '65%' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NewsFeed({ serbiaIncidents, worldIncidents, isLoading }: Props) {
  const [activeTab, setActiveTab] = useState<Region>('serbia');

  const currentIncidents = activeTab === 'serbia' ? serbiaIncidents : worldIncidents;
  const bothAll = [...serbiaIncidents, ...worldIncidents];

  return (
    <div>
      {/* Category stats across all */}
      {!isLoading && bothAll.length > 0 && (
        <div className="mb-4">
          <CategoryStats incidents={currentIncidents} />
        </div>
      )}

      {/* Tab navigation */}
      <div
        className="flex rounded-lg overflow-hidden mb-4"
        style={{ border: '1px solid #1a2235', background: '#0a0e1a' }}
      >
        {(['serbia', 'world'] as Region[]).map(tab => {
          const isActive = activeTab === tab;
          const count = tab === 'serbia' ? serbiaIncidents.length : worldIncidents.length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 transition-all"
              style={{
                background: isActive
                  ? 'linear-gradient(180deg, #1e3a8a22 0%, #1d4ed822 100%)'
                  : 'transparent',
                borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
                color: isActive ? '#60a5fa' : '#4b5563',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.05em',
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
              }}
            >
              <span style={{ fontSize: tab === 'serbia' ? '13px' : '12px' }}>
                {tab === 'serbia' ? '🇷🇸' : '🌐'}
              </span>
              <span>{tab === 'serbia' ? 'SRBIJA' : 'SVET'}</span>
              {count > 0 && (
                <span
                  className="rounded-full px-1.5 py-0.5"
                  style={{
                    background: isActive ? 'rgba(59,130,246,0.2)' : 'rgba(71,85,105,0.2)',
                    color: isActive ? '#60a5fa' : '#475569',
                    fontSize: '9px',
                    fontWeight: 700,
                    minWidth: 18,
                    textAlign: 'center',
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feed content */}
      <div>
        {isLoading && currentIncidents.length === 0 ? (
          <LoadingList />
        ) : currentIncidents.length === 0 ? (
          <EmptyState region={activeTab} />
        ) : (
          <div className="space-y-2">
            {currentIncidents.map((incident, idx) => (
              <IncidentCard key={incident.id} incident={incident} index={idx} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-center mt-6 py-3"
        style={{ borderTop: '1px solid #111827' }}
      >
        <span style={{ color: '#253347', fontSize: '10px', letterSpacing: '0.1em' }}>
          Powered by AI – Real-time intelligence briefing
        </span>
      </div>
    </div>
  );
}
