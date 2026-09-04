// i18n lookup utility
import vi from './vi';

type Translations = Record<string, string>;

const locales: Record<string, Translations> = {
  vi,
};

let currentLocale = 'vi';

export function setLocale(locale: string): void {
  if (locales[locale]) {
    currentLocale = locale;
  }
}

export function t(key: string, params?: Record<string, string>): string {
  const table = locales[currentLocale] ?? locales['vi'];
  let value = table[key];
  if (value === undefined) {
    return key;
  }
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v);
    }
  }
  return value;
}
