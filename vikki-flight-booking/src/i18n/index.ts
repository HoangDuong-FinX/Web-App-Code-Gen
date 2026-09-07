import { vi } from './vi';
export type { TranslationKey } from './vi';

export function t(key: keyof typeof vi, params?: Record<string, string | number>): string {
  let str: string = vi[key];
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, String(v));
    });
  }
  return str;
}

export { vi };
