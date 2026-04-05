'use client';

import Image from 'next/image';
import { Gem, Hammer, FileCheck, Shield } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionLabel from '@/components/ui/SectionLabel';

const blocks = [
  {
    icon: Gem,
    title: 'Materials',
    body: '10K\u201324K gold, platinum, and ethically sourced diamonds. Every stone tracked from origin to setting.',
  },
  {
    icon: Hammer,
    title: 'Process',
    body: 'Hand-finished by master jewelers. Each piece takes 4\u20136 weeks from commission to delivery.',
  },
  {
    icon: FileCheck,
    title: 'Certification',
    body: 'Every COURSET piece ships with a Certificate of Authenticity, CAD documentation, and for diamond pieces, a GIA or IGI grading report.',
  },
  {
    icon: Shield,
    title: 'Guarantee',
    body: 'Lifetime structural warranty. Complimentary resizing. 30-day returns. Insured worldwide delivery.',
  },
];

const pressNames = [
  'Pickleball Magazine',
  'Robb Report',
  'Town & Country',
  'JCK',
  'Luxury Daily',
];

export default function Craftsmanship() {
  return (
    <section id="craftsmanship" className="bg-[var(--color-bg-secondary)]" style={{ padding: 'var(--space-section) 0' }}>
      <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
        <Reveal>
          <SectionLabel>Craftsmanship</SectionLabel>
          <h2
            className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-12"
            style={{ fontSize: 'var(--text-section-title)' }}
          >
            Made to Order, Made to Last
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {blocks.map((block, i) => (
            <Reveal key={block.title} delay={i * 0.1}>
              <div className="flex flex-col items-start">
                <block.icon size={24} strokeWidth={1.5} className="text-[var(--color-accent)] mb-4" />
                <h3 className="font-[family-name:var(--font-display)] text-lg font-normal text-[var(--color-text-primary)] mb-2">
                  {block.title}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-secondary)] leading-relaxed">
                  {block.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Macro image */}
        <Reveal>
          <div className="w-full aspect-[21/7] relative overflow-hidden mb-14">
            <Image
              src="/images/macro-detail.jpg"
              alt="Diamond setting detail"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        {/* Press mentions */}
        <Reveal>
          <div className="text-center">
            <span className="font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] block mb-6">
              As Featured In
            </span>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {pressNames.map((name) => (
                <span
                  key={name}
                  className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-tertiary)]"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
