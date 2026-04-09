'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import ProductCard from '@/components/ui/ProductCard';
import Reveal from '@/components/ui/Reveal';

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { dispatch } = useCart();
  const prefersReduced = useReducedMotion();
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const gallery = product.gallery || [{ src: product.image, alt: product.name, label: 'Product' }];
  const selectedImage = gallery[selectedIndex];

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(gallery.length - 1, index));
    if (clamped === selectedIndex) return;
    setSelectedIndex(clamped);
  }, [selectedIndex, gallery.length]);

  const goNext = useCallback(() => goTo(selectedIndex + 1), [goTo, selectedIndex]);
  const goPrev = useCallback(() => goTo(selectedIndex - 1), [goTo, selectedIndex]);

  // Swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
  };

  const entrance = prefersReduced
    ? { initial: {}, animate: {} }
    : { initial: { opacity: 0 }, animate: { opacity: 1 } };

  return (
    <main id="main-content" className="min-h-screen bg-[var(--color-bg-primary)] pt-28 pb-16">
      <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
            <li><Link href="/" className="hover:text-[var(--color-text-primary)] transition-colors cursor-pointer">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/collections" className="hover:text-[var(--color-text-primary)] transition-colors cursor-pointer capitalize">{product.collection} Collection</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-[var(--color-text-primary)]">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-10 lg:gap-16">

          {/* === LEFT: Gallery === */}
          <motion.div {...entrance} transition={{ duration: 0.5 }}>
            {/* Main image with arrows and swipe */}
            <div
              className="relative aspect-square bg-[var(--color-bg-secondary)] overflow-hidden select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={prefersReduced ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={prefersReduced ? {} : { opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.alt}
                    fill
                    quality={85}
                    priority
                    sizes="(max-width: 768px) 100vw, 55vw"
                    className="object-contain p-6"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Arrow navigation */}
              {selectedIndex > 0 && (
                <button
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} strokeWidth={1.5} className="text-[var(--color-text-primary)]" />
                </button>
              )}
              {selectedIndex < gallery.length - 1 && (
                <button
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={18} strokeWidth={1.5} className="text-[var(--color-text-primary)]" />
                </button>
              )}

              {/* Image counter */}
              <span className="absolute bottom-3 right-3 font-[family-name:var(--font-body)] text-[0.6rem] text-[var(--color-text-tertiary)] bg-white/70 backdrop-blur-sm px-2 py-1">
                {selectedIndex + 1} / {gallery.length}
              </span>
            </div>

            {/* Thumbnail strip — scrollable */}
            <div ref={thumbStripRef} className="flex gap-2.5 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {gallery.map((img, index) => (
                <button
                  key={img.src}
                  onClick={() => goTo(index)}
                  className={`relative shrink-0 w-[72px] h-[72px] overflow-hidden cursor-pointer transition-all duration-200 ${
                    index === selectedIndex
                      ? 'ring-2 ring-[var(--color-accent)] scale-105'
                      : 'ring-1 ring-[var(--color-border)] hover:ring-[var(--color-text-tertiary)]'
                  }`}
                  aria-label={img.label || `View image ${index + 1}`}
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    quality={50}
                    sizes="72px"
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* === RIGHT: Details === */}
          <motion.div
            {...entrance}
            transition={{ duration: 0.5, delay: prefersReduced ? 0 : 0.15 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <span className="font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
              {product.collection} Collection
            </span>

            <h1
              className="font-[family-name:var(--font-display)] font-normal text-[var(--color-text-primary)] mt-3"
              style={{ fontSize: 'var(--text-collection-title)' }}
            >
              {product.name}
            </h1>

            {/* Product code */}
            <span className="font-[family-name:var(--font-body)] text-[0.65rem] tracking-[0.15em] text-[var(--color-text-tertiary)] mt-1 block">
              GUP0002
            </span>

            {product.tagline && (
              <p className="font-[family-name:var(--font-display)] italic text-[var(--color-text-secondary)] mt-3 text-lg">
                {product.tagline}
              </p>
            )}

            <p className="font-[family-name:var(--font-body)] font-medium text-[var(--color-accent-text)] mt-4 text-xl">
              {product.priceDisplay}
            </p>

            <div className="h-px bg-[var(--color-divider)] my-6" />

            <p className="font-[family-name:var(--font-body)] text-[var(--color-text-secondary)] leading-[1.75] text-[0.95rem]">
              {product.description}
            </p>

            {product.specs && (
              <div className="mt-8">
                <span className="font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] block mb-3">
                  Details
                </span>
                <dl className="space-y-2.5">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)] capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </dt>
                      <dd className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-primary)]">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="mt-8">
              <motion.button
                onClick={() => dispatch({ type: 'ADD_ITEM', payload: { product, quantity: 1 } })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-8 bg-[var(--color-accent)] text-white font-[family-name:var(--font-body)] uppercase tracking-[0.15em] text-[0.75rem] cursor-pointer transition-colors hover:bg-[var(--color-accent-hover)]"
              >
                <span className="flex items-center justify-center gap-2.5">
                  <ShoppingBag size={16} strokeWidth={1.5} />
                  Add to Bag
                </span>
              </motion.button>
              <p className="text-center font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)] mt-3">
                Handcrafted to order &middot; 4&ndash;6 weeks &middot; Free insured shipping
              </p>
            </div>

            <p className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)] mt-6">
              Certificate of Authenticity Included
            </p>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-24 mb-8">
            <Reveal>
              <h2
                className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] text-center mb-10"
                style={{ fontSize: 'var(--text-section-title)' }}
              >
                More from {product.collection.charAt(0).toUpperCase() + product.collection.slice(1)}
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <a href={p.gallery ? `/product/${p.id}` : undefined}>
                    <ProductCard product={p} />
                  </a>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
