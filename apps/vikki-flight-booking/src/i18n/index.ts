import vi, { type TranslationKey } from './vi';

const translations: Record<string, Record<TranslationKey, string>> = { vi };

let currentLocale = 'vi';

export function setLocale(locale: string): void {
  if (translations[locale]) {
    currentLocale = locale;
  }
}

export function t(key: TranslationKey): string {
  return translations[currentLocale]?.[key] ?? key;
}

export type { TranslationKey };
