'use client';

import { useCallback, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Experience } from '@/lib/types';

type ExperienceCardProps = {
  experience: Experience;
};

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleKeyToggle = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleExpanded();
      }
    },
    [toggleExpanded]
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-background/85 p-6 shadow-[0_25px_55px_-45px_rgba(0,0,0,0.65)] backdrop-blur">
      <div
        className="group flex cursor-pointer flex-col gap-4 outline-none"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={toggleExpanded}
        onKeyDown={handleKeyToggle}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">{experience.title}</h3>
            <div className="mt-2 flex flex-col gap-1 text-xs uppercase tracking-[0.28em] text-foreground/60 mb-4">
              <span>{experience.company}</span>
              <span className="text-foreground/40">{experience.period}</span>
            </div>
            <p className="mt-2 text-sm text-foreground/70">{experience.description}</p>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col gap-4 overflow-hidden border-t border-white/10 pt-4"
            >
              <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-foreground/10 via-background to-background px-4 py-3">
                <span className="text-[0.68rem] uppercase tracking-[0.32em] text-foreground/60">Focus</span>
                <p className="mt-2 text-sm font-medium text-foreground/85">{experience.focus}</p>
              </div>
              <ul className="grid gap-3 text-sm text-foreground/70">
                {experience.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-3">
                    <span className="mt-[6px] h-2 w-2 flex-shrink-0 rounded-full bg-foreground/40" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2 mt-4 text-xs uppercase tracking-[0.25em] text-foreground/50">
                {experience.tools.map((tool) => (
                  <span key={tool} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    {tool}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
