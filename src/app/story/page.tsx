'use client';

import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ConciergeButton from '@/components/ui/ConciergeButton';
import BrandStory from '@/components/sections/BrandStory';
import Craftsmanship from '@/components/sections/Craftsmanship';
import Community from '@/components/sections/Community';
import Reveal from '@/components/ui/Reveal';

export default function StoryPage() {
  return (
    <>
      <Navigation />
      <ConciergeButton />

      <main id="main-content">
        {/* Story hero */}
        <section className="pt-32 pb-20 bg-[var(--color-bg-primary)]">
          <div className="mx-auto px-[var(--gutter)] text-center" style={{ maxWidth: 'var(--narrow-width)' }}>
            <Reveal>
              <span className="block font-[family-name:var(--font-body)] text-[0.9rem] font-medium uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
                Our Story
              </span>
              <h1
                className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-8"
                style={{ fontSize: 'var(--text-hero)', lineHeight: '1' }}
              >
                Beyond the Court
              </h1>
              <p className="font-[family-name:var(--font-display)] italic text-xl md:text-2xl text-[var(--color-text-secondary)] max-w-[50ch] mx-auto leading-relaxed">
                &ldquo;We didn&apos;t set out to make sports jewelry. We set out to make jewelry worthy of the people who play.&rdquo;
              </p>
            </Reveal>
          </div>
        </section>

        {/* Full-width editorial image */}
        <Reveal>
          <div className="w-full aspect-[21/7] relative overflow-hidden">
            <Image
              src="/images/story-hero-banner.jpg"
              alt="COURSET story"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>

        {/* Origin story */}
        <section className="bg-[var(--color-bg-primary)]" style={{ padding: 'var(--space-section) 0' }}>
          <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <Reveal className="md:col-span-7">
                <span className="block font-[family-name:var(--font-body)] text-[0.6rem] font-light uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
                  The Beginning
                </span>
                <h2
                  className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-6"
                  style={{ fontSize: 'var(--text-section-title)' }}
                >
                  Born on the Court
                </h2>
                <p className="font-[family-name:var(--font-body)] text-[var(--text-body-lg)] text-[var(--color-text-secondary)] leading-[1.8] mb-6 max-w-[55ch]">
                  COURSET started with a question that no one in luxury jewelry was asking:
                  what if the fastest-growing sport in the world had jewelry that matched its
                  energy? Not pins. Not charms from a gift shop. Real jewelry — the kind you
                  pass down, the kind that means something.
                </p>
                <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-text-secondary)] leading-[1.8] max-w-[55ch]">
                  We found our answer in the geometry of the game itself. The arc of a paddle.
                  The precision of a net. The circle of a ball mid-rally. These shapes became
                  our design language — translated into gold, platinum, and diamonds by master
                  jewelers who treat every piece as a commission, not a product.
                </p>
              </Reveal>
              <Reveal delay={0.15} className="md:col-span-5">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image
                    src="/images/born-on-court.jpg"
                    alt="Born on the court"
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="bg-[var(--color-bg-inverse)] py-24 md:py-32">
          <div className="mx-auto px-[var(--gutter)] text-center" style={{ maxWidth: 'var(--narrow-width)' }}>
            <Reveal>
              <div className="w-12 h-px bg-[var(--color-accent)] mx-auto mb-10" />
              <p className="font-[family-name:var(--font-display)] italic text-2xl md:text-3xl text-[var(--color-accent)] leading-relaxed mb-10">
                Pickleball gave us community. We wanted to give something back — something
                tangible, something permanent, something you could hold in your hand and
                remember the match that changed everything.
              </p>
              <div className="w-12 h-px bg-[var(--color-accent)] mx-auto" />
            </Reveal>
          </div>
        </section>

        {/* Brand Story details */}
        <BrandStory />

        {/* Craftsmanship */}
        <Craftsmanship />

        {/* Community */}
        <Community />
      </main>

      <Footer />
    </>
  );
}
