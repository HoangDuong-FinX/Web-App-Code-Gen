export function formatPrice(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' VND';
}

export function formatTimer(expiresAt: number): { mm: string; ss: string; expired: boolean } {
  const diff = Math.max(0, expiresAt - Date.now());
  const totalSec = Math.floor(diff / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const ss = String(totalSec % 60).padStart(2, '0');
  return { mm, ss, expired: diff <= 0 };
}
