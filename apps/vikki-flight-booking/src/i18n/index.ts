import { createContext, useContext } from 'react';
import vi, { type TranslationKey } from './locales/vi';
import en from './locales/en';

export type Locale = 'vi' | 'en';

const locales: Record<Locale, Record<TranslationKey, string>> = { vi, en };

export interface I18nContextValue {
  locale: Locale;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: 'vi',
  t: (key) => vi[key] ?? key,
});

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}

export function createI18n(locale: Locale): I18nContextValue {
  const dict = locales[locale] ?? locales.vi;
  return {
    locale,
    t: (key, params) => {
      let text = dict[key] ?? key;
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        });
      }
      return text;
    },
  };
}

export type { TranslationKey };
