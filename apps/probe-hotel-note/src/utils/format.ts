export function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + ' VN\u0110';
}
