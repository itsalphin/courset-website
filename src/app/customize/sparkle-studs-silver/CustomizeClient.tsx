'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, MoveHorizontal, Check } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Reveal from '@/components/ui/Reveal';
import { useCart } from '@/lib/cart-context';
import { getProductById } from '@/lib/products';
import type { Product } from '@/lib/types';
import ScrubVideo from './ScrubVideo';
import { sparkleStudsSilver as cfg } from './data';

export default function CustomizeClient() {
  const { dispatch } = useCart();
  const baseProduct = getProductById(cfg.id);

  // media[0] = interactive video, media[1..] = stills
  const [activeMedia, setActiveMedia] = useState(0);
  const [versionId, setVersionId] = useState(cfg.defaultVersionId);
  const [added, setAdded] = useState(false);

  const version = cfg.caratVersions.find((v) => v.id === versionId) ?? cfg.caratVersions[0];

  const handleAddToBag = () => {
    if (!baseProduct) return;
    // Derived product so each carat version is its own cart line with its own price.
    const item: Product = {
      ...baseProduct,
      id: `${cfg.id}__${version.id}`,
      name: `${cfg.name} — ${version.label}`,
      price: version.price,
      priceDisplay: version.priceDisplay,
      diamondSpec: version.diamondSpec,
    };
    dispatch({ type: 'ADD_ITEM', payload: { product: item, quantity: 1 } });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <main id="main-content" className="min-h-screen bg-[var(--color-bg-primary)]">
      <div className="mx-auto px-[var(--gutter)] pt-28 pb-20" style={{ maxWidth: 'var(--content-width)' }}>

        {/* Heading */}
        <Reveal>
          <SectionLabel>{cfg.eyebrow}</SectionLabel>
          <h1
            className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)]"
            style={{ fontSize: 'var(--text-section-title)' }}
          >
            {cfg.name}
          </h1>
          {cfg.productCode && (
            <span className="mt-1 block font-[family-name:var(--font-body)] text-[0.65rem] tracking-[0.15em] text-[var(--color-text-tertiary)]">
              {cfg.productCode}
            </span>
          )}
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

          {/* ===== LEFT: interactive video + still gallery ===== */}
          <div>
            <div className="relative">
              {activeMedia === 0 ? (
                <ScrubVideo src={cfg.video} poster={cfg.poster} label={`${cfg.name} — drag to explore`} />
              ) : (
                <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-bg-secondary)]">
                  <Image
                    src={cfg.images[activeMedia - 1].src}
                    alt={cfg.images[activeMedia - 1].alt}
                    fill
                    quality={85}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>

            {/* Thumbnail strip: video first, then stills */}
            <div className="mt-4 flex gap-2.5 overflow-x-auto pb-2">
              {/* Video thumbnail */}
              <button
                onClick={() => setActiveMedia(0)}
                aria-label="Interactive video"
                className={`relative h-[72px] w-[72px] shrink-0 cursor-pointer overflow-hidden transition-all duration-200 ${
                  activeMedia === 0
                    ? 'ring-2 ring-[var(--color-accent)] scale-105'
                    : 'ring-1 ring-[var(--color-border)] hover:ring-[var(--color-text-tertiary)]'
                }`}
              >
                {cfg.poster && (
                  <Image src={cfg.poster} alt="" fill quality={40} sizes="72px" className="object-cover" />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/35">
                  <MoveHorizontal size={18} strokeWidth={1.5} className="text-white" />
                </span>
              </button>

              {cfg.images.map((img, i) => (
                <button
                  key={img.src}
                  onClick={() => setActiveMedia(i + 1)}
                  aria-label={img.label || `View image ${i + 1}`}
                  className={`relative h-[72px] w-[72px] shrink-0 cursor-pointer overflow-hidden transition-all duration-200 ${
                    activeMedia === i + 1
                      ? 'ring-2 ring-[var(--color-accent)] scale-105'
                      : 'ring-1 ring-[var(--color-border)] hover:ring-[var(--color-text-tertiary)]'
                  }`}
                >
                  <Image src={img.src} alt="" fill quality={40} sizes="72px" className="object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* ===== RIGHT: details + carat selector + summary ===== */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            {cfg.tagline && (
              <p className="font-[family-name:var(--font-display)] text-lg italic text-[var(--color-text-secondary)]">
                {cfg.tagline}
              </p>
            )}

            <p className="mt-4 font-[family-name:var(--font-body)] text-[0.95rem] leading-[1.75] text-[var(--color-text-secondary)]">
              {cfg.description}
            </p>

            <div className="my-7 h-px bg-[var(--color-divider)]" />

            {/* Carat-version selector — the only variant axis */}
            <h2 className="mb-3 font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
              Diamond Weight
            </h2>
            <div role="radiogroup" aria-label="Diamond weight" className="grid grid-cols-3 gap-2.5">
              {cfg.caratVersions.map((v) => {
                const selected = v.id === versionId;
                return (
                  <button
                    key={v.id}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setVersionId(v.id)}
                    className={`flex min-h-[52px] items-center justify-center px-3 py-3 text-center font-[family-name:var(--font-body)] text-[0.8rem] tracking-[0.05em] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
                      selected
                        ? 'border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent-text)]'
                        : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)]'
                    }`}
                  >
                    {v.label}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-secondary)]">
              {version.descriptor}
            </p>

            {/* Summary + CTA */}
            <div className="mt-7 bg-white p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-base text-[var(--color-text-primary)]">
                    {cfg.name}
                  </p>
                  <p className="mt-0.5 font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
                    {version.diamondSpec}
                  </p>
                </div>
                <motion.span
                  key={version.id}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="font-[family-name:var(--font-body)] text-xl font-medium text-[var(--color-accent-text)]"
                  aria-live="polite"
                >
                  {version.priceDisplay}
                </motion.span>
              </div>

              <motion.button
                onClick={handleAddToBag}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-5 flex w-full items-center justify-center gap-2.5 bg-[var(--color-accent)] px-8 py-4 font-[family-name:var(--font-body)] text-[0.75rem] uppercase tracking-[0.15em] text-white transition-colors hover:bg-[var(--color-accent-hover)] cursor-pointer"
              >
                {added ? (
                  <>
                    <Check size={16} strokeWidth={1.5} /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} strokeWidth={1.5} /> Begin Your Commission
                  </>
                )}
              </motion.button>

              <p className="mt-4 text-center font-[family-name:var(--font-body)] text-[var(--text-caption)] leading-relaxed text-[var(--color-text-tertiary)]">
                Includes certificate of authenticity &middot; Free insured shipping &middot; Lifetime warranty
              </p>
              <p className="mt-2 text-center font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
                Handcrafted to order &middot; 4&ndash;6 weeks
              </p>
            </div>

            <p className="mt-6 text-center">
              <Link
                href="/product/sparkle-studs-silver"
                className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-secondary)] underline transition-colors hover:text-[var(--color-text-primary)]"
              >
                View full product details
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
