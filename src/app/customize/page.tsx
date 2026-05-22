import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ConciergeButton from '@/components/ui/ConciergeButton';
import SectionLabel from '@/components/ui/SectionLabel';
import Reveal from '@/components/ui/Reveal';
import { byForm, type Form } from '@/lib/catalog.config';
import { CUSTOMIZE_ROUTES } from '@/lib/customize';

export const metadata = {
  title: 'Customize Your Piece — COURSET™',
  description: 'Configure any COURSET piece — choose form, metal, finish, stones, and specifications.',
};

const FORM_LABELS: Record<Form, string> = {
  ball: 'Pickleball',
  paddle: 'Paddle',
  court: 'Court',
};

const FORMS: Form[] = ['ball', 'paddle', 'court'];

export default function CustomizeIndexPage() {
  return (
    <>
      <Navigation />
      <ConciergeButton />
      <main id="main-content" className="min-h-screen bg-[var(--color-bg-primary)]">
        <div className="mx-auto px-[var(--gutter)] pt-28 pb-20" style={{ maxWidth: 'var(--content-width)' }}>
          <Reveal>
            <SectionLabel>The Customizer</SectionLabel>
            <h1
              className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)]"
              style={{ fontSize: 'var(--text-section-title)' }}
            >
              Design Your Piece
            </h1>
            <p className="mt-4 max-w-[55ch] font-[family-name:var(--font-body)] text-[var(--text-body-lg)] leading-relaxed text-[var(--color-text-secondary)]">
              Begin with a silhouette. Every piece configures only the options it truly supports —
              metal, finish, stones, and specifications.
            </p>
          </Reveal>

          {FORMS.map((form) => {
            const pieces = byForm(form);
            if (pieces.length === 0) return null;
            return (
              <section key={form} className="mt-16">
                <h2 className="mb-6 font-[family-name:var(--font-display)] text-2xl text-[var(--color-text-primary)]">
                  {FORM_LABELS[form]}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pieces.map((piece) => {
                    // If the piece maps to a bespoke scrub-video page, link there; else the generic configurator.
                    const bespoke = piece.siteProductId ? CUSTOMIZE_ROUTES[piece.siteProductId] : undefined;
                    const href = bespoke ?? `/customize/${piece.id}`;
                    return (
                      <Link
                        key={piece.id}
                        href={href}
                        className="group flex items-center justify-between gap-4 border border-[var(--color-border)] bg-white p-5 transition-colors hover:border-[var(--color-accent)]"
                        style={{ boxShadow: 'var(--shadow-sm)' }}
                      >
                        <span>
                          <span className="block font-[family-name:var(--font-display)] text-lg text-[var(--color-text-primary)]">
                            {piece.name}
                          </span>
                          <span className="mt-0.5 block font-[family-name:var(--font-body)] text-[var(--text-caption)] capitalize text-[var(--color-text-tertiary)]">
                            {piece.wearType}
                            {bespoke ? ' · Interactive preview' : ''}
                          </span>
                        </span>
                        <ArrowRight
                          size={18}
                          strokeWidth={1.5}
                          className="shrink-0 text-[var(--color-text-tertiary)] transition-all group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                        />
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
