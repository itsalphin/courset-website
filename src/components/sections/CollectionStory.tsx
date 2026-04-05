'use client';

import Reveal from '@/components/ui/Reveal';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import CollectionGrid from './CollectionGrid';
import type { Product } from '@/lib/types';

interface CollectionStoryProps {
  id: string;
  label: string;
  headline: string;
  narrative: string;
  products: Product[];
  bgClass?: string;
  columns?: 2 | 3;
  ctaLabel?: string;
  ctaHref?: string;
  children?: React.ReactNode;
}

export default function CollectionStory({
  id,
  label,
  headline,
  narrative,
  products,
  bgClass = 'bg-[var(--color-bg-primary)]',
  columns = 3,
  ctaLabel,
  ctaHref = '#',
  children,
}: CollectionStoryProps) {
  return (
    <section id={id} className={bgClass} style={{ padding: 'var(--space-section) 0' }}>
      <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
        <Reveal>
          <SectionLabel>{label}</SectionLabel>
          <h2
            className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-4"
            style={{ fontSize: 'var(--text-section-title)' }}
          >
            {headline}
          </h2>
          <p className="font-[family-name:var(--font-body)] text-[var(--text-body-lg)] text-[var(--color-text-secondary)] leading-relaxed mb-12 max-w-[60ch]">
            {narrative}
          </p>
        </Reveal>

        <CollectionGrid products={products} columns={columns} />

        {/* Optional children (e.g. Complete the Set, provenance strip) */}
        {children}

        {ctaLabel && (
          <Reveal className="mt-14 text-center">
            <Button variant="secondary" href={ctaHref}>
              {ctaLabel}
            </Button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
