import type { ProjectFilter } from '@/lib/types';

type ProjectFiltersProps = {
  activeFilter: ProjectFilter;
  filters: ProjectFilter[];
  onFilterChange: (filter: ProjectFilter) => void;
};

export function ProjectFilters({ activeFilter, filters, onFilterChange }: ProjectFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => {
        const isActive = activeFilter === filter;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onFilterChange(filter)}
            aria-pressed={isActive}
            className={`rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition ${
              isActive
                ? 'border-foreground/50 bg-foreground/10 text-foreground'
                : 'border-white/10 bg-white/[0.04] text-foreground/60 hover:border-foreground/40 hover:text-foreground/80'
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
