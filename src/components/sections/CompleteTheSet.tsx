'use client';

import Reveal from '@/components/ui/Reveal';
import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/lib/types';

interface CompleteTheSetProps {
  products: Product[];
}

export default function CompleteTheSet({ products }: CompleteTheSetProps) {
  if (products.length === 0) return null;

  return (
    <Reveal className="mt-16">
      <div className="border-t border-[var(--color-divider)] pt-12">
        <h3 className="font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-8">
          Complete Your Collection
        </h3>
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
          {products.map((product) => (
            <div key={product.id} className="min-w-[240px] max-w-[280px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
