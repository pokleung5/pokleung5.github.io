import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

const footerLinks = [
  { label: 'GitHub', href: 'https://github.com/pokleung5', Icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pokleung5/', Icon: Linkedin },
  { label: 'Email', href: 'mailto:hello@ericleung.dev', Icon: Mail }
];

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.35em] text-foreground/40">Eric Leung</p>
          <p className="text-sm text-foreground/70 sm:max-w-sm">
            Building reliable commerce platforms through calm engineering leadership.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {footerLinks.map(({ label, href, Icon }) => (
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
          Crafted with Next.js & Tailwind · © {currentYear} Eric Leung
        </p>
      </div>
    </footer>
  );
}
