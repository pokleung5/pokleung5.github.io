'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/molecules';
import { fadeInUp, staggerChildren } from '@/lib/animations';
import { fetchLocalizedJson } from '@/lib/data';
import { getTranslations, type Locale } from '@/lib/i18n';
import type { Testimonial } from '@/lib/types';

type TestimonialsProps = {
  locale?: Locale;
};

export function Testimonials({ locale = 'en' }: TestimonialsProps = {}) {
  const testimonialsCopy = useMemo(() => getTranslations(locale).testimonials, [locale]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadTestimonials = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const payload = await fetchLocalizedJson<Testimonial[]>('testimonials.json', locale);
        if (!cancelled) {
          setTestimonials(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError(testimonialsCopy.error);
        }
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load testimonials', err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadTestimonials();

    return () => {
      cancelled = true;
    };
  }, [locale, testimonialsCopy]);

  if (isLoading) {
    return <TestimonialsSkeleton />;
  }

  if (error) {
    return <TestimonialsSkeleton message={error} />;
  }

  return (
    <section id="testimonials" className="max-w-6xl">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="text-center"
      >
        <SectionHeader
          align="center"
          eyebrow={testimonialsCopy.eyebrow}
          title={testimonialsCopy.title}
          titleProps={{ className: 'mt-4' }}
          description={testimonialsCopy.description}
          descriptionProps={{ className: 'mx-auto mt-3 max-w-2xl' }}
        />
      </motion.div>
      <motion.div
        className="mt-12 grid gap-6 sm:grid-cols-1"
        variants={staggerChildren}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        {testimonials.length > 0 ? (
          testimonials.map((testimonial) => (
            <motion.blockquote
              key={testimonial.name}
              variants={fadeInUp}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-8 text-left shadow-[0_30px_60px_-45px_rgba(0,0,0,0.65)] backdrop-blur"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,52,52,0.45),_transparent_72%)] opacity-70" />
              <div className="relative z-10 flex h-full flex-col gap-6">
                <p className="text-base leading-relaxed text-foreground/80">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex flex-col text-sm text-foreground/60">
                  <span className="font-semibold text-foreground">{testimonial.name}</span>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </motion.blockquote>
          ))
        ) : (
          <motion.p
            variants={fadeInUp}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-sm text-foreground/60 backdrop-blur"
          >
            {testimonialsCopy.empty}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}

function TestimonialsSkeleton({ message }: { message?: string } = {}) {
  return (
    <section id="testimonials" className="max-w-6xl">
      <div className="text-center">
        <div className="mx-auto mb-4 h-4 w-40 animate-pulse rounded-full bg-white/10" />
        <div className="mx-auto mb-4 h-8 w-72 animate-pulse rounded-full bg-white/5" />
        <div className="mx-auto h-14 w-full max-w-2xl animate-pulse rounded-3xl bg-white/5" />
      </div>
      <div className="mt-12 grid gap-6">
        {[...Array(2)].map((_, index) => (
          <div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="h-40 rounded-3xl border border-white/10 bg-white/[0.04] animate-pulse"
          />
        ))}
      </div>
      {message ? <p className="mt-6 text-center text-xs text-foreground/50">{message}</p> : null}
    </section>
  );
}
