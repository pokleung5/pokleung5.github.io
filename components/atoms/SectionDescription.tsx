import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import clsx from 'clsx';

type SectionDescriptionSize = 'sm' | 'md' | 'lg';

type SectionDescriptionProps<T extends ElementType> = {
  as?: T;
  size?: SectionDescriptionSize;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

const sizeStyles: Record<SectionDescriptionSize, string> = {
  sm: 'text-sm text-foreground/70 sm:text-base',
  md: 'text-base text-foreground/70 sm:text-lg',
  lg: 'text-lg text-foreground/70 sm:text-xl'
};

export function SectionDescription<T extends ElementType = 'p'>({
  as,
  size = 'sm',
  className,
  children,
  ...rest
}: SectionDescriptionProps<T>) {
  const Component = as ?? 'p';

  return (
    <Component className={clsx(sizeStyles[size], className)} {...rest}>
      {children}
    </Component>
  );
}
