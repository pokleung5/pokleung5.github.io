import { Timeline } from '@/components/organisms';
import { getTranslations, type Locale } from '@/lib/i18n';
import type { Experience } from '@/lib/types';

type PhilosophySnippet = {
  title: string;
  detail: string;
};

type AboutTemplateProps = {
  experiences: Experience[];
  philosophy: PhilosophySnippet[];
  locale?: Locale;
};

export function AboutTemplate({ experiences, philosophy, locale = 'en' }: AboutTemplateProps) {
  const aboutCopy = getTranslations(locale).about;

  return (
    <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pb-24 pt-28 sm:px-8">
      <section className="mt-8 max-w-4xl">
        <h1 className="gradient-text text-4xl font-bold sm:text-5xl">{aboutCopy.title}</h1>
        <p className="mt-6 text-lg text-foreground/70 sm:text-xl">{aboutCopy.description}</p>
      </section>
      <section className="grid gap-6 sm:grid-cols-3">
        {philosophy.map((snippet) => (
          <article key={snippet.title} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold text-foreground">{snippet.title}</h2>
            <p className="mt-3 text-sm text-foreground/70">{snippet.detail}</p>
          </article>
        ))}
      </section>
      <Timeline experiences={experiences} locale={locale} />
    </main>
  );
}
