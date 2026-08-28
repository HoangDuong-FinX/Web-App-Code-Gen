import { vi } from './vi';

const translations: Record<string, Record<string, string>> = { vi };
const currentLocale = 'vi';

export function t(key: string, params?: Record<string, string | number>): string {
  const dict = translations[currentLocale] ?? translations['vi'];
  let value = dict[key];
  if (!value) {
    return key;
  }
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      value = value.replace(`{${k}}`, String(v));
    });
  }
  return value;
}
