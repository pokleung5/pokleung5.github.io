import en from '@/translations/en.json';

export const translations = {
  en
} as const;

export type Locale = keyof typeof translations;
export type TranslationSchema = (typeof translations)[Locale];

export function getTranslations(locale: Locale = 'en'): TranslationSchema {
  return translations[locale] ?? translations.en;
}
