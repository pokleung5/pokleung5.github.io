import { ChevronLeft, ChevronRight } from 'lucide-react';

type CarouselNavigationProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
};

export function CarouselNavigation({ currentPage, totalPages, onPrev, onNext }: CarouselNavigationProps) {
  if (totalPages <= 1) return null;

  return (
    <>
      <div className="absolute left-0 top-1/2 hidden w-full -translate-y-1/2 items-center justify-between px-1 sm:flex">
        <button
          onClick={onPrev}
          className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-foreground/60 transition hover:border-foreground/40 hover:text-foreground/80"
          aria-label="Previous projects"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={onNext}
          className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-foreground/60 transition hover:border-foreground/40 hover:text-foreground/80"
          aria-label="Next projects"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="mt-6 flex items-center justify-center gap-6 text-sm text-foreground/70 sm:hidden">
        <button
          onClick={onPrev}
          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-semibold uppercase tracking-[0.2em] transition hover:border-foreground/40 hover:text-foreground"
        >
          Prev
        </button>
        <span>
          {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={onNext}
          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-semibold uppercase tracking-[0.2em] transition hover:border-foreground/40 hover:text-foreground"
        >
          Next
        </button>
      </div>
      <div className="mt-4 hidden text-center text-sm text-foreground/60 sm:block">
        {currentPage + 1} / {totalPages}
      </div>
    </>
  );
}
