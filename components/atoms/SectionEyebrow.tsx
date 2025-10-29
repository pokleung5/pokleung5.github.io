import { ReactNode } from 'react';
import clsx from 'clsx';

type SectionEyebrowProps = {
  children: ReactNode;
  className?: string;
};

export function SectionEyebrow({ children, className }: SectionEyebrowProps) {
  return (
    <span className={clsx('text-xs uppercase tracking-[0.4em] text-foreground/40', className)}>
      {children}
    </span>
  );
}
