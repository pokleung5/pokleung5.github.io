import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import clsx from 'clsx';
import { SectionDescription, SectionEyebrow, SectionTitle } from '@/components/atoms';

type TitleProps = Omit<ComponentPropsWithoutRef<typeof SectionTitle>, 'children'>;
type DescriptionProps = Omit<ComponentPropsWithoutRef<typeof SectionDescription>, 'children'>;

type SectionHeaderProps<T extends ElementType> = {
  as?: T;
  eyebrow?: ReactNode;
  eyebrowClassName?: string;
  title: ReactNode;
  titleProps?: TitleProps;
  description?: ReactNode;
  descriptionProps?: DescriptionProps;
  align?: 'left' | 'center';
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

export function SectionHeader<T extends ElementType = 'div'>({
  as,
  eyebrow,
  eyebrowClassName,
  title,
  titleProps,
  description,
  descriptionProps,
  align = 'left',
  className,
  ...rest
}: SectionHeaderProps<T>) {
  const Component = as ?? 'div';
  const alignmentClass = align === 'center' ? 'text-center' : 'text-left';

  return (
    <Component className={clsx(alignmentClass, className)} {...rest}>
      {eyebrow ? (
        <SectionEyebrow className={clsx(align === 'center' && 'mx-auto', eyebrowClassName)}>
          {eyebrow}
        </SectionEyebrow>
      ) : null}
      <SectionTitle {...titleProps}>{title}</SectionTitle>
      {description ? <SectionDescription {...descriptionProps}>{description}</SectionDescription> : null}
    </Component>
  );
}
