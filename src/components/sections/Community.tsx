'use client';

import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import SectionLabel from '@/components/ui/SectionLabel';

const testimonials = [
  {
    quote: 'I wear my Rally Bracelet to every tournament. It\u2019s become part of who I am on the court.',
    name: 'Sarah M.',
    descriptor: 'Tournament Player',
  },
  {
    quote: 'The craftsmanship is extraordinary. This isn\u2019t sports merch \u2014 it\u2019s heirloom jewelry.',
    name: 'James K.',
    descriptor: 'Collector',
  },
  {
    quote: 'My husband\u2019s Championship Ring was the perfect anniversary gift. The virtual consultation made it effortless.',
    name: 'Priya R.',
    descriptor: 'Gift Buyer',
  },
];

const communityImages = [
  { src: '/images/community-1.jpg', aspect: 'aspect-square' },
  { src: '/images/community-2.jpg', aspect: 'aspect-[4/5]' },
  { src: '/images/community-3.jpg', aspect: 'aspect-[3/4]' },
  { src: '/images/community-4.jpg', aspect: 'aspect-square' },
  { src: '/images/community-5.jpg', aspect: 'aspect-[4/5]' },
  { src: '/images/community-6.jpg', aspect: 'aspect-square' },
  { src: '/images/community-7.jpg', aspect: 'aspect-[3/4]' },
  { src: '/images/community-8.jpg', aspect: 'aspect-[4/5]' },
];

export default function Community() {
  return (
    <section className="bg-[var(--color-bg-secondary)]" style={{ padding: 'var(--space-section) 0' }}>
      <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
        <Reveal>
          <SectionLabel>The COURSET Community</SectionLabel>
          <h2
            className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-3"
            style={{ fontSize: 'var(--text-section-title)' }}
          >
            Worn by Players Who Play to Win
          </h2>
          <div className="flex items-center gap-2 mb-12">
            <span className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
              4.9
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-accent)" className="shrink-0">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
            <span className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
              from 340 collectors
            </span>
          </div>
        </Reveal>

        {/* Image grid */}
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16">
            {communityImages.map((img, i) => (
              <div key={i} className={`${img.aspect} relative overflow-hidden`}>
                <Image
                  src={img.src}
                  alt={`COURSET community ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                />
              </div>
            ))}
          </div>
        </Reveal>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <blockquote>
                <p className="font-[family-name:var(--font-display)] italic text-[var(--text-body-lg)] text-[var(--color-text-primary)] leading-relaxed mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
                  {t.name}, {t.descriptor}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
