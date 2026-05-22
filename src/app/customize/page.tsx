import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import ConciergeButton from '@/components/ui/ConciergeButton';
import SectionLabel from '@/components/ui/SectionLabel';
import Reveal from '@/components/ui/Reveal';
import { byForm, type Form, type Piece } from '@/lib/catalog';
import { CUSTOMIZE_ROUTES } from '@/lib/customize';
import { getProductById } from '@/lib/products';
import { formatPrice } from '@/lib/pricing';

export const metadata = {
  title: 'Customize Your Piece — COURSET™',
  description: 'Begin a bespoke commission. Choose your silhouette, then tailor metal, finish, stones, and specifications.',
};

const FORMS: { id: Form; label: string; blurb: string }[] = [
  { id: 'ball', label: 'The Pickleball', blurb: 'The icon of the game, rendered as pendants and earrings — polished, gypsy-set, or diamond.' },
  { id: 'paddle', label: 'The Paddle', blurb: 'Pavé-set and textured paddle silhouettes, in yellow, white, and two-tone gold.' },
  { id: 'court', label: 'The Court', blurb: 'Architectural court bars — diamond outline, full pavé, baguette, and enamel color.' },
];

// Per-form stand-in imagery for pieces that have no mapped product photo yet.
const FORM_FALLBACK: Record<Form, string> = {
  ball: '/images/court-royale-hero_white.jpg',
  paddle: '/images/paddle-pave-silver-hero_white.jpg',
  court: '/images/macro-detail.jpg',
};

function cardImage(piece: Piece): string {
  if (piece.siteProductId) {
    const p = getProductById(piece.siteProductId);
    if (p) return p.image;
  }
  return FORM_FALLBACK[piece.form];
}

function pieceHref(piece: Piece): { href: string; bespoke: boolean } {
  const bespoke = piece.siteProductId ? CUSTOMIZE_ROUTES[piece.siteProductId] : undefined;
  return bespoke ? { href: bespoke, bespoke: true } : { href: `/customize/${piece.id}`, bespoke: false };
}

export default function CustomizeIndexPage() {
  return (
    <>
      <Navigation />
      <ConciergeButton />
      <main id="main-content" className="bg-[var(--color-bg-primary)]">

        {/* ===== HERO ===== */}
        <section className="relative flex min-h-[62vh] items-center justify-center overflow-hidden">
          <Image
            src="/images/macro-detail.jpg"
            alt=""
            fill
            priority
            quality={80}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 mx-auto max-w-[680px] px-[var(--gutter)] text-center text-white">
            <span className="font-[family-name:var(--font-body)] text-[0.8rem] font-medium uppercase tracking-[0.3em] text-[var(--color-accent)]">
              The Customizer
            </span>
            <h1
              className="mt-5 font-[family-name:var(--font-display)] font-light leading-[1.05]"
              style={{ fontSize: 'var(--text-hero)' }}
            >
              Design Your Piece
            </h1>
            <p className="mx-auto mt-6 max-w-[48ch] font-[family-name:var(--font-body)] text-[var(--text-body-lg)] leading-relaxed text-white/80">
              Every commission begins with a silhouette. Choose yours, then tailor the metal,
              finish, and stones — to the carat.
            </p>
          </div>
        </section>

        {/* ===== SILHOUETTE SECTIONS ===== */}
        <div className="mx-auto px-[var(--gutter)] py-[var(--space-block)]" style={{ maxWidth: 'var(--content-width)' }}>
          {FORMS.map((form, fi) => {
            const pieces = byForm(form.id);
            if (pieces.length === 0) return null;
            return (
              <section key={form.id} className={fi === 0 ? '' : 'mt-[var(--space-block)]'}>
                <Reveal>
                  <SectionLabel>{`0${fi + 1}`}</SectionLabel>
                  <h2
                    className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)]"
                    style={{ fontSize: 'var(--text-collection-title)' }}
                  >
                    {form.label}
                  </h2>
                  <p className="mt-3 max-w-[60ch] font-[family-name:var(--font-body)] text-[var(--color-text-secondary)] leading-relaxed">
                    {form.blurb}
                  </p>
                </Reveal>

                <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {pieces.map((piece, i) => {
                    const { href, bespoke } = pieceHref(piece);
                    return (
                      <Reveal key={piece.id} delay={i * 0.05}>
                        <Link href={href} className="group block">
                          <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-bg-secondary)]" style={{ boxShadow: 'var(--shadow-sm)' }}>
                            <Image
                              src={cardImage(piece)}
                              alt={piece.name}
                              fill
                              quality={82}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            {bespoke && (
                              <span className="absolute left-3 top-3 flex items-center gap-1.5 bg-white/90 px-2.5 py-1 font-[family-name:var(--font-body)] text-[0.6rem] uppercase tracking-[0.12em] text-[var(--color-accent-hover)] backdrop-blur-sm">
                                <Sparkles size={11} strokeWidth={1.5} />
                                Interactive
                              </span>
                            )}
                          </div>

                          <div className="mt-4 flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text-primary)]">
                                {piece.name}
                              </h3>
                              <p className="mt-0.5 font-[family-name:var(--font-body)] text-[var(--text-caption)] capitalize text-[var(--color-text-tertiary)]">
                                {piece.wearType} · From {formatPrice(piece.basePrice)}
                              </p>
                            </div>
                            <ArrowRight
                              size={18}
                              strokeWidth={1.5}
                              className="mt-1 shrink-0 text-[var(--color-text-tertiary)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                            />
                          </div>
                        </Link>
                      </Reveal>
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
