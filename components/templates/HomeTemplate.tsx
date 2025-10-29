import { ContactForm, Hero, ImpactHighlights, ProjectsShowcase, SiteFooter, Testimonials, Timeline } from '@/components/organisms';

export function HomeTemplate() {
  return (
    <main className="relative flex flex-col gap-10">
      <Hero />
      <ImpactHighlights />
      <Timeline />
      <ProjectsShowcase />
      <Testimonials />
      <ContactForm />
      <SiteFooter />
    </main>
  );
}
