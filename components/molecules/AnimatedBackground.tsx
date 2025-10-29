'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const orbs = [
  { top: '16%', left: '8%', size: 260, hue: 'rgba(64, 64, 64, 0.26)', delay: 0 },
  { top: '68%', left: '16%', size: 180, hue: 'rgba(38, 38, 38, 0.3)', delay: 1.6 },
  { top: '28%', left: '72%', size: 240, hue: 'rgba(82, 82, 82, 0.22)', delay: 1 },
  { top: '80%', left: '66%', size: 220, hue: 'rgba(48, 48, 48, 0.28)', delay: 3.2 }
];

const auroraVariants: Variants = {
  initial: { opacity: 0.12, scale: 0.98 },
  animate: {
    opacity: [0.12, 0.2, 0.14],
    scale: [0.98, 1.02, 0.99],
    rotate: [0, 3, -2, 0],
    transition: {
      duration: 12,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

const lineVariants: Variants = {
  hidden: { opacity: 0, scaleX: 0.5 },
  show: {
    opacity: 0.35,
    scaleX: 1,
    transition: { duration: 1.4, ease: [0.19, 1, 0.22, 1] as const, delay: 0.6 }
  }
};

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,34,34,0.45),_transparent_72%)]" />
      <motion.div
        className="absolute -inset-8 rounded-[45%] bg-[conic-gradient(from_45deg,_rgba(28,28,28,0.6),rgba(5,5,5,0.8),rgba(48,48,48,0.35))] blur-3xl"
        variants={auroraVariants}
        initial="initial"
        animate="animate"
      />
      {orbs.map((orb, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full blur-3xl"
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.size,
            height: orb.size,
            background: orb.hue
          }}
          animate={{
            y: [0, 18, 0],
            x: [0, -12, 0]
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'mirror',
            duration: 14 + index * 1.5,
            ease: 'easeInOut',
            delay: orb.delay
          }}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-foreground/10 to-transparent"
        variants={lineVariants}
        initial="hidden"
        animate="show"
      />
    </div>
  );
}
