import { useCallback, useEffect, useState } from 'react';
import { readStorage, writeStorage, storageKeys } from '@/utils/storage';

export function useCatalogPicks() {
  const [picks, setPicks] = useState<string[]>([]);

  useEffect(() => {
    setPicks(readStorage<string[]>(storageKeys.catalogPicks) ?? []);
  }, []);

  const togglePick = useCallback((id: string) => {
    setPicks((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      writeStorage(storageKeys.catalogPicks, next);
      return next;
    });
  }, []);

  const isPicked = useCallback((id: string) => picks.includes(id), [picks]);

  return { picks, togglePick, isPicked };
}
