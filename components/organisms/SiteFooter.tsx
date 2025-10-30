import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';
import { getTranslations, type Locale } from '@/lib/i18n';

type SiteFooterProps = {
  locale?: Locale;
};

export function SiteFooter({ locale = 'en' }: SiteFooterProps = {}) {
  const footerCopy = getTranslations(locale).footer;
  const socialLinks = [
    { label: footerCopy.links.github, href: 'https://github.com/pokleung5', Icon: Github },
    { label: footerCopy.links.linkedin, href: 'https://www.linkedin.com/in/pokleung5/', Icon: Linkedin },
    { label: footerCopy.links.email, href: 'mailto:hello@ericleung.dev', Icon: Mail }
  ];
  const currentYear = new Date().getFullYear();
  const craftedWith = footerCopy.craftedWith.replace('{year}', String(currentYear));

  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-foreground/40">{footerCopy.label}</p>
          <p className="text-sm text-foreground/70 sm:max-w-sm">{footerCopy.tagline}</p>
        </div>
        <div className="flex items-center gap-3">
          {socialLinks.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-foreground/60 transition hover:border-foreground/40 hover:text-foreground"
            >
              <Icon className="h-5 w-5 transition group-hover:scale-105" aria-hidden="true" />
              <span className="sr-only">{label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 py-6">
        <p className="mx-auto max-w-6xl px-4 text-[0.68rem] uppercase tracking-[0.32em] text-foreground/35 sm:px-8">
          {craftedWith}
        </p>
      </div>
    </footer>
  );
}
