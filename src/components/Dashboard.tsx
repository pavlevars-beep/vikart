'use client';

import { useState, useEffect, useCallback } from 'react';
import { SituationalAnalysis, Incident } from '@/types';
import Header from './Header';
import SituationalAnalysisComponent from './SituationalAnalysis';
import NewsFeed from './NewsFeed';

const REFRESH_INTERVAL = 3 * 60 * 1000; // 3 minutes

export default function Dashboard() {
  const [analysis, setAnalysis] = useState<SituationalAnalysis | null>(null);
  const [serbiaIncidents, setSerbiaIncidents] = useState<Incident[]>([]);
  const [worldIncidents, setWorldIncidents] = useState<Incident[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [situationalRes, serbiaRes, worldRes] = await Promise.all([
        fetch('/api/situational', { cache: 'no-store' }),
        fetch('/api/news?region=serbia', { cache: 'no-store' }),
        fetch('/api/news?region=world', { cache: 'no-store' }),
      ]);

      const [situational, serbia, world] = await Promise.all([
        situationalRes.json(),
        serbiaRes.json(),
        worldRes.json(),
      ]);

      if (situational.analysis) setAnalysis(situational.analysis);
      if (serbia.incidents) setSerbiaIncidents(serbia.incidents);
      if (world.incidents) setWorldIncidents(world.incidents);
      if (situational.lastUpdated) setLastUpdated(situational.lastUpdated);
    } catch {
      // Fail silently, keep existing data
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every 3 minutes
  useEffect(() => {
    const id = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [fetchData]);

  const handleManualRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await fetch('/api/refresh', { method: 'POST' });
      // Poll until refresh completes (max ~30s)
      let tries = 0;
      const poll = setInterval(async () => {
        tries++;
        await fetchData();
        if (tries >= 10) clearInterval(poll);
      }, 3000);
      setTimeout(() => clearInterval(poll), 30000);
    } catch {
      //
    } finally {
      setTimeout(() => setIsRefreshing(false), 5000);
    }
  }, [isRefreshing, fetchData]);

  return (
    <div className="grid-bg min-h-screen">
      <Header
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastUpdated}
      />

      <main className="max-w-4xl mx-auto px-4 py-5 space-y-5">
        {/* Situational Analysis */}
        <SituationalAnalysisComponent analysis={analysis} isLoading={isLoading} />

        {/* Divider */}
        <div
          className="flex items-center gap-3"
          style={{ color: '#253347', fontSize: '9px', letterSpacing: '0.2em' }}
        >
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #1a2235, transparent)' }} />
          <span>FEED INCIDENATA U REALNOM VREMENU</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(270deg, #1a2235, transparent)' }} />
        </div>

        {/* News Feed */}
        <NewsFeed
          serbiaIncidents={serbiaIncidents}
          worldIncidents={worldIncidents}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
}
