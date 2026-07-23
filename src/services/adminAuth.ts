import type { AdminRole } from '@/types';
import { readStorage, writeStorage, removeStorage, storageKeys } from '@/utils/storage';

/**
 * PROTOTYPE auth guard. Nema pravog backend-a niti šifrovanja — ovo postoji
 * isključivo da admin stranice ne budu dostupne kroz javnu navigaciju i slučajan
 * klik. Kada zaživi pravi authentication (npr. NextAuth/Clerk/Supabase Auth ili
 * sopstveni backend sa sesijama), zameniti isključivo sadržaj ovog fajla —
 * `AdminAuthGuard` komponenta i njen interfejs mogu ostati isti.
 */
const PROTOTYPE_PASSWORD = 'vikart-admin';

export interface AdminSession {
  role: AdminRole;
  loggedInAt: string;
}

export function getAdminSession(): AdminSession | null {
  return readStorage<AdminSession>(storageKeys.adminSession);
}

export function isAuthenticated(): boolean {
  return getAdminSession() !== null;
}

export function login(password: string): boolean {
  if (password !== PROTOTYPE_PASSWORD) return false;
  const session: AdminSession = { role: 'owner_admin', loggedInAt: new Date().toISOString() };
  writeStorage(storageKeys.adminSession, session);
  return true;
}

export function logout(): void {
  removeStorage(storageKeys.adminSession);
}
