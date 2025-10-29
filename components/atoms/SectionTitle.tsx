import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import clsx from 'clsx';

type SectionTitleSize = 'md' | 'lg' | 'xl';
type SectionTitleVariant = 'default' | 'gradient';

type SectionTitleProps<T extends ElementType> = {
  as?: T;
  size?: SectionTitleSize;
  variant?: SectionTitleVariant;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

const sizeStyles: Record<SectionTitleSize, string> = {
  md: 'text-3xl font-bold sm:text-4xl',
  lg: 'text-4xl font-bold sm:text-5xl',
  xl: 'text-5xl font-bold sm:text-[3.75rem]'
};

const variantStyles: Record<SectionTitleVariant, string> = {
  default: 'text-foreground',
  gradient: 'gradient-text'
};

export function SectionTitle<T extends ElementType = 'h2'>({
  as,
  size = 'md',
  variant = 'default',
  className,
  children,
  ...rest
}: SectionTitleProps<T>) {
  const Component = as ?? 'h2';

  return (
    <Component className={clsx(sizeStyles[size], variantStyles[variant], className)} {...rest}>
      {children}
    </Component>
  );
}
