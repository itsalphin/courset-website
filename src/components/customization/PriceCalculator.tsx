'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { calculatePrice, formatPrice } from '@/lib/pricing';
import Button from '@/components/ui/Button';
import type { CustomizationState } from '@/lib/types';

interface PriceCalculatorProps {
  state: CustomizationState;
}

export default function PriceCalculator({ state }: PriceCalculatorProps) {
  const breakdown = calculatePrice(state);

  const metalLabel = `${state.karat}K ${state.metalType
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')}`;

  return (
    <div className="bg-white p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
      <h3 className="font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-5">
        Price Estimate
      </h3>

      <div className="space-y-3 mb-5">
        <div className="flex justify-between font-[family-name:var(--font-body)] text-sm">
          <span className="text-[var(--color-text-secondary)]">Base piece</span>
          <span className="text-[var(--color-text-primary)]">{formatPrice(breakdown.base)}</span>
        </div>
        <div className="flex justify-between font-[family-name:var(--font-body)] text-sm">
          <span className="text-[var(--color-text-secondary)]">Metal ({metalLabel})</span>
          <span className="text-[var(--color-text-primary)]">+{formatPrice(breakdown.metalCost)}</span>
        </div>
        <AnimatePresence>
          {state.diamond.enabled && (
            <motion.div
              className="flex justify-between font-[family-name:var(--font-body)] text-sm"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-[var(--color-text-secondary)]">
                Diamond ({state.diamond.size}ct {state.diamond.clarity} {state.diamond.cut.charAt(0).toUpperCase() + state.diamond.cut.slice(1)})
              </span>
              <span className="text-[var(--color-text-primary)]">+{formatPrice(breakdown.diamondCost)}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="border-t border-[var(--color-divider)] pt-3 flex justify-between" aria-live="polite" aria-atomic="true">
          <span className="font-[family-name:var(--font-body)] text-sm font-medium text-[var(--color-text-primary)]">
            Estimated Total
          </span>
          <motion.span
            key={breakdown.total}
            className="font-[family-name:var(--font-body)] text-lg font-medium text-[var(--color-accent-text)]"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {formatPrice(breakdown.total)}
          </motion.span>
        </div>
      </div>

      <Button variant="primary" className="w-full mb-4">
        Begin Your Commission
      </Button>

      <p className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)] text-center leading-relaxed">
        Includes certificate of authenticity &middot; Free insured shipping &middot; Lifetime warranty
      </p>
      <p className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)] text-center mt-2">
        Final price confirmed after consultation
      </p>
      <p className="text-center mt-2">
        <a
          href="#concierge"
          className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-secondary)] underline cursor-pointer hover:text-[var(--color-text-primary)] transition-colors"
        >
          Complimentary Sizing Kit
        </a>
      </p>
    </div>
  );
}
