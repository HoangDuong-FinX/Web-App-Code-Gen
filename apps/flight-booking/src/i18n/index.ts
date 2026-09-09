import { vi } from './vi';
import { en } from './en';
import type { TranslationKeys } from './types';
import { createContext, useContext, useState } from 'react';

export type { TranslationKeys } from './types';

type Locale = 'vi' | 'en';
const translations: Record<Locale, TranslationKeys> = { vi, en };

interface I18nContextValue { locale: Locale; setLocale: (l: Locale) => void; t: TranslationKeys; }
export const I18nContext = createContext<I18nContextValue | null>(null);

export function useT(): TranslationKeys { const ctx = useContext(I18nContext); if (!ctx) throw new Error('useT must be used within I18nProvider'); return ctx.t; }
export function useLocale(): I18nContextValue { const ctx = useContext(I18nContext); if (!ctx) throw new Error('useLocale must be used within I18nProvider'); return ctx; }

export function useI18nValue(initialLocale: Locale = 'vi'): I18nContextValue {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  return { locale, setLocale, t: translations[locale] };
}
