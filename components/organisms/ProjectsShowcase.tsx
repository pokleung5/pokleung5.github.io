'use client';

import { useEffect, useMemo, useState } from 'react';

import { ProjectCarousel, ProjectFilters, SectionHeader } from '@/components/molecules';
import { fetchLocalizedJson } from '@/lib/data';
import { getTranslations, type Locale } from '@/lib/i18n';
import type { Project, ProjectFilter, ProjectsShowcaseCopy } from '@/lib/types';

type ProjectsShowcaseProps = {
  locale?: Locale;
};

export function ProjectsShowcase({ locale = 'en' }: ProjectsShowcaseProps = {}) {
  const projectsCopy = useMemo(
    () => getTranslations(locale).projectsShowcase as ProjectsShowcaseCopy,
    [locale]
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const payload = await fetchLocalizedJson<Project[]>('projects.json', locale);
        if (!cancelled) {
          setProjects(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError(projectsCopy.error);
        }
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load projects', err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, [locale, projectsCopy]);

  const filters = useMemo<ProjectFilter[]>(() => {
    const categories = Array.from(new Set(projects.map((project) => project.category))) as ProjectFilter[];
    return ['All', ...categories];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    const scoped =
      activeFilter === 'All'
        ? projects
        : projects.filter((project) => project.category === activeFilter);
    return scoped;
  }, [activeFilter, projects]);

  if (isLoading) {
    return <ProjectsShowcaseSkeleton />;
  }

  if (error) {
    return <ProjectsShowcaseSkeleton message={error} />;
  }

  const hasProjects = filteredProjects.length > 0;

  return (
    <section id="projects" className="relative">
      <div className="mb-10 space-y-6 border-b border-white/10 pb-8">
        <SectionHeader
          as="div"
          className="space-y-4"
          title={projectsCopy.title}
          titleProps={{ variant: 'gradient' }}
          description={projectsCopy.description}
          descriptionProps={{ size: 'md' }}
        />
        <ProjectFilters activeFilter={activeFilter} filters={filters} onFilterChange={setActiveFilter} />
      </div>

      {hasProjects ? (
        <ProjectCarousel
          itemsPerPage={2}
          projects={filteredProjects}
        />
      ) : (
        <div className="border-t border-white/10 pt-10 text-sm text-foreground/60">
          {projectsCopy.empty}
        </div>
      )}
    </section>
  );
}

function ProjectsShowcaseSkeleton({ message }: { message?: string } = {}) {
  return (
    <section id="projects" className="relative">
      <div className="mb-10 space-y-4 border-b border-white/10 pb-8">
        <div className="h-8 w-64 animate-pulse rounded-full bg-white/10" />
        <div className="h-12 w-full max-w-3xl animate-pulse rounded-3xl bg-white/5" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="h-48 rounded-3xl border border-white/10 bg-white/[0.04] animate-pulse"
          />
        ))}
      </div>
      {message ? <p className="mt-6 text-center text-xs text-foreground/50">{message}</p> : null}
    </section>
  );
}
