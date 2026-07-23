import type { AdminNote, AdminActivityEntry } from '@/types';

const DEFAULT_AUTHOR = 'VikArt tim';

export function makeNote(text: string, authorName: string = DEFAULT_AUTHOR): AdminNote {
  return {
    id: `note-${Date.now().toString(36)}-${Math.round(Math.random() * 1e4)}`,
    authorName,
    text,
    createdAt: new Date().toISOString(),
  };
}

export function makeActivity(type: string, description: string, authorName: string = DEFAULT_AUTHOR): AdminActivityEntry {
  return {
    id: `activity-${Date.now().toString(36)}-${Math.round(Math.random() * 1e4)}`,
    type,
    description,
    createdAt: new Date().toISOString(),
    authorName,
  };
}
