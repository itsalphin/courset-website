'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useRef } from 'react';
import { EASE } from '@/lib/animations';

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={ref} className="relative h-svh w-full overflow-hidden flex items-end md:items-center">
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y }}
      >
        <Image
          src="/images/hero-bg.jpg"
          alt="COURSET luxury pickleball jewelry"
          fill
          sizes="100vw"
          className="object-cover object-[70%_center] md:object-center"
          priority
          quality={85}
        />
        {/* Gradient overlay — stronger on the left for text, lighter on mobile to show model */}
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/55 via-black/30 to-black/10" />
      </motion.div>

      {/* Content — left-aligned */}
      <div className="relative z-10 px-[var(--gutter)] pb-28 md:pb-0 w-full" style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <div className="max-w-2xl">
          {/* Intro line */}
          <motion.span
            className="block font-[family-name:var(--font-body)] text-[0.75rem] md:text-[0.85rem] font-light uppercase tracking-[0.35em] text-white/60 mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          >
            Introducing
          </motion.span>

          {/* Main title */}
          <motion.h1
            className="font-[family-name:var(--font-display)] font-light tracking-[0.06em] text-white leading-[0.95]"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)' }}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
          >
            COURSET
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="mt-5 font-[family-name:var(--font-display)] italic text-xl md:text-2xl text-white/85 tracking-[0.04em]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.45 }}
          >
            From First Win to Legacy
          </motion.p>

          {/* Subtext */}
          <motion.p
            className="mt-6 font-[family-name:var(--font-body)] text-[1rem] md:text-[1.1rem] text-white/55 leading-[1.75] max-w-[42ch]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
          >
            Designed for those who play with purpose — crafted to carry every victory, milestone, and memory.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-start gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.75 }}
          >
            <a
              href="/collections"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-[var(--color-text-primary)] font-[family-name:var(--font-body)] text-[0.75rem] font-medium uppercase tracking-[0.2em] hover:bg-white/90 transition-colors cursor-pointer"
            >
              Explore Collections
            </a>
            <a
              href="/customize"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white/40 text-white font-[family-name:var(--font-body)] text-[0.75rem] font-light uppercase tracking-[0.2em] hover:border-white/70 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Customize Your Piece
            </a>
          </motion.div>

          {/* Trust line */}
          <motion.p
            className="mt-6 font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.2em] text-white/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.9 }}
          >
            Handcrafted in gold &middot; Personalized &middot; Made to last
          </motion.p>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} strokeWidth={1} className="text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
