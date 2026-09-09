// Stub: replaced by inline implementation in AirportPickerScreen
export function stripDiacritics(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
