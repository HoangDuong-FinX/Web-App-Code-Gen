import type { ReactNode } from 'react';
import { I18nContext, useI18nValue } from './index';

export function I18nProvider({ children, initialLocale = 'vi' }: { children: ReactNode; initialLocale?: 'vi' | 'en' }) {
  const value = useI18nValue(initialLocale);
  return (<I18nContext.Provider value={value}>{children}</I18nContext.Provider>);
}
