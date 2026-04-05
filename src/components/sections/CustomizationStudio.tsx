'use client';

import { useReducer } from 'react';
import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import SectionLabel from '@/components/ui/SectionLabel';
import Button from '@/components/ui/Button';
import ProductSelector from '@/components/customization/ProductSelector';
import ShapeSelector from '@/components/customization/ShapeSelector';
import KaratSelector from '@/components/customization/KaratSelector';
import DiamondSelector from '@/components/customization/DiamondSelector';
import PriceCalculator from '@/components/customization/PriceCalculator';
import { getProductById } from '@/lib/products';
import type { CustomizationState, CustomizationAction, Product } from '@/lib/types';

const initialState: CustomizationState = {
  shape: 'paddle',
  karat: 14,
  metalType: 'yellow-gold',
  diamond: {
    enabled: false,
    size: 0.5,
    cut: 'round',
    clarity: 'VS1',
  },
  engraving: '',
  baseProduct: 'court-pendant',
};

function reducer(state: CustomizationState, action: CustomizationAction): CustomizationState {
  switch (action.type) {
    case 'SET_SHAPE':
      return { ...state, shape: action.payload };
    case 'SET_KARAT':
      return { ...state, karat: action.payload };
    case 'SET_METAL_TYPE':
      return { ...state, metalType: action.payload };
    case 'TOGGLE_DIAMOND':
      return { ...state, diamond: { ...state.diamond, enabled: action.payload } };
    case 'SET_DIAMOND_SIZE':
      return { ...state, diamond: { ...state.diamond, size: action.payload } };
    case 'SET_DIAMOND_CUT':
      return { ...state, diamond: { ...state.diamond, cut: action.payload } };
    case 'SET_DIAMOND_CLARITY':
      return { ...state, diamond: { ...state.diamond, clarity: action.payload } };
    case 'SET_ENGRAVING':
      return { ...state, engraving: action.payload };
    case 'SET_BASE_PRODUCT':
      return { ...state, baseProduct: action.payload };
    default:
      return state;
  }
}

interface CustomizationStudioProps {
  compact?: boolean;
}

