import { vi } from "./vi";

const translations: Record<string, Record<string, string>> = { vi };
let currentLang = "vi";

export function t(key: string, params?: Record<string, string | number>): string {
  const value = translations[currentLang]?.[key] ?? key;
  if (!params) return value;
  return Object.entries(params).reduce(
    (str, [k, v]) => str.replace(`{${k}}`, String(v)),
    value
  );
}

export function setLanguage(lang: string): void {
  if (translations[lang]) currentLang = lang;
}
