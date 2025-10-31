'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/molecules';
import { fadeInUp, staggerChildren } from '@/lib/animations';
import { fetchLocalizedJson } from '@/lib/data';
import { getTranslations, type Locale } from '@/lib/i18n';
import type { ImpactHighlight, ImpactHighlightsCopy } from '@/lib/types';

type ImpactHighlightsProps = {
  locale?: Locale;
};

export function ImpactHighlights({ locale = 'en' }: ImpactHighlightsProps = {}) {
  const impactCopy = useMemo(
    () => getTranslations(locale).impactHighlights as ImpactHighlightsCopy,
    [locale]
  );
  const [highlights, setHighlights] = useState<ImpactHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadHighlights = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const payload = await fetchLocalizedJson<ImpactHighlight[]>('impact-highlights.json', locale);
        if (!cancelled) {
          setHighlights(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError(impactCopy.error);
        }
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load impact highlights', err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadHighlights();

    return () => {
      cancelled = true;
    };
  }, [impactCopy, locale]);

  if (isLoading) {
    return <ImpactHighlightsSkeleton />;
  }

  if (error) {
    return <ImpactHighlightsSkeleton message={error} />;
  }

  return (
    <section id="impact" className="py-4">
      <motion.div
        className="text-center"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <SectionHeader
          align="center"
          eyebrow={impactCopy.eyebrow}
          title={impactCopy.title}
          titleProps={{ className: 'mt-4' }}
          description={impactCopy.description}
          descriptionProps={{ className: 'mx-auto mt-3 max-w-2xl' }}
        />
      </motion.div>

      <motion.ul
        className="mt-8 grid gap-8 sm:mt-12 sm:gap-10 md:grid-cols-3"
        variants={staggerChildren}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        {highlights.map((highlight) => (
          <motion.li
            key={highlight.metric}
            variants={fadeInUp}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-left shadow-[0_30px_60px_-45px_rgba(0,0,0,0.65)] backdrop-blur sm:rounded-3xl sm:p-8"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,52,52,0.45),_transparent_72%)] opacity-70" />
            <div className="relative z-10 flex h-full flex-col gap-4 sm:gap-5">
              <p className="text-[0.7rem] uppercase tracking-[0.28em] text-foreground/40 sm:text-xs sm:tracking-[0.32em]">
                {highlight.label}
              </p>
              <p className="text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl">{highlight.metric}</p>
              <p className="text-sm text-foreground/70 sm:text-foreground/75 sm:text-base">{highlight.description}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

function ImpactHighlightsSkeleton({ message }: { message?: string } = {}) {
  return (
    <section id="impact" className="py-4">
      <div className="text-center">
        <div className="mx-auto mb-6 h-4 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="mx-auto mb-4 h-8 w-72 animate-pulse rounded-full bg-white/5" />
        <div className="mx-auto h-16 w-full max-w-2xl animate-pulse rounded-3xl bg-white/5" />
      </div>
      <div className="mt-8 grid gap-8 sm:mt-12 sm:gap-10 md:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
          >
            <div className="flex h-full flex-col gap-4">
              <span className="h-3 w-24 animate-pulse rounded-full bg-white/10" />
              <span className="h-8 w-32 animate-pulse rounded-full bg-white/10" />
              <span className="h-20 w-full animate-pulse rounded-3xl bg-white/5" />
            </div>
          </div>
        ))}
      </div>
      {message ? <p className="mt-6 text-center text-xs text-foreground/50">{message}</p> : null}
    </section>
  );
}
