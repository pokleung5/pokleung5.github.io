import en from '@/translations/en.json';

type FlatTranslationMap = Record<string, string>;
type TranslationNode = { [key: string]: string | TranslationNode };

function expandFlatMap(flatMap: FlatTranslationMap): TranslationNode {
  return Object.entries(flatMap).reduce<TranslationNode>((accumulator, [key, value]) => {
    const segments = key.split('.');
    let cursor: TranslationNode = accumulator;

    segments.forEach((segment, index) => {
      if (index === segments.length - 1) {
        cursor[segment] = value;
        return;
      }

      if (typeof cursor[segment] !== 'object' || cursor[segment] === null) {
        cursor[segment] = {};
      }

      cursor = cursor[segment] as TranslationNode;
    });

    return accumulator;
  }, {});
}

const flattenedTranslations = {
  en: expandFlatMap(en as FlatTranslationMap)
} as const;

export type Locale = keyof typeof flattenedTranslations;
export type TranslationSchema = (typeof flattenedTranslations)[Locale];

export const translations = flattenedTranslations;

export function getTranslations(locale: Locale = 'en'): TranslationSchema {
  return translations[locale] ?? translations.en;
}
