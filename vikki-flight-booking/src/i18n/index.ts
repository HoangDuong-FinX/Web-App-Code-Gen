import { vi } from './vi';
import { en } from './en';
import type { TranslationKey } from './vi';

export type { TranslationKey };

const translations: Record<string, Record<TranslationKey, string>> = { vi, en };

let currentLocale = 'vi';

export function setLocale(locale: string): void {
  currentLocale = translations[locale] ? locale : 'vi';
}

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  const table = translations[currentLocale] ?? vi;
  let str: string = table[key] ?? vi[key] ?? key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  return str;
}

export function formatVnd(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' VND';
}

export function formatVndMinus(amount: number): string {
  return '\u2212' + amount.toLocaleString('vi-VN') + ' VND';
}
