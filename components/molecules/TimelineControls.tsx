type TimelineControlsProps = {
  visibleCount: number;
  totalCount: number;
  onShowMore: () => void;
  onCollapse: () => void;
  labels: {
    showMore: string;
    collapse: string;
  };
};

export function TimelineControls({ visibleCount, totalCount, onShowMore, onCollapse, labels }: TimelineControlsProps) {
  return (
    <>
      {visibleCount < totalCount && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onShowMore}
            className="rounded-full border border-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-foreground/60 transition hover:border-foreground/40 hover:text-foreground"
          >
            {labels.showMore}
          </button>
        </div>
      )}
      {visibleCount > 3 && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={onCollapse}
            className="rounded-full border border-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-foreground/60 transition hover:border-foreground/40 hover:text-foreground"
          >
            {labels.collapse}
          </button>
        </div>
      )}
    </>
  );
}
