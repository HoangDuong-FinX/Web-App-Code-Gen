export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + ' \u20AB';
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
