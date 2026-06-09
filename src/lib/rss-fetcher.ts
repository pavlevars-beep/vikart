import Parser from 'rss-parser';
import { v4 as uuidv4 } from 'uuid';
import { Incident, IncidentCategory, Region, RSSSource } from '@/types';
import { SECURITY_KEYWORDS } from './sources';

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: ['description', 'content', 'content:encoded'],
  },
});

function categorizeIncident(text: string): IncidentCategory {
  const lower = text.toLowerCase();
  if (/protest|demonstraci|skup|marš|rally|demonstration/i.test(lower)) return 'PROTEST';
  if (/požar|fire|gori|plamen|blaze|burn/i.test(lower)) return 'FIRE';
  if (/cyber|hakersk|sajber|hack|breach|malware|ransomware|ddos/i.test(lower)) return 'CYBER';
  if (/vojska|militar|tenkovi|avijacija|troop|missile|army|navy|air force|defense/i.test(lower)) return 'MILITARY';
  if (/poplava|zemljotres|oluja|flood|earthquake|storm|hurricane|tornado|disaster|natural/i.test(lower)) return 'DISASTER';
  if (/kriminal|hapšenje|ubojstvo|pljačka|crime|murder|robbery|arrested|drug|trafficking/i.test(lower)) return 'CRIME';
  if (/teror|bomb|eksplozij|napad|attack|terror|shooting|hostage/i.test(lower)) return 'TERROR';
  if (/granica|granič|border|immigration|refugee|migrant/i.test(lower)) return 'BORDER';
  if (/vlada|ministar|predsedni|government|minister|president|election|political|parliament/i.test(lower)) return 'POLITICAL';
  return 'GENERAL';
}

function isSecurityRelevant(text: string): boolean {
  const lower = text.toLowerCase();
  return SECURITY_KEYWORDS.some(kw => lower.includes(kw.toLowerCase()));
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500);
}

export async function fetchFeed(source: RSSSource): Promise<Incident[]> {
  try {
    const feed = await parser.parseURL(source.url);
    const incidents: Incident[] = [];

    for (const item of (feed.items || []).slice(0, 20)) {
      const headline = cleanText(item.title || '');
      const content = cleanText(
        item['content:encoded'] || item.content || item.description || item.summary || ''
      );
      const text = `${headline} ${content}`;

      if (!headline) continue;

      incidents.push({
        id: uuidv4(),
        headline,
        summary: content.slice(0, 300) || headline,
        category: categorizeIncident(text),
        timestamp: item.pubDate
          ? new Date(item.pubDate).toISOString()
          : new Date().toISOString(),
        sourceUrl: item.link || source.url,
        sourceName: source.name,
        region: source.region,
        rawContent: content,
      });
    }

    return incidents;
  } catch {
    return [];
  }
}

export async function fetchAllFeeds(sources: RSSSource[]): Promise<Incident[]> {
  const results = await Promise.allSettled(sources.map(s => fetchFeed(s)));

  const allIncidents: Incident[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      allIncidents.push(...result.value);
    }
  }

  // Deduplicate by similar headlines
  const seen = new Set<string>();
  const deduped: Incident[] = [];
  for (const inc of allIncidents) {
    const key = inc.headline.toLowerCase().slice(0, 60);
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(inc);
    }
  }

  // Sort by timestamp descending
  deduped.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return deduped;
}

export function filterSecurityRelevant(incidents: Incident[]): Incident[] {
  return incidents.filter(inc =>
    isSecurityRelevant(`${inc.headline} ${inc.summary}`)
  );
}
