'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Project } from '@/lib/types';

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const tags = useMemo(
    () => Array.from(new Set([project.category, ...project.technologies])),
    [project.category, project.technologies]
  );
  const technologiesKey = useMemo(() => project.technologies.join('|'), [project.technologies]);
  const collapsedCount = 3;
  const [showAllTags, setShowAllTags] = useState(false);
  const hasHiddenTags = tags.length > collapsedCount;
  const displayedTags = showAllTags || !hasHiddenTags ? tags : tags.slice(0, collapsedCount);

  useEffect(() => {
    setShowAllTags(false);
  }, [project.name, project.category, technologiesKey]);

  return (
    <li className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-background/85 p-6 text-left shadow-[0_28px_60px_-45px_rgba(0,0,0,0.7)] transition hover:border-foreground/20 hover:shadow-[0_38px_80px_-50px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_75%)]" />
        <div className="absolute -inset-px bg-[conic-gradient(from_120deg,_rgba(32,32,32,0.18),_transparent_70%)] mix-blend-screen" />
      </div>
      <div className="relative z-10 flex h-full flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground sm:text-2xl">{project.name}</h3>
              <p className="mt-2 text-sm font-medium text-foreground/70">{project.tagline}</p>
            </div>
          </div>
          <div className="flex flex-col gap-5 overflow-hidden border-t border-white/10 pt-4">
            <p className="text-sm leading-relaxed text-foreground/60">{project.description}</p>
            <div className="flex flex-wrap gap-2 text-xs text-foreground/55">
              {displayedTags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 uppercase tracking-[0.22em]">
                  {tag}
                </span>
              ))}
              {hasHiddenTags && (
                <button
                  type="button"
                  onClick={() => setShowAllTags((prev) => !prev)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 uppercase tracking-[0.22em] text-foreground/55 transition hover:border-foreground/40 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/35"
                  aria-expanded={showAllTags}
                >
                  {showAllTags ? 'Show Less' : `Show All (${tags.length - collapsedCount})`}
                </button>
              )}
            </div>
            <div className="border-t border-white/10 pt-4 text-sm text-foreground/70">
              <span className="block text-xs uppercase tracking-[0.28em] text-foreground/40">Outcome</span>
              <p className="mt-2 leading-relaxed">{project.highlight}</p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