export default function CustomizationStudio({ compact = false }: CustomizationStudioProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const selectedProduct = getProductById(state.baseProduct);

  const handleProductSelect = (product: Product) => {
    dispatch({ type: 'SET_BASE_PRODUCT', payload: product.id });
    // If Legacy product, enable diamond by default
    if (product.collection === 'legacy' && product.diamondSpec) {
      dispatch({ type: 'TOGGLE_DIAMOND', payload: true });
    }
  };

  if (compact) {
    return (
      <section className="bg-[var(--color-bg-secondary)]" style={{ padding: 'var(--space-section) 0' }}>
        <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
          <Reveal>
            <SectionLabel>Customization Studio</SectionLabel>
            <h2
              className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-4"
              style={{ fontSize: 'var(--text-section-title)' }}
            >
              Make It Yours
            </h2>
            <p className="font-[family-name:var(--font-body)] text-[var(--text-body-lg)] text-[var(--color-text-secondary)] leading-relaxed mb-10 max-w-[55ch]">
              Every piece in our collection can be personalized. Choose your product,
              select your metal, add a diamond — make it unmistakably yours.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <Reveal>
              {/* Show selected product image */}
              <div className="aspect-square relative overflow-hidden bg-[#FAFAF8]">
                {selectedProduct && (
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
              </div>
              {selectedProduct && (
                <div className="mt-4 text-center">
                  <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text-primary)]">
                    {selectedProduct.name}
                  </h3>
                  <p className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-secondary)] mt-1">
                    {selectedProduct.description}
                  </p>
                </div>
              )}
            </Reveal>
            <Reveal delay={0.15}>
              <div className="space-y-8">
                <ProductSelector
                  selectedId={state.baseProduct}
                  onSelect={handleProductSelect}
                />
                <div className="pt-4">
                  <Button variant="primary" href="/customize">
                    Open Full Studio
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      <div className="mx-auto px-[var(--gutter)] pt-28 pb-20" style={{ maxWidth: 'var(--max-width)' }}>
        <Reveal>
          <SectionLabel>Customization Studio</SectionLabel>
          <h1
            className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-4"
            style={{ fontSize: 'var(--text-section-title)' }}
          >
            Design Your Piece
          </h1>
          <p className="font-[family-name:var(--font-body)] text-[var(--text-body-lg)] text-[var(--color-text-secondary)] leading-relaxed mb-12 max-w-[55ch]">
            Select any piece from our collections, then personalize every detail —
            shape, metal, karat, diamond, engraving.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Preview — 3 cols, sticky on desktop */}
          <div className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start" style={{ maxHeight: 'calc(100vh - 6rem)' }}>
            <div className="w-full relative overflow-hidden bg-[#FAFAF8]" style={{ height: 'calc(100vh - 16rem)' }}>
              {selectedProduct && (
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-contain p-8"
                />
              )}
            </div>
            {selectedProduct && (
              <div className="mt-4">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-text-primary)]">
                    {selectedProduct.name}
                  </h2>
                  <span className="font-[family-name:var(--font-body)] text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                    {selectedProduct.collection} Collection
                  </span>
                </div>
                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] mt-2 max-w-[50ch]">
                  {selectedProduct.description}
                </p>
                {selectedProduct.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedProduct.badges.map((badge) => (
                      <span
                        key={badge}
                        className="bg-[var(--color-accent-subtle)] text-[var(--color-accent-hover)] px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.1em] font-[family-name:var(--font-body)]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Controls — 2 cols, scrolls naturally */}
          <div className="lg:col-span-2 space-y-8">
            <ProductSelector
              selectedId={state.baseProduct}
              onSelect={handleProductSelect}
            />

            <div className="border-t border-[var(--color-divider)] pt-8">
              <h3 className="font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-6">
                Personalize
              </h3>
              <div className="space-y-8">
                <ShapeSelector
                  selected={state.shape}
                  onSelect={(s) => dispatch({ type: 'SET_SHAPE', payload: s })}
                />
                <KaratSelector
                  karat={state.karat}
                  metalType={state.metalType}
                  onKaratChange={(k) => dispatch({ type: 'SET_KARAT', payload: k })}
                  onMetalChange={(m) => dispatch({ type: 'SET_METAL_TYPE', payload: m })}
                />
                <DiamondSelector
                  diamond={state.diamond}
                  onToggle={(e) => dispatch({ type: 'TOGGLE_DIAMOND', payload: e })}
                  onSizeChange={(s) => dispatch({ type: 'SET_DIAMOND_SIZE', payload: s })}
                  onCutChange={(c) => dispatch({ type: 'SET_DIAMOND_CUT', payload: c })}
                  onClarityChange={(c) => dispatch({ type: 'SET_DIAMOND_CLARITY', payload: c })}
                />

                {/* Engraving */}
                {selectedProduct?.customizable && (
                  <div>
                    <h3 className="font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-3">
                      Engraving
                    </h3>
                    <input
                      type="text"
                      value={state.engraving}
                      onChange={(e) => dispatch({ type: 'SET_ENGRAVING', payload: e.target.value })}
                      placeholder="Your text (up to 20 characters)"
                      maxLength={20}
                      className="w-full px-4 py-3 border border-[var(--color-border)] font-[family-name:var(--font-body)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                    />
                    <p className="mt-1.5 font-[family-name:var(--font-body)] text-[0.65rem] text-[var(--color-text-tertiary)]">
                      {state.engraving.length}/20 characters
                    </p>
                  </div>
                )}
              </div>
            </div>

            <PriceCalculator state={state} />
          </div>
        </div>
      </div>
    </div>
  );
}
