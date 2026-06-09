export type IncidentCategory =
  | 'PROTEST'
  | 'FIRE'
  | 'CYBER'
  | 'MILITARY'
  | 'DISASTER'
  | 'CRIME'
  | 'TERROR'
  | 'BORDER'
  | 'POLITICAL'
  | 'GENERAL';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';
export type TrendDirection = 'IMPROVING' | 'STABLE' | 'DETERIORATING';
export type Region = 'serbia' | 'world';

export interface Incident {
  id: string;
  headline: string;
  summary: string;
  category: IncidentCategory;
  timestamp: string;
  sourceUrl: string;
  sourceName: string;
  region: Region;
  rawContent?: string;
}

export interface SituationalAnalysis {
  riskLevel: RiskLevel;
  trend: TrendDirection;
  serbiaRisk: RiskLevel;
  worldRisk: RiskLevel;
  summary: string;
  keyDevelopments: string[];
  predictionNote: string;
  lastUpdated: string;
}

export interface DataStore {
  incidents: Incident[];
  situationalAnalysis: SituationalAnalysis | null;
  lastRefresh: string | null;
  isRefreshing: boolean;
}

export interface RSSSource {
  name: string;
  url: string;
  region: Region;
  language: 'sr' | 'en';
}

export interface NewsApiResponse {
  incidents: Incident[];
  total: number;
  lastUpdated: string | null;
}

export interface SituationalApiResponse {
  analysis: SituationalAnalysis | null;
  lastUpdated: string | null;
}
