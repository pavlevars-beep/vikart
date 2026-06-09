import { DataStore, Incident, SituationalAnalysis } from '@/types';
import { RSS_SOURCES } from './sources';
import { fetchAllFeeds } from './rss-fetcher';
import { generateSituationalAnalysis, enrichIncidentsWithSummaries } from './ai-analyzer';

declare global {
  // eslint-disable-next-line no-var
  var __security24Store: DataStore | undefined;
  // eslint-disable-next-line no-var
  var __security24RefreshTimer: ReturnType<typeof setInterval> | undefined;
}

const REFRESH_INTERVAL = 3 * 60 * 1000; // 3 minutes

function getStore(): DataStore {
  if (!global.__security24Store) {
    global.__security24Store = {
      incidents: [],
      situationalAnalysis: null,
      lastRefresh: null,
      isRefreshing: false,
    };
  }
  return global.__security24Store;
}

export async function refreshData(): Promise<void> {
  const store = getStore();
  if (store.isRefreshing) return;

  store.isRefreshing = true;
  try {
    const rawIncidents = await fetchAllFeeds(RSS_SOURCES);
    const enriched = await enrichIncidentsWithSummaries(rawIncidents);
    const analysis = await generateSituationalAnalysis(enriched);

    store.incidents = enriched;
    store.situationalAnalysis = analysis;
    store.lastRefresh = new Date().toISOString();
  } catch {
    // Keep existing data on failure
  } finally {
    store.isRefreshing = false;
  }
}

export function getIncidents(region?: 'serbia' | 'world'): Incident[] {
  const store = getStore();
  if (region) {
    return store.incidents.filter(i => i.region === region);
  }
  return store.incidents;
}

export function getSituationalAnalysis(): SituationalAnalysis | null {
  return getStore().situationalAnalysis;
}

export function getLastRefresh(): string | null {
  return getStore().lastRefresh;
}

export function isRefreshing(): boolean {
  return getStore().isRefreshing;
}

export function ensureBackgroundRefresh(): void {
  if (global.__security24RefreshTimer) return;

  // Initial load
  refreshData();

  // Schedule recurring refresh
  global.__security24RefreshTimer = setInterval(() => {
    refreshData();
  }, REFRESH_INTERVAL);
}
