import Anthropic from '@anthropic-ai/sdk';
import { Incident, SituationalAnalysis, RiskLevel, TrendDirection } from '@/types';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function assessRiskFromIncidents(incidents: Incident[]): RiskLevel {
  const highRiskCategories = ['TERROR', 'MILITARY', 'CYBER'];
  const midRiskCategories = ['DISASTER', 'CRIME', 'PROTEST'];

  const highCount = incidents.filter(i => highRiskCategories.includes(i.category)).length;
  const midCount = incidents.filter(i => midRiskCategories.includes(i.category)).length;

  if (highCount >= 3 || (highCount >= 1 && midCount >= 3)) return 'HIGH';
  if (highCount >= 1 || midCount >= 3) return 'MODERATE';
  return 'LOW';
}

export async function generateSituationalAnalysis(
  incidents: Incident[]
): Promise<SituationalAnalysis> {
  const serbiaIncidents = incidents.filter(i => i.region === 'serbia').slice(0, 15);
  const worldIncidents = incidents.filter(i => i.region === 'world').slice(0, 15);

  const incidentSummary = [
    ...serbiaIncidents.map(i => `[SRBIJA][${i.category}] ${i.headline}`),
    ...worldIncidents.map(i => `[SVET][${i.category}] ${i.headline}`),
  ].join('\n');

  const now = new Date().toISOString();

  if (!process.env.ANTHROPIC_API_KEY) {
    return buildFallbackAnalysis(incidents, now);
  }

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Ti si bezbednosni analitičar. Analiziraj sledeće trenutne vesti i napiši kratki izveštaj.

TRENUTNE VESTI:
${incidentSummary || 'Nema dostupnih vesti u ovom trenutku.'}

Odgovori ISKLJUČIVO u sledećem JSON formatu (bez dodatnog teksta):
{
  "riskLevel": "LOW" | "MODERATE" | "HIGH",
  "serbiaRisk": "LOW" | "MODERATE" | "HIGH",
  "worldRisk": "LOW" | "MODERATE" | "HIGH",
  "trend": "IMPROVING" | "STABLE" | "DETERIORATING",
  "summary": "Kratka situaciona analiza na srpskom latiničnom pismu (2-3 rečenice, profesionalan ton, bez emocija)",
  "keyDevelopments": ["Ključni razvoj 1", "Ključni razvoj 2", "Ključni razvoj 3"],
  "predictionNote": "Kratka prognoza trendova na srpskom latiničnom pismu (1-2 rečenice)"
}`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return buildFallbackAnalysis(incidents, now);

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      riskLevel: parsed.riskLevel || 'LOW',
      serbiaRisk: parsed.serbiaRisk || 'LOW',
      worldRisk: parsed.worldRisk || 'LOW',
      trend: parsed.trend || 'STABLE',
      summary: parsed.summary || 'Analiza trenutno nije dostupna.',
      keyDevelopments: Array.isArray(parsed.keyDevelopments) ? parsed.keyDevelopments : [],
      predictionNote: parsed.predictionNote || '',
      lastUpdated: now,
    };
  } catch {
    return buildFallbackAnalysis(incidents, now);
  }
}

export async function enrichIncidentsWithSummaries(
  incidents: Incident[]
): Promise<Incident[]> {
  if (!process.env.ANTHROPIC_API_KEY || incidents.length === 0) return incidents;

  const needsSummary = incidents.filter(
    i => !i.summary || i.summary === i.headline || i.summary.length < 50
  );

  if (needsSummary.length === 0) return incidents;

  const batch = needsSummary.slice(0, 10);

  try {
    const prompt = batch
      .map((inc, idx) => `${idx + 1}. [${inc.region.toUpperCase()}][${inc.category}] ${inc.headline}\nSadržaj: ${inc.rawContent || inc.headline}`)
      .join('\n\n');

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `Za svaki od sledećih incidenata napiši kratku analitičku napomenu (2 rečenice, neutralan profesionalni ton, srpski latiničan) u JSON formatu.

${prompt}

Odgovori ISKLJUČIVO kao JSON niz:
[
  {"idx": 1, "summary": "Analitička napomena..."},
  ...
]`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return incidents;

    const summaries: Array<{ idx: number; summary: string }> = JSON.parse(jsonMatch[0]);
    const enriched = [...incidents];

    for (const s of summaries) {
      const incident = batch[s.idx - 1];
      if (incident && s.summary) {
        const globalIdx = enriched.findIndex(i => i.id === incident.id);
        if (globalIdx !== -1) {
          enriched[globalIdx] = { ...enriched[globalIdx], summary: s.summary };
        }
      }
    }

    return enriched;
  } catch {
    return incidents;
  }
}

function buildFallbackAnalysis(incidents: Incident[], now: string): SituationalAnalysis {
  const serbiaIncidents = incidents.filter(i => i.region === 'serbia');
  const worldIncidents = incidents.filter(i => i.region === 'world');

  const serbiaRisk = assessRiskFromIncidents(serbiaIncidents);
  const worldRisk = assessRiskFromIncidents(worldIncidents);
  const overall: RiskLevel =
    serbiaRisk === 'HIGH' || worldRisk === 'HIGH'
      ? 'HIGH'
      : serbiaRisk === 'MODERATE' || worldRisk === 'MODERATE'
        ? 'MODERATE'
        : 'LOW';

  const topHeadlines = incidents
    .slice(0, 3)
    .map(i => i.headline)
    .filter(Boolean);

  return {
    riskLevel: overall,
    serbiaRisk,
    worldRisk,
    trend: 'STABLE',
    summary:
      incidents.length > 0
        ? `Bezbednosna situacija je pod praćenjem. Ukupno ${incidents.length} incidenata zabeleženo od poslednjeg osvežavanja. Analitički modul procesuira ulazne podatke.`
        : 'Nema dostupnih podataka za analizu u ovom trenutku. Sistem čeka na ulazne podatke iz izvora.',
    keyDevelopments: topHeadlines,
    predictionNote: 'Praćenje situacije u toku. Prognoza će biti dostupna po završetku analize.',
    lastUpdated: now,
  };
}
