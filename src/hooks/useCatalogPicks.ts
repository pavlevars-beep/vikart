import { useCallback, useEffect, useState } from 'react';
import { readStorage, writeStorage, storageKeys } from '@/utils/storage';

const PICKS_CHANGED_EVENT = 'vikart:catalog-picks-changed';

function readPicks(): string[] {
  return readStorage<string[]>(storageKeys.catalogPicks) ?? [];
}

function writePicks(next: string[]): void {
  writeStorage(storageKeys.catalogPicks, next);
  window.dispatchEvent(new CustomEvent(PICKS_CHANGED_EVENT));
}

export function useCatalogPicks() {
  const [picks, setPicks] = useState<string[]>([]);

  useEffect(() => {
    setPicks(readPicks());
    const handleChange = () => setPicks(readPicks());
    window.addEventListener(PICKS_CHANGED_EVENT, handleChange);
    return () => window.removeEventListener(PICKS_CHANGED_EVENT, handleChange);
  }, []);

  const togglePick = useCallback((id: string) => {
    const current = readPicks();
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    writePicks(next);
  }, []);

  const clearPicks = useCallback(() => {
    writePicks([]);
  }, []);

  const isPicked = useCallback((id: string) => picks.includes(id), [picks]);

  return { picks, togglePick, clearPicks, isPicked };
}
