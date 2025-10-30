import { resolvePublicPath } from '@/lib/publicPath';
import type { Locale } from '@/lib/i18n';

export async function fetchLocalizedJson<T>(file: string, locale: Locale = 'en'): Promise<T> {
  const localesToTry = locale === 'en' ? ['en'] : [locale, 'en'];

  for (const attemptLocale of localesToTry) {
    try {
      const response = await fetch(resolvePublicPath(`data/${attemptLocale}/${file}`));
      if (response.ok) {
        return (await response.json()) as T;
      }

      if (response.status !== 404) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Failed loading ${file} for locale ${attemptLocale}`, error);
      }
    }
  }

  throw new Error(`Unable to load ${file} for locale ${locale}`);
}
