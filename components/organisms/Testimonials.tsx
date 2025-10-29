'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/molecules';
import type { Testimonial } from '@/lib/types';
import { fadeInUp, staggerChildren } from '@/lib/animations';

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTestimonials = async () => {
      try {
        const response = await fetch('data/testimonials.json');
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const payload = (await response.json()) as Testimonial[];
        if (isMounted) {
          setTestimonials(payload);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load testimonials', error);
        }
      } finally {
        if (isMounted) {
          setHasLoaded(true);
        }
      }
    };

    loadTestimonials();

    return () => {
      isMounted = false;
    };
  }, []);

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
          eyebrow="Trusted Collaborators"
          title="Stories from leaders who ship with me."
          titleProps={{ className: 'mt-4' }}
          description="Alignment, clarity, and healthier systems—heard straight from the teams who invited me into the messy middle."
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
          hasLoaded && (
            <motion.p
              variants={fadeInUp}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-sm text-foreground/60 backdrop-blur"
            >
              Testimonials coming soon.
            </motion.p>
          )
        )}
      </motion.div>
    </section>
  );
}
