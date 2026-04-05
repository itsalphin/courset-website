'use client';

import Reveal from '@/components/ui/Reveal';
import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/lib/types';

interface CollectionGridProps {
  products: Product[];
  columns?: 2 | 3;
}

export default function CollectionGrid({ products, columns = 3 }: CollectionGridProps) {
  const gridClass =
    columns === 2
      ? 'grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10'
      : 'grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8';

  return (
    <div className={gridClass}>
      {products.map((product, i) => (
        <Reveal key={product.id} delay={i * 0.08}>
          <ProductCard product={product} size={columns === 2 ? 'large' : 'default'} />
        </Reveal>
      ))}
    </div>
  );
}
