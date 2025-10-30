'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, TimelineControls, TimelineItem } from '@/components/molecules';
import { staggerChildren } from '@/lib/animations';
import { fetchLocalizedJson } from '@/lib/data';
import { getTranslations, type Locale } from '@/lib/i18n';
import type { Experience } from '@/lib/types';

type TimelineProps = {
  locale?: Locale;
  experiences?: Experience[];
};

export function Timeline({ locale = 'en', experiences: initialExperiences }: TimelineProps = {}) {
  const timelineCopy = useMemo(() => getTranslations(locale).timeline, [locale]);
  const hasInitialData = Boolean(initialExperiences && initialExperiences.length > 0);
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences ?? []);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoading, setIsLoading] = useState(!hasInitialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hasInitialData) {
      return;
    }

    let cancelled = false;

    const loadExperiences = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const payload = await fetchLocalizedJson<Experience[]>('experiences.json', locale);
        if (!cancelled) {
          setExperiences(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError(timelineCopy.error);
        }
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load experiences', err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadExperiences();

    return () => {
      cancelled = true;
    };
  }, [hasInitialData, locale, timelineCopy]);

  const experienceItems = useMemo(
    () =>
      experiences.map((experience, index) => ({
        id: `${experience.company}-${index}`,
        experience,
        displayIndex: index
      })),
    [experiences]
  );

  if (isLoading) {
    return <TimelineSkeleton />;
  }

  if (error) {
    return <TimelineSkeleton message={error} />;
  }

  return (
    <section id="about">
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-8">
        <SectionHeader
          as="div"
          title={timelineCopy.title}
          titleProps={{ variant: 'gradient' }}
          description={timelineCopy.description}
          descriptionProps={{ size: 'md', className: 'mt-3 max-w-2xl' }}
        />
        <span className="text-sm uppercase tracking-[0.3em] text-foreground/40">{timelineCopy.tagline}</span>
      </div>

      <motion.div
        className="relative"
        variants={staggerChildren}
        initial="hidden"
        animate="show"
      >
        <span className="pointer-events-none absolute left-[calc(30px)] top-0 hidden h-full w-px bg-gradient-to-b from-transparent via-foreground/10 to-transparent sm:block" />
        <div className="flex flex-col gap-12">
          {experienceItems.slice(0, visibleCount).map(({ id, experience, displayIndex }) => (
            <TimelineItem key={id} id={id} experience={experience} displayIndex={displayIndex} />
          ))}
        </div>

        <TimelineControls
          visibleCount={visibleCount}
          totalCount={experiences.length}
          onShowMore={() => setVisibleCount((count) => Math.min(count + 3, experiences.length))}
          onCollapse={() => setVisibleCount(3)}
          labels={{ showMore: timelineCopy.showMore, collapse: timelineCopy.collapse }}
        />
      </motion.div>
    </section>
  );
}

function TimelineSkeleton({ message }: { message?: string } = {}) {
  return (
    <section id="about">
      <div className="mb-12 space-y-4 border-b border-white/10 pb-8">
        <div className="h-8 w-72 animate-pulse rounded-full bg-white/10" />
        <div className="h-12 w-full max-w-2xl animate-pulse rounded-3xl bg-white/5" />
      </div>
      <div className="flex flex-col gap-10">
        {[...Array(3)].map((_, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 animate-pulse"
          >
            <div className="h-6 w-1/3 rounded-full bg-white/10" />
            <div className="mt-4 h-20 rounded-3xl bg-white/5" />
          </div>
        ))}
      </div>
      {message ? <p className="mt-6 text-center text-xs text-foreground/50">{message}</p> : null}
    </section>
  );
}
