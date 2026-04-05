'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import AnimatedImage from '@/components/ui/AnimatedImage';

const collections = [
  {
    id: 'victory',
    number: '01',
    name: 'Victory',
    tagline: 'Every Point Earned',
    range: '$450 – $890',
    description: 'Entry-level luxury for players who live for the game.',
    image: '/images/collection-victory.jpg',
  },
  {
    id: 'signature',
    number: '02',
    name: 'Signature',
    tagline: 'Your Mark, Your Game',
    range: '$2,200 – $5,200',
    description: 'Personalized pieces engraved with your story.',
    image: '/images/collection-signature.jpg',
  },
  {
    id: 'legacy',
    number: '03',
    name: 'Legacy',
    tagline: 'Leave Your Legacy',
    range: '$7,000 – $12,000',
    description: 'Diamond-set heirlooms. GIA certified. Made to last generations.',
    image: '/images/collection-legacy.jpg',
  },
];

export default function CollectionPreview() {
  return (
    <section className="bg-[var(--color-bg-primary)]" style={{ padding: 'var(--space-section) 0' }}>
      <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
        <Reveal>
          <SectionLabel>The Collections</SectionLabel>
          <h2
            className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-4"
            style={{ fontSize: 'var(--text-section-title)' }}
          >
            Three Tiers of Craft
          </h2>
          <p className="font-[family-name:var(--font-body)] text-[var(--text-body-lg)] text-[var(--color-text-secondary)] leading-relaxed mb-14 max-w-[55ch]">
            From your first court pendant to a diamond-set heirloom — every COURSET
            piece is crafted with the same obsessive attention to detail.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-14">
          {collections.map((col, i) => (
            <Reveal key={col.id} delay={i * 0.1}>
              <motion.a
                href={`/collections#${col.id}`}
                className="group block cursor-pointer"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {/* Image */}
                <div className="aspect-[4/5] relative mb-5 overflow-hidden">
                  <AnimatedImage
                    src={col.image}
                    alt={`${col.name} Collection`}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end p-6">
                    <span className="font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.2em] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                      View Collection <ArrowRight size={12} />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <span className="block font-[family-name:var(--font-body)] text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-2">
                  {col.number} — {col.name}
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--color-text-primary)] mb-1">
                  {col.tagline}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] mb-2">
                  {col.description}
                </p>
                <span className="font-[family-name:var(--font-body)] text-sm font-medium text-[var(--color-accent-text)]">
                  {col.range}
                </span>
              </motion.a>
            </Reveal>
          ))}
        </div>

        <Reveal className="text-center">
          <Button variant="secondary" href="/collections">
            View All Collections
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
