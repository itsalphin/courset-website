'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { products } from '@/lib/products';
import type { Product } from '@/lib/types';

interface ProductSelectorProps {
  selectedId: string;
  onSelect: (product: Product) => void;
}

const collectionLabels: Record<string, string> = {
  victory: '01 — Victory',
  signature: '02 — Signature',
  legacy: '03 — Legacy',
};

export default function ProductSelector({ selectedId, onSelect }: ProductSelectorProps) {
  const collections = ['victory', 'signature', 'legacy'] as const;

  return (
    <div>
      <h3 className="font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-6">
        Select a Piece
      </h3>

      {collections.map((col) => {
        const colProducts = products.filter((p) => p.collection === col);
        return (
          <div key={col} className="mb-8">
            <span className="block font-[family-name:var(--font-body)] text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-accent)] mb-3">
              {collectionLabels[col]}
            </span>
            <div className="grid grid-cols-3 gap-2">
              {colProducts.map((product) => (
                <motion.button
                  key={product.id}
                  onClick={() => onSelect(product)}
                  className={`relative cursor-pointer overflow-hidden transition-all ${
                    selectedId === product.id
                      ? 'ring-2 ring-[var(--color-accent)]'
                      : 'ring-1 ring-[var(--color-border)] hover:ring-[var(--color-text-tertiary)]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                  <div className="px-1.5 py-1.5 bg-white">
                    <span className="block font-[family-name:var(--font-body)] text-[0.55rem] text-[var(--color-text-primary)] truncate leading-tight">
                      {product.name}
                    </span>
                    <span className="block font-[family-name:var(--font-body)] text-[0.5rem] text-[var(--color-accent-text)]">
                      {product.priceDisplay}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
