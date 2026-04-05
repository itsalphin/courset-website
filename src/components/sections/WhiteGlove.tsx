'use client';

import { Ruler, PenTool, Shield, Truck, RotateCcw, Award, Lock } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import TrustBadge from '@/components/ui/TrustBadge';

const trustItems = [
  { icon: Shield, label: 'Lifetime Warranty' },
  { icon: Truck, label: 'Insured Worldwide Delivery' },
  { icon: RotateCcw, label: '30-Day Returns' },
  { icon: Award, label: 'Certificate of Authenticity' },
  { icon: Lock, label: 'Secure Checkout' },
];

export default function WhiteGlove() {
  return (
    <section id="concierge" className="bg-[var(--color-bg-primary)]" style={{ padding: 'var(--space-section) 0' }}>
      <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
        <Reveal>
          <SectionLabel>Your Concierge</SectionLabel>
          <h2
            className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-14"
            style={{ fontSize: 'var(--text-section-title)' }}
          >
            White-Glove Service, Every Step
          </h2>
        </Reveal>

        {/* Asymmetric service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Card 1: Virtual Consultation — spans full width on mobile, 2 cols on desktop */}
          <Reveal className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white overflow-hidden" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="aspect-video md:aspect-auto relative overflow-hidden bg-[#1A1A1A]">
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/videos/concierge.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--color-text-primary)] mb-3">
                  One-on-One with Our Jewelers
                </h3>
                <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-text-secondary)] leading-relaxed mb-6 max-w-[45ch]">
                  Book a private virtual consultation. Our master jewelers will guide you
                  through designs, materials, and custom options — from your first idea to
                  your finished piece.
                </p>
                <div>
                  <Button variant="primary">Book a Consultation</Button>
                  <p className="mt-3 font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
                    Complimentary &middot; 30 Minutes &middot; No Obligation
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Card 2: Complimentary Sizing */}
          <Reveal delay={0.1}>
            <div className="bg-white p-8 md:p-10 h-full" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <Ruler size={24} strokeWidth={1.5} className="text-[var(--color-accent)] mb-5" />
              <h3 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--color-text-primary)] mb-3">
                Perfect Fit, Guaranteed
              </h3>
              <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-text-secondary)] leading-relaxed mb-6">
                We&apos;ll send you a complimentary sizing kit before your piece goes into
                production. Because luxury should fit perfectly.
              </p>
              <Button variant="ghost">Request Sizing Kit</Button>
            </div>
          </Reveal>

          {/* Card 3: Bespoke Commissions */}
          <Reveal delay={0.2}>
            <div className="bg-white p-8 md:p-10 h-full" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <PenTool size={24} strokeWidth={1.5} className="text-[var(--color-accent)] mb-5" />
              <h3 className="font-[family-name:var(--font-display)] text-xl font-normal text-[var(--color-text-primary)] mb-3">
                Entirely Yours
              </h3>
              <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-text-secondary)] leading-relaxed mb-6">
                Have a vision? Our design team will bring it to life. From initial sketch
                to final polish — a piece that exists nowhere else in the world.
              </p>
              <Button variant="ghost">Start a Commission</Button>
              <p className="mt-3 font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
                From $3,000 &middot; 6–8 Week Lead Time
              </p>
            </div>
          </Reveal>
        </div>

        {/* Trust strip */}
        <Reveal>
          <div className="bg-[var(--color-bg-secondary)] px-8 py-8 mt-16">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 items-center justify-items-start md:justify-items-center">
              {trustItems.map((item) => (
                <TrustBadge key={item.label} icon={item.icon} label={item.label} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
