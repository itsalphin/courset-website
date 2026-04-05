'use client';

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';
import { defaultTransition } from '@/lib/animations';

export function useMotionSafe() {
  const prefersReduced = useFramerReducedMotion();
  return {
    shouldAnimate: !prefersReduced,
    transition: prefersReduced ? { duration: 0 } : defaultTransition,
  };
}
