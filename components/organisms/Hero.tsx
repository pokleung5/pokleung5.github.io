'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { AnimatedBackground } from '@/components/molecules';
import { fadeInUp, staggerChildren } from '@/lib/animations';
import { fetchLocalizedJson } from '@/lib/data';
import { getTranslations, type Locale } from '@/lib/i18n';
import type { Project } from '@/lib/types';

type HeroProps = {
  locale?: Locale;
};

type HeroCopy = {
  name: string;
  headline: string;
  summary: string;
  ctaProjects: string;
  ctaContact: string;
  scrollPrompt: string;
  error: string;
};

export function Hero({ locale = 'en' }: HeroProps = {}) {
  const heroCopy = useMemo(() => getTranslations(locale).hero as HeroCopy, [locale]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const payload = await fetchLocalizedJson<Project[]>('projects.json', locale);
        if (!cancelled) {
          setProjects(payload);
        }
      } catch (err) {
        if (!cancelled) {
          setError(heroCopy.error);
        }
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load projects', err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      cancelled = true;
    };
  }, [heroCopy, locale]);

  const skillAnimation = useMemo(
    () => ({
      fadeIn: 1,
      visible: 5,
      fadeOut: 1,
      spawnInterval: 1000,
      maxVisible: 3
    }),
    []
  );
  const totalSkillDuration = useMemo(
    () => (skillAnimation.fadeIn + skillAnimation.visible + skillAnimation.fadeOut) * 1000,
    [skillAnimation]
  );
  const heroSkills = useMemo(() => {
    const seen = new Set<string>();
    const technologies: string[] = [];

    for (const project of projects) {
      for (const technology of project.technologies ?? []) {
        const value = technology.trim();
        if (value && !seen.has(value)) {
          seen.add(value);
          technologies.push(value);
        }
      }
    }

    return technologies.slice(0, 8);
  }, [projects]);
  const randomPosition = useCallback(() => {
    const style: Record<string, string> = {};
    if (Math.random() > 0.5) {
      style.top = `${Math.round(Math.random() * 45 + 8)}%`;
    } else {
      style.bottom = `${Math.round(Math.random() * 45 + 8)}%`;
    }
    if (Math.random() > 0.5) {
      style.left = `${Math.round(Math.random() * 45 + 5)}%`;
    } else {
      style.right = `${Math.round(Math.random() * 45 + 5)}%`;
    }
    return style;
  }, []);

  type SkillInstance = {
    label: string;
    style: Record<string, string>;
    key: string;
    expiresAt: number;
  };

  const [activeSkills, setActiveSkills] = useState<SkillInstance[]>([]);

  useEffect(() => {
    if (heroSkills.length === 0) {
      return;
    }
    let iteration = 0;
    let cancelled = false;

    const spawnSkill = () => {
      if (cancelled) {
        return;
      }
      setActiveSkills((prev) => {
        const now = performance.now();
        const filtered = prev.filter((instance) => instance.expiresAt > now);
        const available = heroSkills.filter(
          (skill) => !filtered.some((instance) => instance.label === skill)
        );
        const nextLabel =
          available[Math.floor(Math.random() * available.length)] ??
          heroSkills[Math.floor(Math.random() * heroSkills.length)];
        const nextInstance: SkillInstance = {
          label: nextLabel,
          style: randomPosition(),
          key: `${nextLabel}-${iteration++}-${now}`,
          expiresAt: now + totalSkillDuration
        };
        const updated = [...filtered, nextInstance];
        if (updated.length > skillAnimation.maxVisible) {
          updated.sort((a, b) => a.expiresAt - b.expiresAt);
          return updated.slice(updated.length - skillAnimation.maxVisible);
        }
        return updated;
      });
    };

    const cleanupExpired = () => {
      if (cancelled) {
        return;
      }
      const now = performance.now();
      setActiveSkills((prev) => prev.filter((instance) => instance.expiresAt > now));
    };

    spawnSkill();
    const spawnTimer = setInterval(spawnSkill, skillAnimation.spawnInterval);
    const cleanupTimer = setInterval(cleanupExpired, skillAnimation.spawnInterval / 2);

    return () => {
      cancelled = true;
      clearInterval(spawnTimer);
      clearInterval(cleanupTimer);
    };
  }, [heroSkills, randomPosition, skillAnimation.maxVisible, skillAnimation.spawnInterval, totalSkillDuration]);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.6 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    let frame = 0;
    let pointerAttached = false;

    const handleMove = (event: PointerEvent) => {
      if (frame !== 0) {
        cancelAnimationFrame(frame);
      }

      frame = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;
        mouseX.set(event.clientX / innerWidth);
        mouseY.set(event.clientY / innerHeight);
        frame = 0;
      });
    };

    const attachPointer = () => {
      if (pointerAttached) {
        return;
      }
      window.addEventListener('pointermove', handleMove, { passive: true });
      pointerAttached = true;
    };

    let loadHandler: (() => void) | null = null;

    if (document.readyState === 'complete') {
      attachPointer();
    } else {
      loadHandler = () => {
        attachPointer();
        if (loadHandler) {
          window.removeEventListener('load', loadHandler);
        }
      };
      window.addEventListener('load', loadHandler);
    }

    return () => {
      if (frame !== 0) {
        cancelAnimationFrame(frame);
      }
      if (pointerAttached) {
        window.removeEventListener('pointermove', handleMove);
      }
      if (loadHandler) {
        window.removeEventListener('load', loadHandler);
      }
    };
  }, [mouseX, mouseY]);

  const gradientX = useTransform(springX, (latest) => `${latest * 100}%`);
  const gradientY = useTransform(springY, (latest) => `${latest * 100}%`);
  const highlight = useMotionTemplate`radial-gradient(620px circle at ${gradientX} ${gradientY}, rgba(48,48,48,0.35), transparent 65%)`;
  const textParallaxX = useTransform(springX, [0, 1], [-12, 12]);
  const textParallaxY = useTransform(springY, [0, 1], [-6, 6]);
  const subtextParallaxX = useTransform(springX, [0, 1], [-8, 8]);
  const subtextParallaxY = useTransform(springY, [0, 1], [-4, 4]);

  if (isLoading || error) {
    return <HeroSkeleton message={error ?? undefined} />;
  }

  return (
    <section data-full-width className="relative flex min-h-[100vh] w-full flex-col justify-center overflow-hidden pb-24 pt-32">
      <AnimatedBackground />
      <div className="pointer-events-none absolute inset-0 -z-5">
        <AnimatePresence>
          {activeSkills.map((skill) => (
            <motion.span
              key={skill.key}
              className="absolute rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.35em] text-foreground/50 backdrop-blur"
              style={skill.style}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 0.45, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92, transition: { duration: skillAnimation.fadeOut, ease: 'easeInOut' } }}
              transition={{
                duration: skillAnimation.fadeIn,
                ease: 'easeInOut'
              }}
            >
              {skill.label}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: highlight }}
      />
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 text-center sm:gap-10 sm:px-8"
        variants={staggerChildren}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          className="text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl"
          variants={fadeInUp}
          style={{ translateX: textParallaxX, translateY: textParallaxY }}
        >
          {heroCopy.name}
        </motion.h1>
        <motion.p
          className="gradient-text text-3xl font-semibold leading-[1.25] sm:text-4xl lg:text-5xl lg:leading-[1.2]"
          variants={fadeInUp}
          style={{ translateX: subtextParallaxX, translateY: subtextParallaxY }}
        >
          {heroCopy.headline}
        </motion.p>
        <motion.p
          className="mx-auto max-w-3xl text-lg text-foreground/80 sm:text-xl"
          variants={fadeInUp}
        >
          {heroCopy.summary}
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeInUp}>
          <Link
            href="#projects"
            className="rounded-full border border-foreground/15 bg-transparent px-6 py-3 text-sm font-semibold text-foreground/70 transition hover:border-foreground/50 hover:text-foreground"
          >
            {heroCopy.ctaProjects}
          </Link>
          <Link
            href="#contact"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-[0_25px_45px_-25px_rgba(255,255,255,0.55)] transition hover:scale-[1.03]"
          >
            {heroCopy.ctaContact}
          </Link>
        </motion.div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-10 hidden justify-center sm:flex"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-foreground/40">
          <span className="h-[1px] w-12 bg-foreground/20" />
          {heroCopy.scrollPrompt}
          <span className="h-[1px] w-12 bg-foreground/20" />
        </div>
      </motion.div>
    </section>
  );
}

function HeroSkeleton({ message }: { message?: string } = {}) {
  return (
    <section data-full-width className="relative flex min-h-[100vh] w-full flex-col justify-center overflow-hidden pb-24 pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(76,139,245,0.12),_transparent_65%)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 text-center sm:px-8">
        <span className="mx-auto h-8 w-48 animate-pulse rounded-full bg-white/10" />
        <span className="mx-auto h-10 w-80 animate-pulse rounded-full bg-white/10 sm:h-12 sm:w-[28rem]" />
        <span className="mx-auto h-16 w-full max-w-2xl animate-pulse rounded-3xl bg-white/5" />
        <div className="mx-auto flex gap-4">
          <span className="h-11 w-32 animate-pulse rounded-full bg-white/10" />
          <span className="h-11 w-32 animate-pulse rounded-full bg-white/10" />
        </div>
        {message ? <p className="mx-auto max-w-md text-xs text-foreground/50">{message}</p> : null}
      </div>
    </section>
  );
}
