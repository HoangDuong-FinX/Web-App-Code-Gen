export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function getDefaultDepartureDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 28);
  return d.toISOString().split('T')[0];
}

export function getDefaultReturnDate(departure: string): string {
  const d = new Date(departure);
  d.setDate(d.getDate() + 4);
  return d.toISOString().split('T')[0];
}
