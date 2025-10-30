import { ContactForm, Hero, ImpactHighlights, ProjectsShowcase, SiteFooter, Testimonials, Timeline } from '@/components/organisms';
import type { Locale } from '@/lib/i18n';

type HomeTemplateProps = {
  locale?: Locale;
};

export function HomeTemplate({ locale = 'en' }: HomeTemplateProps = {}) {
  return (
    <main className="relative flex flex-col gap-10">
      <Hero locale={locale} />
      <ImpactHighlights locale={locale} />
      <Timeline locale={locale} />
      <ProjectsShowcase locale={locale} />
      <Testimonials locale={locale} />
      <ContactForm locale={locale} />
      <SiteFooter locale={locale} />
    </main>
  );
}
