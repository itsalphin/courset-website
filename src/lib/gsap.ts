'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const RECIPROCAL_GR = 1 / GOLDEN_RATIO;

export const GSAP_DEFAULTS = {
  duration: RECIPROCAL_GR,
  ease: 'power3.out',
};

gsap.defaults({
  duration: GSAP_DEFAULTS.duration,
  ease: GSAP_DEFAULTS.ease,
});

gsap.config({
  autoSleep: 60,
  nullTargetWarn: false,
});

export { gsap, ScrollTrigger, SplitText, useGSAP };
