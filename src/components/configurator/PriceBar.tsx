'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, MessageCircle } from 'lucide-react';
import { formatPrice } from '@/lib/pricing';

interface PriceBarProps {
  price: number;
  /** Above the concierge threshold → route to a consultation instead of cart. */
  overThreshold: boolean;
  added: boolean;
  onAddToBag: () => void;
}

export default function PriceBar({ price, overThreshold, added, onAddToBag }: PriceBarProps) {
  return (
    <div className="bg-white p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <div className="flex items-baseline justify-between">
        <span className="font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
          Estimated Total
        </span>
        <motion.span
          key={price}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="font-[family-name:var(--font-body)] text-2xl font-medium text-[var(--color-accent-text)]"
          aria-live="polite"
        >
          {formatPrice(price)}
        </motion.span>
      </div>

      {overThreshold ? (
        <Link
          href="/concierge"
          className="mt-5 flex w-full items-center justify-center gap-2.5 bg-[var(--color-accent)] px-8 py-4 font-[family-name:var(--font-body)] text-[0.75rem] uppercase tracking-[0.15em] text-white transition-colors hover:bg-[var(--color-accent-hover)] cursor-pointer"
        >
          <MessageCircle size={16} strokeWidth={1.5} />
          Request a Private Consultation
        </Link>
      ) : (
        <motion.button
          onClick={onAddToBag}
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
      )}

      <p className="mt-4 text-center font-[family-name:var(--font-body)] text-[var(--text-caption)] leading-relaxed text-[var(--color-text-tertiary)]">
        Includes certificate of authenticity &middot; Free insured shipping &middot; Lifetime warranty
      </p>
      <p className="mt-2 text-center font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
        Estimate &middot; final price confirmed after consultation
      </p>
    </div>
  );
}
