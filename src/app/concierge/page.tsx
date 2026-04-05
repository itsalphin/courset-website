'use client';

import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ConciergeButton from '@/components/ui/ConciergeButton';
import WhiteGlove from '@/components/sections/WhiteGlove';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { Shield, Truck, RotateCcw, Award, Lock } from 'lucide-react';
import TrustBadge from '@/components/ui/TrustBadge';

const trustItems = [
  { icon: Shield, label: 'Lifetime Warranty' },
  { icon: Truck, label: 'Insured Worldwide Delivery' },
  { icon: RotateCcw, label: '30-Day Returns' },
  { icon: Award, label: 'Certificate of Authenticity' },
  { icon: Lock, label: 'Secure Checkout' },
];

export default function ConciergePage() {
  return (
    <>
      <Navigation />

      <main id="main-content">
        {/* Concierge hero */}
        <section className="pt-32 pb-20 bg-[var(--color-bg-primary)]">
          <div className="mx-auto px-[var(--gutter)] text-center" style={{ maxWidth: 'var(--narrow-width)' }}>
            <Reveal>
              <span className="block font-[family-name:var(--font-body)] text-[0.9rem] font-medium uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6">
                Your Concierge
              </span>
              <h1
                className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-8"
                style={{ fontSize: 'var(--text-hero)', lineHeight: '1' }}
              >
                At Your Service
              </h1>
              <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-[var(--color-text-secondary)] max-w-[50ch] mx-auto leading-relaxed">
                Every COURSET journey is guided. From your first question to your finished
                piece, our concierge team is here — on your terms, on your schedule.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Full width editorial image */}
        <Reveal>
          <div className="w-full aspect-[21/7] relative overflow-hidden">
            <Image
              src="/images/concierge-hero-banner.jpg"
              alt="COURSET concierge"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        </Reveal>

        {/* White-Glove service section */}
        <WhiteGlove />

        {/* Booking form placeholder */}
        <section className="bg-[var(--color-bg-secondary)]" style={{ padding: 'var(--space-section) 0' }}>
          <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--narrow-width)' }}>
            <Reveal>
              <div className="text-center mb-12">
                <span className="block font-[family-name:var(--font-body)] text-[0.6rem] font-light uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
                  Book Your Session
                </span>
                <h2
                  className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-4"
                  style={{ fontSize: 'var(--text-section-title)' }}
                >
                  Virtual Consultation
                </h2>
                <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-text-secondary)] max-w-[45ch] mx-auto">
                  30 minutes with a master jeweler. No obligation, no pressure — just
                  an honest conversation about what you&apos;re looking for.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="bg-white p-8 md:p-12 space-y-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-[var(--color-border)] font-[family-name:var(--font-body)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-[var(--color-border)] font-[family-name:var(--font-body)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-2">
                    What are you looking for?
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-[var(--color-border)] font-[family-name:var(--font-body)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                    placeholder="Tell us about the piece you have in mind, the occasion, or any questions..."
                  />
                </div>
                <div className="text-center pt-2">
                  <Button variant="primary" size="lg">
                    Request Consultation
                  </Button>
                  <p className="mt-4 font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
                    Complimentary &middot; 30 Minutes &middot; No Obligation
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Trust strip */}
        <section className="bg-[var(--color-bg-primary)] py-16">
          <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 items-center justify-items-start md:justify-items-center">
              {trustItems.map((item) => (
                <TrustBadge key={item.label} icon={item.icon} label={item.label} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
