'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getTranslations, type Locale, type TranslationKey } from '@shared/i18n';

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: 'hr',
      setLocale: (locale: Locale) => set({ locale }),
    }),
    { name: 'fit-locale' }
  )
);

export function useT(): TranslationKey {
  const locale = useLocaleStore((s) => s.locale);
  return getTranslations(locale);
}
