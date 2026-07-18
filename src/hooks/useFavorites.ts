import { useCallback, useEffect, useState } from 'react';
import { readStorage, writeStorage, storageKeys } from '@/utils/storage';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(readStorage<string[]>(storageKeys.favoritePackages) ?? []);
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      writeStorage(storageKeys.favoritePackages, next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
