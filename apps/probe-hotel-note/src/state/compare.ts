const MAX_COMPARE = 3;

export function getCompareIds(): string[] {
  try {
    const raw = sessionStorage.getItem('automini_compare');
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as string[];
    return [];
  } catch {
    return [];
  }
}

function saveCompareIds(ids: string[]): void {
  sessionStorage.setItem('automini_compare', JSON.stringify(ids));
}

export function toggleCompare(carId: string): { ids: string[]; limitReached: boolean } {
  const current = getCompareIds();
  const idx = current.indexOf(carId);
  if (idx >= 0) {
    current.splice(idx, 1);
    saveCompareIds(current);
    return { ids: current, limitReached: false };
  }
  if (current.length >= MAX_COMPARE) {
    return { ids: current, limitReached: true };
  }
  current.push(carId);
  saveCompareIds(current);
  return { ids: current, limitReached: false };
}

export function removeFromCompare(carId: string): string[] {
  const current = getCompareIds();
  const idx = current.indexOf(carId);
  if (idx >= 0) {
    current.splice(idx, 1);
    saveCompareIds(current);
  }
  return current;
}

export function isInCompare(carId: string): boolean {
  return getCompareIds().includes(carId);
}
