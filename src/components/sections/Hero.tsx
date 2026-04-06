'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { gsap, SplitText, ScrollTrigger, useGSAP } from '@/lib/gsap';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLParagraphElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  const [imageLoaded, setImageLoaded] = useState(false);
  const prefersReduced = useReducedMotion();

  // GSAP entrance timeline + scroll exit
  useGSAP(() => {
    if (prefersReduced || !imageLoaded) return;

    const ctx = gsap.context(() => {
      // === ENTRANCE TIMELINE ===
      const tl = gsap.timeline({ delay: 0.1 });

      // Image settle
      tl.from(imageWrapRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.8,
        ease: 'power2.out',
      }, 0);

      // Intro text
      tl.from(introRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.5,
      }, 0.2);

      // SplitText headline — characters from center
      SplitText.create(headlineRef.current!, {
        type: 'chars',
        autoSplit: true,
        onSplit(self) {
          tl.from(self.chars, {
            opacity: 0,
            y: 60,
            rotateX: -60,
            duration: 0.8,
            stagger: { amount: 0.5, from: 'center' },
            ease: 'power4.out',
          }, 0.3);
        },
      });

      // Tagline overlaps
      tl.from(taglineRef.current, {
        opacity: 0,
        y: 24,
        duration: 0.6,
      }, '-=0.3');

      // Subtext
      tl.from(subtextRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
      }, '-=0.25');

      // CTAs
      tl.from(ctaRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.5,
      }, '-=0.2');

      // Trust line
      tl.from(trustRef.current, {
        opacity: 0,
        duration: 0.4,
      }, '-=0.15');

      // Scroll indicator last
      tl.from(indicatorRef.current, {
        opacity: 0,
        y: -8,
        duration: 0.4,
      }, '-=0.1');

      // === SCROLL-SCRUBBED EXIT ===
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
        .to(headlineRef.current, { y: -50, opacity: 0, ease: 'none' }, 0)
        .to(introRef.current, { y: -30, opacity: 0, ease: 'none' }, 0)
        .to(taglineRef.current, { y: -35, opacity: 0, ease: 'none' }, 0.05)
        .to(subtextRef.current, { y: -25, opacity: 0, ease: 'none' }, 0.08)
        .to(ctaRef.current, { y: -20, opacity: 0, ease: 'none' }, 0.1)
        .to(trustRef.current, { opacity: 0, ease: 'none' }, 0.1)
        .to(indicatorRef.current, { opacity: 0, ease: 'none' }, 0)
        .to(imageWrapRef.current, { y: -80, scale: 1.08, ease: 'none' }, 0);
    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef, dependencies: [imageLoaded, prefersReduced] });

  // If reduced motion, show everything immediately
  const reducedStyle = prefersReduced ? { opacity: 1, transform: 'none' } : undefined;

  return (
    <section ref={containerRef} className="relative h-svh w-full overflow-hidden flex items-end md:items-center bg-[#2A2722]">
      {/* Background image */}
      <div ref={imageWrapRef} className="absolute inset-0" style={reducedStyle}>
        <Image
          src="/images/hero-bg.jpg"
          alt="COURSET luxury pickleball jewelry"
          fill
          sizes="100vw"
          className="object-cover object-[70%_center] md:object-center"
          priority
          quality={90}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/55 via-black/30 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-[var(--gutter)] pb-28 md:pb-0 w-full" style={{ maxWidth: 'var(--max-width)', margin: '0 auto' }}>
        <div className="max-w-2xl">
          <span
            ref={introRef}
            className="block font-[family-name:var(--font-body)] text-[0.75rem] md:text-[0.85rem] font-light uppercase tracking-[0.35em] text-white/60 mb-6"
            style={reducedStyle}
          >
            Introducing
          </span>

          <h1
            ref={headlineRef}
            className="font-[family-name:var(--font-display)] font-light tracking-[0.06em] text-white leading-[0.95]"
            style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', ...(reducedStyle || {}) }}
          >
            COURSET
          </h1>

          <p
            ref={taglineRef}
            className="mt-5 font-[family-name:var(--font-display)] italic text-xl md:text-2xl text-white/85 tracking-[0.04em]"
            style={reducedStyle}
          >
            From First Win to Legacy
          </p>

          <p
            ref={subtextRef}
            className="mt-6 font-[family-name:var(--font-body)] text-[1rem] md:text-[1.1rem] text-white/55 leading-[1.75] max-w-[42ch]"
            style={reducedStyle}
          >
            Designed for those who play with purpose — crafted to carry every victory, milestone, and memory.
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-col sm:flex-row items-start gap-4" style={reducedStyle}>
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
          </div>

          <p
            ref={trustRef}
            className="mt-6 font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.2em] text-white/35"
            style={reducedStyle}
          >
            Handcrafted in gold &middot; Personalized &middot; Made to last
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={indicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2" style={reducedStyle}>
        <div className="animate-bounce">
          <ChevronDown size={18} strokeWidth={1} className="text-white/40" />
        </div>
      </div>
    </section>
  );
}
