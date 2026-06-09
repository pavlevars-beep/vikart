'use client';

import { SituationalAnalysis as SituationalAnalysisType, RiskLevel, TrendDirection } from '@/types';

interface Props {
  analysis: SituationalAnalysisType | null;
  isLoading: boolean;
}

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; bg: string; glow: string }> = {
  LOW:      { label: 'NIZAK',   color: '#22c55e', bg: 'rgba(34,197,94,0.1)',  glow: 'glow-green' },
  MODERATE: { label: 'UMEREN',  color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', glow: 'glow-amber' },
  HIGH:     { label: 'VISOK',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)', glow: 'glow-red'   },
};

const TREND_CONFIG: Record<TrendDirection, { label: string; color: string; icon: string }> = {
  IMPROVING:    { label: 'U POBOLJŠANJU',  color: '#22c55e', icon: '↑' },
  STABLE:       { label: 'STABILNO',       color: '#94a3b8', icon: '→' },
  DETERIORATING:{ label: 'U POGORŠANJU',  color: '#ef4444', icon: '↓' },
};

function RiskBadge({ level, label }: { level: RiskLevel; label: string }) {
  const cfg = RISK_CONFIG[level];
  return (
    <div
      className={`flex flex-col items-center justify-center rounded px-3 py-2 ${cfg.glow}`}
      style={{ background: cfg.bg, border: `1px solid ${cfg.color}30`, minWidth: 80 }}
    >
      <span style={{ color: cfg.color, fontSize: '18px', fontWeight: 800, lineHeight: 1 }}>
        {cfg.label}
      </span>
      <span style={{ color: '#475569', fontSize: '9px', letterSpacing: '0.1em', marginTop: 2 }}>
        {label}
      </span>
    </div>
  );
}

export default function SituationalAnalysis({ analysis, isLoading }: Props) {
  if (isLoading && !analysis) {
    return (
      <div
        className="rounded-lg p-5 scanline"
        style={{
          background: 'linear-gradient(135deg, #0d1117 0%, #111827 100%)',
          border: '1px solid #1e293b',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 rounded-full live-pulse" style={{ background: '#3b82f6' }} />
          <span style={{ color: '#475569', fontSize: '10px', letterSpacing: '0.2em' }}>
            SITUACIONA ANALIZA – UČITAVANJE...
          </span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="rounded h-3"
              style={{
                background: '#1e293b',
                width: i === 3 ? '60%' : '100%',
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div
        className="rounded-lg p-5"
        style={{ background: '#0d1117', border: '1px solid #1e293b' }}
      >
        <p style={{ color: '#475569', fontSize: '13px' }}>
          Analiza nije dostupna. Sistem prikuplja podatke...
        </p>
      </div>
    );
  }

  const overallCfg = RISK_CONFIG[analysis.riskLevel];
  const trendCfg = TREND_CONFIG[analysis.trend];

  return (
    <div
      className="rounded-lg overflow-hidden scanline"
      style={{
        background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1117 60%, #111827 100%)',
        border: `1px solid ${analysis.riskLevel === 'HIGH' ? '#7f1d1d' : '#1e293b'}`,
        boxShadow: analysis.riskLevel === 'HIGH'
          ? '0 0 30px rgba(239,68,68,0.08), inset 0 0 30px rgba(239,68,68,0.03)'
          : 'none',
      }}
    >
      {/* Header strip */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: '#070b14', borderBottom: '1px solid #1a2235' }}
      >
        <div className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2" />
            <path d="M12 8v4l3 3" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ color: '#3b82f6', fontSize: '10px', fontWeight: 700, letterSpacing: '0.2em' }}>
            SITUACIONA ANALIZA
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            style={{
              color: trendCfg.color,
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
            }}
          >
            {trendCfg.icon} TREND: {trendCfg.label}
          </span>
        </div>
      </div>

      <div className="p-4 md:p-5">
        {/* Risk indicators row */}
        <div className="flex flex-wrap items-start gap-3 mb-5">
          <div
            className={`flex flex-col items-center justify-center rounded px-4 py-3 ${overallCfg.glow}`}
            style={{
              background: overallCfg.bg,
              border: `1px solid ${overallCfg.color}50`,
              minWidth: 100,
            }}
          >
            <span style={{ color: '#475569', fontSize: '9px', letterSpacing: '0.15em', marginBottom: 4 }}>
              UKUPNI RIZIK
            </span>
            <span style={{ color: overallCfg.color, fontSize: '24px', fontWeight: 900, lineHeight: 1 }}>
              {overallCfg.label}
            </span>
          </div>
          <RiskBadge level={analysis.serbiaRisk} label="SRBIJA" />
          <RiskBadge level={analysis.worldRisk} label="SVET" />
        </div>

        {/* Summary */}
        <p
          style={{
            color: '#cbd5e1',
            fontSize: '14px',
            lineHeight: 1.65,
            borderLeft: `2px solid ${overallCfg.color}50`,
            paddingLeft: 12,
            marginBottom: 16,
          }}
        >
          {analysis.summary}
        </p>

        {/* Key developments */}
        {analysis.keyDevelopments.length > 0 && (
          <div className="mb-4">
            <div
              style={{
                color: '#475569',
                fontSize: '9px',
                letterSpacing: '0.2em',
                marginBottom: 8,
              }}
            >
              KLJUČNI RAZVOJI
            </div>
            <ul className="space-y-1.5">
              {analysis.keyDevelopments.map((dev, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span style={{ color: '#3b82f6', marginTop: 3, flexShrink: 0 }}>▸</span>
                  <span style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.5 }}>{dev}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prediction note */}
        {analysis.predictionNote && (
          <div
            className="flex items-start gap-3 rounded px-3 py-2.5 mt-3"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" stroke="#3b82f6" strokeWidth="2" />
              <path d="M12 16v-4M12 8h.01" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{ color: '#60a5fa', fontSize: '12px', lineHeight: 1.6 }}>
              {analysis.predictionNote}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
