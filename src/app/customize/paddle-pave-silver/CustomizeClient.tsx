'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, Truck, Shield, RotateCcw } from 'lucide-react';
import SectionLabel from '@/components/ui/SectionLabel';
import Reveal from '@/components/ui/Reveal';
import { useCart } from '@/lib/cart-context';
import { getProductById } from '@/lib/products';
import type { Product } from '@/lib/types';
import ScrubVideo from './ScrubVideo';
import { paddlePaveSilver as cfg } from './data';

// Lifestyle / angled shots run taller (portrait); product & detail shots square.
function aspectFor(src: string): string {
  return /on_model|velvet|marble/.test(src) ? 'aspect-[3/4]' : 'aspect-square';
}

export default function CustomizeClient() {
  const { dispatch } = useCart();
  const baseProduct = getProductById(cfg.id);

  const [added, setAdded] = useState(false);

  const handleAddToBag = () => {
    if (!baseProduct) return;
    // Single configuration — keep price/display in sync with the local config.
    const item: Product = {
      ...baseProduct,
      price: cfg.price,
      priceDisplay: cfg.priceDisplay,
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
          <p className="mt-2 font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-secondary)]">
            {cfg.descriptor}
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-14">

          {/* ===== LEFT: editorial masonry (video feature + flowing stills) ===== */}
          <div className="lg:col-span-2">
            <div className="columns-1 sm:columns-2 gap-3 [column-fill:_balance]">
              {/* Feature tile — interactive scrub video, cropped to its real content aspect */}
              <div
                className="mb-3 break-inside-avoid ring-1 ring-[var(--color-border)]"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <ScrubVideo
                  src={cfg.video}
                  poster={cfg.poster}
                  label={`${cfg.name} — drag to explore`}
                  className="aspect-[536/720]"
                />
              </div>

              {/* Still images */}
              {cfg.images.map((img) => (
                <div
                  key={img.src}
                  className={`relative mb-3 break-inside-avoid w-full overflow-hidden bg-[var(--color-bg-secondary)] ring-1 ring-[var(--color-border)] ${aspectFor(img.src)}`}
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    quality={82}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ===== RIGHT: sticky details + single configuration summary ===== */}
          <div className="lg:col-span-1 lg:sticky lg:top-28 lg:self-start">
            {cfg.tagline && (
              <p className="font-[family-name:var(--font-display)] text-lg italic text-[var(--color-text-secondary)]">
                {cfg.tagline}
              </p>
            )}

            <p className="mt-4 font-[family-name:var(--font-body)] text-[0.95rem] leading-[1.75] text-[var(--color-text-secondary)]">
              {cfg.description}
            </p>

            {/* Summary + CTA (single configuration — no variant selectors) */}
            <div className="mt-7 bg-white p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-base text-[var(--color-text-primary)]">
                    {cfg.name}
                  </p>
                  <p className="mt-0.5 font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
                    0.74 ct twt · pavé-set · 20&Prime; cable chain
                  </p>
                </div>
                <span className="font-[family-name:var(--font-body)] text-xl font-medium text-[var(--color-accent-text)]">
                  {cfg.priceDisplay}
                </span>
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

              <p className="mt-4 text-center font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
                Handcrafted to order &middot; 4&ndash;6 weeks
              </p>
            </div>

            {/* Trust badges */}
            <div className="mt-7 border-t border-[var(--color-divider)] pt-6">
              <h3 className="mb-4 font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
                We&rsquo;ve Got You Covered
              </h3>
              <ul className="space-y-3.5">
                {[
                  { icon: Truck, label: 'Free Insured Shipping & Returns' },
                  { icon: Shield, label: 'Free Lifetime Warranty' },
                  { icon: RotateCcw, label: 'Complimentary Lifetime Resizing' },
                ].map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-3">
                    <Icon size={18} strokeWidth={1.5} className="shrink-0 text-[var(--color-accent)]" />
                    <span className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-secondary)]">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 text-center">
              <Link
                href="/product/paddle-pave-silver"
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
