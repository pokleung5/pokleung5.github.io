'use client';

import { useState, useEffect } from 'react';
import type { Project } from '@/lib/types';
import { CarouselNavigation } from './CarouselNavigation';
import { ProjectCard } from './ProjectCard';

type ProjectCarouselProps = {
  projects: Project[];
  itemsPerPage?: number;
};

export function ProjectCarousel({ projects, itemsPerPage = 4 }: ProjectCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(0);
  }, [projects]); // Reset when projects change

  const handlePrev = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  const handleNext = () => setCurrentPage((prev) => (prev + 1) % totalPages);

  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto">
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 auto-rows-fr">
          {currentProjects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </ul>
      </div>
      <CarouselNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
