'use client';

import AnimatedImage from '@/components/ui/AnimatedImage';
import Reveal from '@/components/ui/Reveal';
import SectionLabel from '@/components/ui/SectionLabel';

export default function BrandStory() {
  return (
    <section id="story" className="bg-[var(--color-bg-primary)]" style={{ padding: 'var(--space-section) 0' }}>
      <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
        {/* Alternating layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center mb-20">
          {/* Text block — 7 cols */}
          <Reveal className="md:col-span-7">
            <SectionLabel>Our Story</SectionLabel>
            <h2
              className="font-[family-name:var(--font-display)] font-light italic text-[var(--color-text-primary)] mb-6"
              style={{ fontSize: 'var(--text-section-title)' }}
            >
              Beyond the Court
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[var(--text-body-lg)] text-[var(--color-text-secondary)] leading-relaxed mb-6 max-w-[55ch]">
              Pickleball isn&apos;t just a game. It&apos;s a culture, a community, a way of life.
              COURSET transforms the energy of the court into jewelry you wear, collect, and
              pass down. Every piece is a chapter in your story — crafted by hand, designed
              with intention, made to be remembered.
            </p>
            <p className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
              Crafted for 2,400+ players since 2024
            </p>
          </Reveal>

          {/* Image — 5 cols */}
          <Reveal delay={0.15} className="md:col-span-5">
            <div className="aspect-[4/5] relative overflow-hidden">
              <AnimatedImage
                src="/images/story-beyond-court.jpg"
                alt="Beyond the court — COURSET"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </Reveal>
        </div>

        {/* Second row — reversed */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Craftsmanship video — 5 cols */}
          <Reveal className="md:col-span-5 order-2 md:order-1">
            <div className="aspect-video relative overflow-hidden bg-[#1A1A1A]">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/images/story-beyond-court.jpg"
              >
                <source src="/videos/craftsmanship.mp4" type="video/mp4" />
              </video>
            </div>
          </Reveal>

          {/* Text — 7 cols */}
          <Reveal delay={0.15} className="md:col-span-7 order-1 md:order-2">
            <h3
              className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-4"
              style={{ fontSize: 'var(--text-collection-title)' }}
            >
              From Concept to Court
            </h3>
            <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-text-secondary)] leading-relaxed max-w-[55ch]">
              Every COURSET piece begins with a sketch inspired by the geometry of the game —
              the arc of a paddle, the pattern of a net, the energy of a rally. Our jewelers
              transform those lines into precious metal, hand-finishing each piece over weeks
              of meticulous work.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
