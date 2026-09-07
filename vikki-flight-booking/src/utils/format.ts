// Number and date formatting utilities

export function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' VND';
}

export function formatDate(iso: string): string {
  // iso: YYYY-MM-DD => 'DD tháng MM YYYY'
  const [year, month, day] = iso.split('-');
  return `${parseInt(day, 10)} tháng ${parseInt(month, 10)} ${year}`;
}

export function formatTime(time: string): string {
  return time; // HH:MM already
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return `${days[d.getDay()]}\n${d.getDate()}`;
}

export function isoToDisplay(iso: string | null): string {
  if (!iso) return '';
  return formatDate(iso);
}

export function generateBookingCode(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}
