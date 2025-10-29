'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/molecules';
import type { ImpactHighlight } from '@/lib/types';
import { fadeInUp, staggerChildren } from '@/lib/animations';

export function ImpactHighlights() {
  const [highlights, setHighlights] = useState<ImpactHighlight[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadHighlights = async () => {
      try {
        const response = await fetch('data/impact-highlights.json');
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const payload = (await response.json()) as ImpactHighlight[];
        if (isMounted) {
          setHighlights(payload);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load impact highlights', error);
        }
      }
    };

    loadHighlights();

    return () => {
      isMounted = false;
    };
  }, []);

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
          eyebrow="Impact Snapshots"
          title="Metrics that tell the delivery story."
          titleProps={{ className: 'mt-4' }}
          description="Highlights from commerce launches and product leadership—pulled from partner retros, revenue reports, and team feedback loops."
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
