'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ConciergeButton from '@/components/ui/ConciergeButton';
import Hero from '@/components/sections/Hero';
import StyleQuiz from '@/components/sections/StyleQuiz';
import StyleQuizModal from '@/components/ai/StyleQuizModal';
import CollectionPreview from '@/components/sections/CollectionPreview';
import EditorialDivider from '@/components/sections/EditorialDivider';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

export default function Home() {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      <Navigation variant="light" />
      <ConciergeButton />
      <StyleQuizModal open={quizOpen} onClose={() => setQuizOpen(false)} />

      <main id="main-content">
        {/* 1. Hero */}
        <Hero />

        {/* 2. Story teaser */}
        <section className="bg-[var(--color-bg-primary)]" style={{ padding: 'var(--space-section) 0' }}>
          <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
              <Reveal>
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image
                    src="/images/story-teaser.jpg"
                    alt="COURSET craftsmanship"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <span className="block font-[family-name:var(--font-body)] text-[0.6rem] font-light uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
                  Our Story
                </span>
                <h2
                  className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-6"
                  style={{ fontSize: 'var(--text-section-title)' }}
                >
                  Beyond the Court
                </h2>
                <p className="font-[family-name:var(--font-body)] text-[var(--text-body-lg)] text-[var(--color-text-secondary)] leading-[1.8] mb-8 max-w-[45ch]">
                  Pickleball isn&apos;t just a game. It&apos;s a culture, a community, a way
                  of life. COURSET transforms the energy of the court into jewelry you wear,
                  collect, and pass down.
                </p>
                <a
                  href="/story"
                  className="inline-flex items-center gap-3 font-[family-name:var(--font-body)] text-[0.7rem] font-light uppercase tracking-[0.25em] text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer group"
                >
                  Read Our Story
                  <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 3. Style Quiz CTA */}
        <StyleQuiz onOpenQuiz={() => setQuizOpen(true)} />

        {/* 4. Collection teasers */}
        <CollectionPreview />

        {/* 5. Editorial Divider */}
        <EditorialDivider quote="Where sport becomes legacy" />

        {/* 6. Concierge teaser */}
        <section className="bg-[var(--color-bg-primary)]" style={{ padding: 'var(--space-section) 0' }}>
          <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
              <Reveal>
                <span className="block font-[family-name:var(--font-body)] text-[0.6rem] font-light uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
                  Your Concierge
                </span>
                <h2
                  className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-6"
                  style={{ fontSize: 'var(--text-section-title)' }}
                >
                  White-Glove Service
                </h2>
                <p className="font-[family-name:var(--font-body)] text-[var(--text-body-lg)] text-[var(--color-text-secondary)] leading-[1.8] mb-4 max-w-[45ch]">
                  Private virtual consultations with our master jewelers. Complimentary
                  sizing kits. Bespoke commissions from sketch to finish. Every step
                  of your journey, guided.
                </p>
                <p className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)] mb-8">
                  Complimentary &middot; 30 Minutes &middot; No Obligation
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Button variant="primary" href="/concierge">
                    Book a Consultation
                  </Button>
                  <a
                    href="/concierge"
                    className="inline-flex items-center gap-3 font-[family-name:var(--font-body)] text-[0.7rem] font-light uppercase tracking-[0.25em] text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer group py-3"
                  >
                    Learn More
                    <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="aspect-[4/5] relative overflow-hidden">
                  <Image
                    src="/images/concierge-teaser.jpg"
                    alt="COURSET concierge service"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
