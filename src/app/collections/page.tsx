'use client';

import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ConciergeButton from '@/components/ui/ConciergeButton';
import CollectionHero from '@/components/sections/CollectionHero';
import CollectionGrid from '@/components/sections/CollectionGrid';
import CompleteTheSet from '@/components/sections/CompleteTheSet';
import ProvenanceStrip from '@/components/sections/ProvenanceStrip';
import Reveal from '@/components/ui/Reveal';
import { getProductsByCollection, getProductById } from '@/lib/products';
import type { Product } from '@/lib/types';

const victoryProducts = getProductsByCollection('victory');
const signatureProducts = getProductsByCollection('signature');
const legacyProducts = getProductsByCollection('legacy');

const signatureComplementary = [
  getProductById('signature-ring'),
  getProductById('custom-initial-earrings'),
  getProductById('statement-court-pendant'),
].filter((p): p is Product => p !== undefined);

export default function CollectionsPage() {
  return (
    <>
      <Navigation />
      <ConciergeButton />

      <main id="main-content" className="pt-20">
        <h1 className="sr-only">COURSET Collections</h1>
        {/* ═══════ VICTORY ═══════ */}
        <CollectionHero
          id="victory"
          label="The First Rally"
          name="Victory"
          quote="Every champion remembers the match that changed everything."
          narrative="The Victory collection is for the player who fell in love with the sound of the paddle, the rhythm of the rally, the electricity of a point well earned. These are the pieces you wear to remember why you started — clean, bright, and charged with the energy of a Saturday morning match that turned into something more."
          ctaLabel="Discover the Victory"
          ctaHref="#victory-pieces"
          imageSide="right"
          bgClass="bg-[#F5F3F0]"
          imageSrc="/images/hero-victory.jpg"
        />
        <section id="victory-pieces" className="bg-[var(--color-bg-primary)]" style={{ padding: 'var(--space-section) 0' }}>
          <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
            <Reveal>
              <span className="block font-[family-name:var(--font-body)] text-[0.6rem] font-light uppercase tracking-[0.3em] text-[var(--color-accent)] mb-3">
                $450 &ndash; $890
              </span>
              <h3
                className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-12"
                style={{ fontSize: 'var(--text-collection-title)' }}
              >
                The Victory Pieces
              </h3>
            </Reveal>
            <CollectionGrid products={victoryProducts} columns={3} />
          </div>
        </section>

        {/* ═══════ DIVIDER ═══════ */}
        <div className="bg-[var(--color-bg-inverse)] py-20 md:py-28">
          <div className="mx-auto px-[var(--gutter)] text-center" style={{ maxWidth: 'var(--narrow-width)' }}>
            <Reveal>
              <div className="w-12 h-px bg-[var(--color-accent)] mx-auto mb-8" />
              <p className="font-[family-name:var(--font-display)] italic text-xl md:text-2xl text-[var(--color-accent)] leading-relaxed">
                The court teaches patience, precision, and persistence. Our jewelry remembers the lessons.
              </p>
              <div className="w-12 h-px bg-[var(--color-accent)] mx-auto mt-8" />
            </Reveal>
          </div>
        </div>

        {/* ═══════ SIGNATURE ═══════ */}
        <CollectionHero
          id="signature"
          label="Written in Gold"
          name="Signature"
          quote="Your game has a rhythm. Your jewelry should echo it."
          narrative="The Signature collection is for the player whose name is known at the net. You have earned your place, and now you want something that carries your identity beyond the court. Every Signature piece can be engraved, customized, and shaped around the moments that defined your game — a tournament date, an initial, a motif that belongs only to you."
          ctaLabel="Discover the Signature"
          ctaHref="#signature-pieces"
          imageSide="left"
          bgClass="bg-[#F0EDE8]"
          imageSrc="/images/hero-signature.jpg"
        />
        <section id="signature-pieces" className="bg-[var(--color-bg-secondary)]" style={{ padding: 'var(--space-section) 0' }}>
          <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
            <Reveal>
              <span className="block font-[family-name:var(--font-body)] text-[0.6rem] font-light uppercase tracking-[0.3em] text-[var(--color-accent)] mb-3">
                $2,200 &ndash; $5,200
              </span>
              <h3
                className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-12"
                style={{ fontSize: 'var(--text-collection-title)' }}
              >
                The Signature Pieces
              </h3>
            </Reveal>
            <CollectionGrid products={signatureProducts} columns={3} />
            <CompleteTheSet products={signatureComplementary} />
          </div>
        </section>

        {/* ═══════ DIVIDER ═══════ */}
        <div className="bg-[var(--color-bg-inverse)] py-20 md:py-28">
          <div className="mx-auto px-[var(--gutter)] text-center" style={{ maxWidth: 'var(--narrow-width)' }}>
            <Reveal>
              <div className="w-12 h-px bg-[var(--color-accent)] mx-auto mb-8" />
              <p className="font-[family-name:var(--font-display)] italic text-xl md:text-2xl text-[var(--color-accent)] leading-relaxed">
                Some victories are meant to be worn. Others are meant to be passed down.
              </p>
              <div className="w-12 h-px bg-[var(--color-accent)] mx-auto mt-8" />
            </Reveal>
          </div>
        </div>

        {/* ═══════ LEGACY ═══════ */}
        <CollectionHero
          id="legacy"
          label="Heirloom Grade"
          name="Legacy"
          quote="The pieces your grandchildren will ask about."
          narrative="The Legacy collection exists for a different kind of player — one who understands that the greatest victories are measured not in points, but in what endures. These are diamond-set, GIA-certified heirlooms crafted by master jewelers over weeks of meticulous work. Each piece arrives in a presentation case with full documentation, because Legacy is not a purchase. It is a commission."
          ctaLabel="Discover the Legacy"
          ctaHref="#legacy-pieces"
          imageSide="right"
          bgClass="bg-[#EBE8E3]"
          imageSrc="/images/hero-legacy.jpg"
        />
        <section id="legacy-pieces" className="bg-[var(--color-bg-tertiary)]" style={{ padding: 'var(--space-section) 0' }}>
          <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
            <Reveal>
              <span className="block font-[family-name:var(--font-body)] text-[0.6rem] font-light uppercase tracking-[0.3em] text-[var(--color-accent)] mb-3">
                $7,000 &ndash; $12,000
              </span>
              <h3
                className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-12"
                style={{ fontSize: 'var(--text-collection-title)' }}
              >
                The Legacy Pieces
              </h3>
            </Reveal>
            <CollectionGrid products={legacyProducts} columns={2} />
            <ProvenanceStrip />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
