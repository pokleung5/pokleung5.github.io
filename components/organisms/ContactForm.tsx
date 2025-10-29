'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '@/components/molecules';
import { fadeInUp, staggerChildren } from '@/lib/animations';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitted');
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <section id="contact" className="relative max-w-4xl">
      <motion.div
        className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-10 shadow-[0_35px_70px_-45px_rgba(0,0,0,0.75)] backdrop-blur-2xl"
        variants={fadeInUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="pointer-events-none absolute -inset-px rounded-[2.6rem] bg-[radial-gradient(circle_at_top,_rgba(52,52,52,0.55),_transparent_55%),_radial-gradient(circle_at_bottom,_rgba(28,28,28,0.45),_transparent_50%)] opacity-60" />
        <div className="pointer-events-none absolute -left-20 top-10 h-40 w-40 rounded-full bg-foreground/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-36 w-36 rounded-full bg-foreground/10 blur-3xl" />
        <div className="relative z-10">
          <motion.div className="mb-10" variants={fadeInUp}>
            <SectionHeader
              as="div"
              title="Let&apos;s build something worth refactoring."
              titleProps={{ variant: 'gradient' }}
              description="Share the spark, the problem, or the experiment. I&apos;ll reply with architecture ideas, motion prototypes, or the refactor plan your product deserves."
              descriptionProps={{ className: 'mt-4 text-base text-foreground/70 sm:text-base' }}
            />
          </motion.div>
          <motion.form
            onSubmit={handleSubmit}
            className="grid gap-6"
            variants={staggerChildren}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.label className="group relative flex flex-col" variants={fadeInUp}>
              <span className="text-sm uppercase tracking-[0.3em] text-foreground/40">Name</span>
              <input
                type="text"
                name="name"
                required
                placeholder="Who am I vibing with?"
                className="mt-2 rounded-2xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.08)] focus:ring-4 focus:ring-foreground/10"
              />
            </motion.label>
            <motion.label className="group relative flex flex-col" variants={fadeInUp}>
              <span className="text-sm uppercase tracking-[0.3em] text-foreground/40">Email</span>
              <input
                type="email"
                name="email"
                required
                placeholder="Where should I reply?"
                className="mt-2 rounded-2xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.08)] focus:ring-4 focus:ring-foreground/10"
              />
            </motion.label>
            <motion.label className="group relative flex flex-col" variants={fadeInUp}>
              <span className="text-sm uppercase tracking-[0.3em] text-foreground/40">Project Details</span>
              <textarea
                name="message"
                rows={4}
                required
                placeholder="What are we refactoring, reinventing, or exploring?"
                className="mt-2 rounded-2xl border border-white/10 bg-background/80 px-4 py-3 text-sm text-foreground outline-none transition focus:border-foreground/40 focus:shadow-[0_0_0_2px_rgba(255,255,255,0.08)] focus:ring-4 focus:ring-foreground/10"
              />
            </motion.label>
            <motion.button
              type="submit"
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 px-7 py-3 text-sm font-semibold text-background shadow-[0_25px_45px_-25px_rgba(0,0,0,0.65)] transition hover:brightness-110"
            >
              {status === 'submitted' ? 'Message sent — talk soon!' : "Send Eric a message"}
            </motion.button>
            <motion.div
              role="status"
              aria-live="polite"
              variants={fadeInUp}
              className={`text-sm text-foreground/70 transition-opacity ${status === 'submitted' ? 'opacity-100' : 'opacity-0'}`}
            >
              I typically reply within two business days. You can also drop me a note at hello@ericleung.dev.
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
}
