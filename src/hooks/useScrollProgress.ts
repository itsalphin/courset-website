'use client';

import { useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';

export function useScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  return { ref, scrollYProgress };
}

export function useParallax(value: MotionValue<number>, distance: number = 50) {
  return useTransform(value, [0, 1], [-distance, distance]);
}
