import vi from './vi';

const translations: Record<string, Record<string, string>> = { vi };
const currentLocale = 'vi';

export function t(key: string, params?: Record<string, string | number>): string {
  const table = translations[currentLocale] ?? translations['vi'];
  let value = table[key];
  if (value === undefined) {
    return key;
  }
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(`{${k}}`, String(v));
    }
  }
  return value;
}
