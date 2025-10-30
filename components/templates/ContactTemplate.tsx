import { ContactForm } from '@/components/organisms';
import type { Locale } from '@/lib/i18n';

type ContactTemplateProps = {
  heading: string;
  description: string;
  locale?: Locale;
};

export function ContactTemplate({ heading, description, locale = 'en' }: ContactTemplateProps) {
  return (
    <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 pb-24 pt-28 sm:px-8">
      <header className="mt-8 max-w-3xl">
        <h1 className="gradient-text text-4xl font-bold sm:text-5xl">{heading}</h1>
        <p className="mt-6 text-lg text-foreground/70 sm:text-xl">{description}</p>
      </header>
      <ContactForm locale={locale} />
    </main>
  );
}
