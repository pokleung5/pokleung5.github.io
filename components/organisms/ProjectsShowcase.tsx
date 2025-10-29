'use client';

import { useEffect, useMemo, useState } from 'react';

import { ProjectCarousel, ProjectFilters, SectionHeader } from '@/components/molecules';
import type { Project, ProjectFilter } from '@/lib/types';

export function ProjectsShowcase() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>('All');

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const response = await fetch('data/projects.json');
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const payload = (await response.json()) as Project[];
        if (isMounted) {
          setProjects(payload);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load projects', error);
        }
      } finally {
        if (isMounted) {
          setHasLoaded(true);
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const hasProjects = filteredProjects.length > 0;

  return (
    <section id="projects" className="relative">
      <div className="mb-10 space-y-6 border-b border-white/10 pb-8">
        <SectionHeader
          as="div"
          className="space-y-4"
          title="Projects in Motion"
          titleProps={{ variant: 'gradient' }}
          description="Recent launches across commerce, platform engineering, and product operations where I paired code with delivery leadership."
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
          {hasLoaded ? 'No case studies in this category yet—reach out to hear about related work.' : 'Loading projects…'}
        </div>
      )}
    </section>
  );
}
