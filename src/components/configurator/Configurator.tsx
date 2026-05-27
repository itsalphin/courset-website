'use client';

import { useMemo, useState } from 'react';
import SectionLabel from '@/components/ui/SectionLabel';
import Reveal from '@/components/ui/Reveal';
import { useCart } from '@/lib/cart-context';
import { getProductById } from '@/lib/products';
import { formatPrice } from '@/lib/pricing';
import type { Product } from '@/lib/types';
import {
  type Piece,
  estimatePrice,
  imagePath,
  CONCIERGE_PRICE_THRESHOLD,
} from '@/lib/catalog';
import { getVisualAxes, getInformationalAxes } from '@/lib/catalog-axes';
import OptionSelector from './OptionSelector';
import PreviewImage from './PreviewImage';
import SpecSheet, { type SpecRow } from './SpecSheet';
import PriceBar from './PriceBar';

interface ConfiguratorProps {
  piece: Piece;
}

export default function Configurator({ piece }: ConfiguratorProps) {
  const { dispatch } = useCart();
  const [sel, setSel] = useState<Record<string, string | number>>({ ...piece.defaults });
  const [added, setAdded] = useState(false);

  const visualAxes = useMemo(() => getVisualAxes(piece, sel), [piece, sel]);
  const infoAxes = useMemo(() => getInformationalAxes(piece, sel), [piece, sel]);

  const price = estimatePrice(piece, sel);
  const overThreshold = price > CONCIERGE_PRICE_THRESHOLD;
  const previewSrc = imagePath(piece, sel);
  const fallbackSrc = (piece.siteProductId && getProductById(piece.siteProductId)?.image) || undefined;

  const setAxis = (key: string, value: string | number) => {
    setSel((s) => ({ ...s, [key]: value }));
  };

  const specRows: SpecRow[] = [...visualAxes, ...infoAxes]
    .map((a) => ({ label: a.label, value: a.options.find((o) => o.id === sel[a.key])?.label ?? '' }))
    .filter((r) => r.value);

  const visualSummary = visualAxes
    .map((a) => a.options.find((o) => o.id === sel[a.key])?.label)
    .filter(Boolean)
    .join(' · ');

  const handleAddToBag = () => {
    const variantKey = [...visualAxes, ...infoAxes].map((a) => `${a.key}-${sel[a.key]}`).join('_');
    const item: Product = {
      id: `${piece.id}__${variantKey}`,
      name: visualSummary ? `${piece.name} — ${visualSummary}` : piece.name,
      price,
      priceDisplay: formatPrice(price),
      collection: 'victory',
      category: piece.wearType === 'earring' ? 'earrings' : piece.wearType === 'necklace' ? 'necklace' : 'pendant',
      description: piece.name,
      badges: [],
      occasions: [],
      customizable: true,
      has3D: false,
      hasAR: false,
      image: fallbackSrc || previewSrc,
      complementaryIds: [],
    };
    dispatch({ type: 'ADD_ITEM', payload: { product: item, quantity: 1 } });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <main id="main-content" className="min-h-screen bg-[var(--color-bg-primary)]">
      <div className="mx-auto px-[var(--gutter)] pt-28 pb-20" style={{ maxWidth: 'var(--content-width)' }}>
        <Reveal>
          <SectionLabel>Customize</SectionLabel>
          <h1
            className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)]"
            style={{ fontSize: 'var(--text-section-title)' }}
          >
            {piece.name}
          </h1>
          <p className="mt-2 font-[family-name:var(--font-body)] text-[var(--text-caption)] capitalize text-[var(--color-text-tertiary)]">
            {piece.form} · {piece.wearType}
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-14">
          {/* LEFT — preview + live spec sheet (sticky) */}
          <div className="lg:col-span-3 lg:sticky lg:top-28 lg:self-start space-y-5">
            <PreviewImage
              src={previewSrc}
              fallbackSrc={fallbackSrc}
              alt={piece.name}
            />
            {!fallbackSrc && (
              <p className="font-[family-name:var(--font-body)] text-[0.7rem] text-[var(--color-text-tertiary)]">
                Preview updates with your design selections once catalog imagery is loaded.
              </p>
            )}
            <div className="bg-white p-6" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <SpecSheet rows={specRows} />
            </div>
          </div>

          {/* RIGHT — option axes + price */}
          <div className="lg:col-span-2 space-y-8">
            {visualAxes.length > 0 && (
              <section className="space-y-7">
                <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text-primary)]">Design</h2>
                {visualAxes.map((axis) => (
                  <OptionSelector key={axis.key} axis={axis} value={sel[axis.key]} onChange={(v) => setAxis(axis.key, v)} />
                ))}
              </section>
            )}

            {infoAxes.length > 0 && (
              <section className="space-y-7 border-t border-[var(--color-divider)] pt-8">
                <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text-primary)]">Specifications</h2>
                {infoAxes.map((axis) => (
                  <OptionSelector key={axis.key} axis={axis} value={sel[axis.key]} onChange={(v) => setAxis(axis.key, v)} />
                ))}
              </section>
            )}

            <PriceBar price={price} overThreshold={overThreshold} added={added} onAddToBag={handleAddToBag} />
          </div>
        </div>
      </div>
    </main>
  );
}
