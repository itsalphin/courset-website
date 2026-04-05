'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

interface CollectionHeroProps {
  id: string;
  label: string;
  name: string;
  quote: string;
  narrative: string;
  ctaLabel: string;
  ctaHref: string;
  imageSide?: 'right' | 'left';
  bgClass?: string;
  imageSrc: string;
}

export default function CollectionHero({
  id,
  label,
  name,
  quote,
  narrative,
  ctaLabel,
  ctaHref,
  imageSide = 'right',
  bgClass = 'bg-[#F5F3F0]',
  imageSrc,
}: CollectionHeroProps) {
  const textContent = (
    <Reveal className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-16 md:py-24">
      <span className="font-[family-name:var(--font-body)] text-[0.85rem] font-medium uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
        {label}
      </span>
      <h2
        className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-6 leading-[1.05]"
        style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '0.03em' }}
      >
        {name}
      </h2>
      <p className="font-[family-name:var(--font-display)] italic text-[var(--text-body-lg)] text-[var(--color-text-secondary)] mb-8 max-w-[40ch]">
        &ldquo;{quote}&rdquo;
      </p>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-text-secondary)] leading-[1.8] mb-10 max-w-[45ch]">
        {narrative}
      </p>
      <a
        href={ctaHref}
        className="inline-flex items-center gap-3 font-[family-name:var(--font-body)] text-[0.7rem] font-light uppercase tracking-[0.25em] text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer group"
      >
        {ctaLabel}
        <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
      </a>
    </Reveal>
  );

  const imageContent = (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[600px] overflow-hidden">
      <Image
        src={imageSrc}
        alt={`${name} Collection`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover"
        priority
      />
    </div>
  );

  return (
    <section id={id} className={bgClass}>
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px] md:min-h-[700px]">
        {imageSide === 'right' ? (
          <>
            {textContent}
            {imageContent}
          </>
        ) : (
          <>
            {imageContent}
            {textContent}
          </>
        )}
      </div>
    </section>
  );
}
