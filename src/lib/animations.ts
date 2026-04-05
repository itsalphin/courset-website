'use client';

export const DURATION = { fast: 0.3, normal: 0.5, slow: 0.8 };
export const EASE = [0.25, 0.1, 0.25, 1.0] as const;

export const defaultTransition = {
  duration: DURATION.normal,
  ease: EASE,
};

export const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: defaultTransition,
};

export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: defaultTransition,
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -24 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: defaultTransition,
};

export const fadeInRight = {
  initial: { opacity: 0, x: 24 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: defaultTransition,
};

export const staggerChildren = (delayStep = 0.1) => ({
  transition: { staggerChildren: delayStep },
});
