import vi from "./vi";

const translations: Record<string, Record<string, string>> = {
  vi,
};

const currentLocale = "vi";

export function t(key: string, params?: Record<string, string>): string {
  const table = translations[currentLocale] ?? translations["vi"];
  let value = table[key];
  if (!value) {
    return key;
  }
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(`{${k}}`, v);
    }
  }
  return value;
}
