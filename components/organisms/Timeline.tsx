'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader, TimelineControls, TimelineItem } from '@/components/molecules';
import type { Experience } from '@/lib/types';
import { staggerChildren } from '@/lib/animations';

export function Timeline() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    let isMounted = true;

    const loadExperiences = async () => {
      try {
        const response = await fetch('data/experiences.json');
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const payload = (await response.json()) as Experience[];
        if (isMounted) {
          setExperiences(payload);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load experiences', error);
        }
      }
    };

    loadExperiences();

    return () => {
      isMounted = false;
    };
  }, []);

  const experienceItems = useMemo(
    () =>
      experiences.map((experience, index) => ({
        id: `${experience.company}-${index}`,
        experience,
        displayIndex: index
      })),
    [experiences]
  );

  return (
    <section id="about">
      <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-8">
        <SectionHeader
          as="div"
          title="About & Latest Chapters"
          titleProps={{ variant: 'gradient' }}
          description="Recent roles where architecture stewardship, refactoring, and team velocity came together."
          descriptionProps={{ size: 'md', className: 'mt-3 max-w-2xl' }}
        />
        <span className="text-sm uppercase tracking-[0.3em] text-foreground/40">Craft over chaos</span>
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
          <TimelineItem
            key={id}
          id={id}
          experience={experience}
          displayIndex={displayIndex}
          />
          ))}
        </div>

        <TimelineControls
        visibleCount={visibleCount}
        totalCount={experiences.length}
        onShowMore={() => setVisibleCount((count) => Math.min(count + 3, experiences.length))}
        onCollapse={() => setVisibleCount(3)}
        />
      </motion.div>
    </section>
  );
}
