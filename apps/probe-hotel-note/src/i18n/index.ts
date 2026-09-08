import vi from './vi';

const translations: Record<string, Record<string, string>> = { vi };

let currentLang = 'vi';

export function t(key: string, params?: Record<string, string | number>): string {
  const dict = translations[currentLang] ?? translations['vi'];
  let value = dict[key];
  if (!value) {
    return key;
  }
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(`{{${k}}}`, String(v));
    }
  }
  return value;
}

export function setLanguage(lang: string): void {
  currentLang = lang;
}
