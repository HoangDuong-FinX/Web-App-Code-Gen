import { vi } from './vi';

const translations: Record<string, Record<string, string>> = { vi };
let currentLocale = 'vi';

export function setLocale(locale: string): void {
  if (translations[locale]) {
    currentLocale = locale;
  }
}

export function t(key: string, params?: Record<string, string | number>): string {
  const table = translations[currentLocale] ?? translations['vi'];
  let value = table[key];
  if (!value) return key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    }
  }
  return value;
}
