'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { EASE, DURATION } from '@/lib/animations';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
  className?: string;
}

export default function Reveal({ children, delay = 0, direction = 'up', className }: RevealProps) {
  const prefersReduced = useReducedMotion();

  const directionMap = {
    up: { y: 24, x: 0 },
    left: { x: -24, y: 0 },
    right: { x: 24, y: 0 },
  };

  const offset = directionMap[direction];

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={prefersReduced ? { duration: 0 } : { duration: DURATION.normal, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
