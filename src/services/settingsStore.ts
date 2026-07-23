import type { VikArtSettings } from '@/types';
import { defaultSettings } from '@/types';
import { readStorage, writeStorage, storageKeys } from '@/utils/storage';

export function getSettings(): VikArtSettings {
  const existing = readStorage<VikArtSettings>(storageKeys.settingsDb);
  if (existing) return { ...defaultSettings, ...existing };
  writeStorage(storageKeys.settingsDb, defaultSettings);
  return defaultSettings;
}

export function saveSettings(settings: VikArtSettings): VikArtSettings {
  writeStorage(storageKeys.settingsDb, settings);
  return settings;
}
