'use client';

import { useState, useEffect } from 'react';

interface HeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdated: string | null;
}

export default function Header({ onRefresh, isRefreshing, lastUpdated }: HeaderProps) {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('sr-RS', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
      setDate(
        now.toLocaleDateString('sr-RS', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const lastUpdatedText = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString('sr-RS', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    : null;

  return (
    <header
      style={{
        background: 'linear-gradient(180deg, #0a0e1a 0%, #07090f 100%)',
        borderBottom: '1px solid #1e293b',
      }}
      className="sticky top-0 z-50"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid #111827' }}>
        <div className="flex items-center gap-3">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5">
            <span
              className="live-pulse inline-block w-2 h-2 rounded-full"
              style={{ background: '#ef4444' }}
            />
            <span style={{ color: '#ef4444', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em' }}>
              LIVE
            </span>
          </div>
          <span style={{ color: '#253347', fontSize: '10px' }}>|</span>
          <span style={{ color: '#475569', fontSize: '10px', letterSpacing: '0.05em' }}>
            BEZBEDNOSNO-OBAVEŠTAJNI SISTEM
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span style={{ color: '#475569', fontSize: '10px', fontFamily: 'monospace' }}>
            {date}
          </span>
          <span
            style={{
              color: '#94a3b8',
              fontSize: '11px',
              fontFamily: 'monospace',
              fontWeight: 600,
            }}
          >
            {time}
            <span className="cursor-blink" style={{ color: '#3b82f6' }}>_</span>
          </span>
        </div>
      </div>

      {/* Main header */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-9 h-9 rounded"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
              border: '1px solid #2563eb',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M9 12l2 2 4-4" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#f1f5f9',
                }}
              >
                SECURITY
              </span>
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: '#3b82f6',
                }}
              >
                24
              </span>
            </div>
            <div
              style={{
                fontSize: '9px',
                letterSpacing: '0.2em',
                color: '#475569',
                textTransform: 'uppercase',
                marginTop: '-2px',
              }}
            >
              Intelligence Briefing Platform
            </div>
          </div>
        </div>

        {/* Status + Refresh */}
        <div className="flex items-center gap-4">
          {lastUpdatedText && (
            <div className="hidden sm:flex flex-col items-end">
              <span style={{ fontSize: '9px', color: '#4b5563', letterSpacing: '0.1em' }}>
                POSLEDNJE OSVEŽAVANJE
              </span>
              <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
                {lastUpdatedText}
              </span>
            </div>
          )}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 rounded transition-all"
            style={{
              background: isRefreshing ? '#1e293b' : '#0f172a',
              border: '1px solid #253347',
              color: isRefreshing ? '#475569' : '#94a3b8',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={e => {
              if (!isRefreshing) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#3b82f6';
                (e.currentTarget as HTMLButtonElement).style.color = '#60a5fa';
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#253347';
              (e.currentTarget as HTMLButtonElement).style.color = isRefreshing ? '#475569' : '#94a3b8';
            }}
          >
            <svg
              className={isRefreshing ? 'spin' : ''}
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
            {isRefreshing ? 'OSVEŽAVANJE...' : 'OSVEŽI SISTEM'}
          </button>
        </div>
      </div>
    </header>
  );
}
