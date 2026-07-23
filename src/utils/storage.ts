const PREFIX = 'vikart:';

export const storageKeys = {
  configuratorDraft: `${PREFIX}configurator-draft`,
  savedPlan: `${PREFIX}saved-plan`,
  favoritePackages: `${PREFIX}favorite-packages`,
  catalogPicks: `${PREFIX}catalog-picks`,
  lastAnswers: `${PREFIX}last-answers`,
  lastPlans: `${PREFIX}last-plans`,
  inquiries: `${PREFIX}inquiries`,
  partnerInquiries: `${PREFIX}partner-inquiries`,
  partnerApplicationDraft: `${PREFIX}partner-application-draft`,
  partnerApplications: `${PREFIX}partner-applications`,

  // Repository-layer (runtime "database") keys — seeded from src/data/*.ts on first read.
  partnersDb: `${PREFIX}db-partners`,
  partnerOffersDb: `${PREFIX}db-partner-offers`,
  experiencesDb: `${PREFIX}db-experiences`,
  packagesDb: `${PREFIX}db-packages`,
  partnerInquiriesDb: `${PREFIX}db-partner-inquiries`,
  bookingsDb: `${PREFIX}db-bookings`,
  settingsDb: `${PREFIX}db-settings`,
  adminSession: `${PREFIX}admin-session`,
} as const;

export function readStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage nedostupan (privatan režim, puna memorija) — tiho ignorišemo u demo verziji
  }
}

export function removeStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function appendToList<T>(key: string, item: T): void {
  const list = readStorage<T[]>(key) ?? [];
  list.push(item);
  writeStorage(key, list);
}
