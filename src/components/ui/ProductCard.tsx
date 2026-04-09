'use client';

import { motion } from 'framer-motion';
import { Box, Smartphone, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/cart-context';
import AnimatedImage from './AnimatedImage';
import PriceDisplay from './PriceDisplay';

interface ProductCardProps {
  product: Product;
  size?: 'default' | 'large';
  onView3D?: (productId: string) => void;
}

export default function ProductCard({ product, size = 'default', onView3D }: ProductCardProps) {
  const { dispatch } = useCart();
  const hasDetailPage = product.gallery && product.gallery.length > 0;

  const handleCardClick = () => {
    if (hasDetailPage) {
      window.location.href = `/product/${product.id}`;
    }
  };

  return (
    <motion.article
      className="group cursor-pointer"
      onClick={handleCardClick}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Image */}
      <div
        className={`relative w-full overflow-hidden mb-4 ${
          size === 'large' ? 'aspect-[3/4]' : 'aspect-[3/4]'
        }`}
        style={{ boxShadow: 'var(--shadow-sm)' }}
      >
        <AnimatedImage
          src={product.image}
          alt={product.name}
          sizes={size === 'large' ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 33vw'}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* 3D badge */}
        {product.has3D && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView3D?.(product.id);
            }}
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 text-[0.65rem] uppercase tracking-[0.15em] text-[var(--color-text-primary)] cursor-pointer hover:bg-white transition-colors"
          >
            <Box size={12} strokeWidth={1.5} />
            View in 3D
          </button>
        )}

        {/* AR badge — mobile only */}
        {product.hasAR && (
          <button
            className="absolute top-3 left-3 md:hidden flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 text-[0.65rem] uppercase tracking-[0.15em] text-[var(--color-text-primary)] cursor-pointer hover:bg-white transition-colors"
          >
            <Smartphone size={12} strokeWidth={1.5} />
            Try On
          </button>
        )}

        {/* Badges */}
        {product.badges.length > 0 && (
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className="bg-[var(--color-accent-subtle)] backdrop-blur-sm text-[var(--color-accent-hover)] px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.1em] font-[family-name:var(--font-body)]"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <h3 className="font-[family-name:var(--font-display)] text-lg font-normal text-[var(--color-text-primary)] mb-1">
        {product.name}
      </h3>
      <PriceDisplay price={product.priceDisplay} size="sm" className="mb-1.5 block" />
      <p className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
        Certificate of Authenticity Included
      </p>

      {product.diamondSpec && (
        <p className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-secondary)] mt-1">
          {product.diamondSpec}
        </p>
      )}

      {/* Add to bag */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch({ type: 'ADD_ITEM', payload: { product, quantity: 1 } });
        }}
        className="mt-3 flex items-center gap-2 font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.15em] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors cursor-pointer"
      >
        <ShoppingBag size={13} strokeWidth={1.5} />
        Add to Bag
      </button>
    </motion.article>
  );
}
