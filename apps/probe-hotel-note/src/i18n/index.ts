import vi from './vi';

const dictionaries: Record<string, Record<string, string>> = { vi };
let currentLang = 'vi';

export function setLang(lang: string): void {
  if (dictionaries[lang]) {
    currentLang = lang;
  }
}

export function t(key: string, params?: Record<string, string | number>): string {
  const dict = dictionaries[currentLang] ?? dictionaries['vi'];
  let value = dict[key];
  if (!value) return key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(`{${k}}`, String(v));
    }
  }
  return value;
}
