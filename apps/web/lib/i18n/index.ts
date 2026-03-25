import { hr } from './hr';
import { en } from './en';
import type { TranslationKey } from './hr';

export type Locale = 'hr' | 'en';

const translations: Record<Locale, TranslationKey> = { hr, en };

export function getTranslations(locale: Locale): TranslationKey {
  return translations[locale] || translations.hr;
}

export type { TranslationKey };
export { hr, en };
