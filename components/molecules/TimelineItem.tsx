import { motion } from 'framer-motion';
import { ExperienceCard } from './ExperienceCard';
import type { Experience } from '@/lib/types';
import { fadeInUp } from '@/lib/animations';

type TimelineItemProps = {
  experience: Experience;
  displayIndex: number;
  id: string;
};

export function TimelineItem({ experience, displayIndex, id }: TimelineItemProps) {
  return (
    <motion.article
      key={id}
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="grid gap-6 sm:grid-cols-[60px_minmax(0,1fr)] sm:items-start"
    >
      <div className="relative flex flex-col gap-3 text-xs uppercase tracking-[0.28em] text-foreground/45">
        <span className="text-foreground/70">0{displayIndex + 1}</span>
      </div>
      <ExperienceCard experience={experience} />
    </motion.article>
  );
}
