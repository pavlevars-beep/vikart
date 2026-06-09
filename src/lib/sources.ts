import { RSSSource } from '@/types';

export const RSS_SOURCES: RSSSource[] = [
  // Serbian sources
  {
    name: 'RTS',
    url: 'https://www.rts.rs/rss/Serbia.xml',
    region: 'serbia',
    language: 'sr',
  },
  {
    name: 'N1 Srbija',
    url: 'https://rs.n1info.com/feed/',
    region: 'serbia',
    language: 'sr',
  },
  {
    name: 'Blic',
    url: 'https://www.blic.rs/rss',
    region: 'serbia',
    language: 'sr',
  },
  {
    name: 'Nova.rs',
    url: 'https://nova.rs/feed/',
    region: 'serbia',
    language: 'sr',
  },
  {
    name: 'Kurir',
    url: 'https://www.kurir.rs/rss',
    region: 'serbia',
    language: 'sr',
  },
  {
    name: 'Telegraf',
    url: 'https://www.telegraf.rs/rss',
    region: 'serbia',
    language: 'sr',
  },
  {
    name: 'Danas',
    url: 'https://www.danas.rs/feed/',
    region: 'serbia',
    language: 'sr',
  },
  {
    name: 'Vesti Online',
    url: 'https://www.vesti-online.com/feed/',
    region: 'serbia',
    language: 'sr',
  },
  // International sources
  {
    name: 'Reuters',
    url: 'https://feeds.reuters.com/reuters/topNews',
    region: 'world',
    language: 'en',
  },
  {
    name: 'BBC World',
    url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
    region: 'world',
    language: 'en',
  },
  {
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    region: 'world',
    language: 'en',
  },
  {
    name: 'DW',
    url: 'https://rss.dw.com/rdf/rss-en-all',
    region: 'world',
    language: 'en',
  },
  {
    name: 'AP News',
    url: 'https://feeds.apnews.com/rss/apf-topnews',
    region: 'world',
    language: 'en',
  },
  {
    name: 'ReliefWeb',
    url: 'https://reliefweb.int/updates/rss.xml',
    region: 'world',
    language: 'en',
  },
];

export const SECURITY_KEYWORDS = [
  // Serbian keywords
  'protest', 'požar', 'nesreća', 'kriminal', 'hapšenje', 'policija',
  'vojska', 'granica', 'kriza', 'napad', 'eksplozija', 'poplava',
  'zemljotres', 'haos', 'incident', 'pretnja', 'bezbednost', 'rat',
  'sukob', 'vanredno', 'evakuacija', 'povređeni', 'poginuli',
  // English keywords
  'attack', 'fire', 'explosion', 'protest', 'military', 'conflict',
  'security', 'threat', 'crisis', 'disaster', 'emergency', 'shooting',
  'bomb', 'terror', 'war', 'nuclear', 'cyber', 'hack', 'breach',
  'earthquake', 'flood', 'killed', 'injured', 'arrested', 'police',
  'border', 'sanctions', 'missile', 'troops', 'evacuate',
];
