import en from "./en";
import vi from "./vi";

type Locale = "en" | "vi";

const translations: Record<Locale, Record<string, string>> = { en, vi };

let currentLocale: Locale = "vi";

export function setLocale(locale: Locale): void {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

export function t(key: string, params?: Record<string, string | number>): string {
  const dict = translations[currentLocale] ?? translations.en;
  let value = dict[key] ?? translations.en[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      value = value.replace(`{${k}}`, String(v));
    }
  }
  return value;
}

export function formatPrice(price: number, currency: string): string {
  try {
    return new Intl.NumberFormat(currentLocale === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString()}`;
  }
}