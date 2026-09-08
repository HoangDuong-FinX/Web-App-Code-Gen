import type { Car } from '../types';

const STORAGE_KEY = 'automini_favorites';

export function getFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as string[];
    return [];
  } catch {
    return [];
  }
}

export function saveFavoriteIds(ids: string[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    return true;
  } catch {
    return false;
  }
}

export function toggleFavorite(carId: string): { ids: string[]; saved: boolean } {
  const current = getFavoriteIds();
  const idx = current.indexOf(carId);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(carId);
  }
  const saved = saveFavoriteIds(current);
  return { ids: current, saved };
}

export function isFavorite(carId: string): boolean {
  return getFavoriteIds().includes(carId);
}

export function getFavoriteCars(allCars: Car[]): Car[] {
  const ids = getFavoriteIds();
  return ids.map((id) => allCars.find((c) => c.id === id)).filter((c): c is Car => c !== undefined);
}
