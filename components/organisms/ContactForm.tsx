'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/molecules';
import { fadeInUp, staggerChildren } from '@/lib/animations';
import { getTranslations, type Locale } from '@/lib/i18n';
import type { ContactCopy } from '@/lib/types';

type ContactFormProps = {
  locale?: Locale;
  isLoading?: boolean;
  message?: string;
};

export function ContactForm({ locale = 'en', isLoading = false, message }: ContactFormProps = {}) {
  const copy = getTranslations(locale).contact as ContactCopy;

  if (isLoading) {
    return <ContactFormSkeleton message={message} />;
  }

  return <ContactFormShell copy={copy} message={message} />;
}

type ContactFormShellProps = {
  copy: ContactCopy;
  message?: string;
};

function ContactFormShell({ copy, message }: ContactFormShellProps) {
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitted');
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <section id="contact" className="relative max-w-4xl">
      <motion.div
        className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-[0_35px_70px_-45px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="pointer-events-none absolute -inset-px rounded-[2.6rem] bg-[radial-gradient(circle_at_top,_rgba(52,52,52,0.55),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(28,28,28,0.45),_transparent_50%)] opacity-60" />
        <div className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-foreground/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-foreground/10 blur-3xl" />
        <div className="relative z-10">
          <motion.div className="mb-10 space-y-4 text-center" variants={fadeInUp}>
            <SectionHeader
              as="div"
              align="center"
              eyebrow={copy.eyebrow}
              title={copy.title}
              titleProps={{ variant: 'gradient' }}
              description={copy.description}
              descriptionProps={{ className: 'mt-4 text-base text-foreground/70 sm:text-base' }}
            />
            {message ? <p className="text-xs text-foreground/50">{message}</p> : null}
          </motion.div>
          <motion.form
            onSubmit={handleSubmit}
            className="grid gap-6"
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.label className="group relative flex flex-col" variants={fadeInUp}>
              <span className="text-sm uppercase tracking-[0.3em] text-foreground/40">{copy.nameLabel}</span>
              <input
                type="text"
                name="name"
                required
                placeholder={copy.namePlaceholder}
                className="mt-2 rounded-2xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.08)] focus:ring-4 focus:ring-foreground/10"
              />
            </motion.label>
            <motion.label className="group relative flex flex-col" variants={fadeInUp}>
              <span className="text-sm uppercase tracking-[0.3em] text-foreground/40">{copy.emailLabel}</span>
              <input
                type="email"
                name="email"
                required
                placeholder={copy.emailPlaceholder}
                className="mt-2 rounded-2xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.08)] focus:ring-4 focus:ring-foreground/10"
              />
            </motion.label>
            <motion.label className="group relative flex flex-col" variants={fadeInUp}>
              <span className="text-sm uppercase tracking-[0.3em] text-foreground/40">{copy.messageLabel}</span>
              <textarea
                name="message"
                rows={4}
                required
                placeholder={copy.messagePlaceholder}
                className="mt-2 rounded-2xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.08)] focus:ring-4 focus:ring-foreground/10"
              />
            </motion.label>
            <motion.button
              type="submit"
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 px-7 text-sm font-semibold text-background shadow-[0_25px_45px_-25px_rgba(0,0,0,0.65)] transition hover:brightness-110"
            >
              {status === 'submitted' ? copy.submittedLabel : copy.submitLabel}
            </motion.button>
            <motion.div
              role="status"
              aria-live="polite"
              variants={fadeInUp}
              className={`min-h-[1.5rem] text-sm text-foreground/70 transition-opacity ${status === 'submitted' ? 'opacity-100' : 'opacity-0'}`}
            >
              {status === 'submitted' ? copy.statusMessage : null}
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
}

function ContactFormSkeleton({ message }: { message?: string }) {
  return (
    <section id="contact" className="relative max-w-4xl">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-[0_35px_70px_-45px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute -inset-px rounded-[2.6rem] bg-[radial-gradient(circle_at_top,_rgba(52,52,52,0.55),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(28,28,28,0.45),_transparent_50%)] opacity-60" />
        <div className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-foreground/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-foreground/10 blur-3xl" />
        <div className="relative z-10">
          <div className="mb-10 space-y-4 text-center">
            <SkeletonBar className="mx-auto h-4 w-32" />
            <SkeletonBar className="mx-auto h-8 w-72 sm:w-96" />
            <SkeletonBlock lines={3} />
            {message ? <p className="text-xs text-foreground/50">{message}</p> : null}
          </div>
          <div className="grid gap-6">
            <SkeletonFormField labelWidth="w-16" fieldHeight="h-12" />
            <SkeletonFormField labelWidth="w-16" fieldHeight="h-12" />
            <SkeletonFormField labelWidth="w-24" fieldHeight="h-32" />
            <div className="flex justify-center">
              <span className="inline-flex h-12 w-48 animate-pulse rounded-full bg-white/10" aria-hidden="true" />
            </div>
            <span className="mx-auto h-4 w-64 animate-pulse rounded-full bg-white/5" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SkeletonFormField({ labelWidth, fieldHeight }: { labelWidth: string; fieldHeight: string }) {
  return (
    <div className="flex flex-col gap-2">
      <SkeletonBar className={`h-3 ${labelWidth}`} />
      <span
        className={`block w-full ${fieldHeight} animate-pulse rounded-2xl border border-white/10 bg-white/5`}
        aria-hidden="true"
      />
    </div>
  );
}

function SkeletonBar({ className }: { className?: string }) {
  return <span className={`block animate-pulse rounded-full bg-white/10 ${className ?? ''}`} aria-hidden="true" />;
}

function SkeletonBlock({ lines = 2 }: { lines?: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {Array.from({ length: lines }).map((_, index) => (
        <span
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="inline-block h-4 w-full max-w-2xl animate-pulse rounded-full bg-white/5"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
