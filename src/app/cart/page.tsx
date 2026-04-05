'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { EASE } from '@/lib/animations';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/pricing';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';

export default function CartPage() {
  const { state, dispatch, totalItems, totalPrice } = useCart();

  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen bg-[var(--color-bg-primary)] pt-28 pb-20">
        <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
          <Reveal>
            <span className="block font-[family-name:var(--font-body)] text-[0.8rem] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)] mb-3">
              Shopping Bag
            </span>
            <h1 className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] mb-10" style={{ fontSize: 'var(--text-section-title)' }}>
              Your Bag {totalItems > 0 && `(${totalItems})`}
            </h1>
          </Reveal>

          {state.items.length === 0 ? (
            <Reveal>
              <div className="text-center py-20 bg-[var(--color-bg-secondary)]">
                <ShoppingBag size={40} strokeWidth={1} className="text-[var(--color-text-tertiary)] mx-auto mb-6" />
                <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-text-primary)] mb-3">
                  Your bag is empty
                </h2>
                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] mb-8 max-w-[35ch] mx-auto">
                  Discover our collections and find the piece that tells your story.
                </p>
                <Button variant="primary" href="/collections">
                  Explore Collections
                </Button>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-0">
                {state.items.map((item, i) => (
                  <motion.div
                    key={item.product.id}
                    className="flex gap-6 py-8 border-b border-[var(--color-divider)]"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: EASE }}
                  >
                    {/* Image */}
                    <div className="w-28 h-28 md:w-36 md:h-36 relative shrink-0 bg-[#FAFAF8]">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        sizes="150px"
                        className="object-contain p-2"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text-primary)]">
                              {item.product.name}
                            </h3>
                            <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-text-tertiary)] uppercase tracking-[0.15em] mt-1">
                              {item.product.collection} Collection
                            </p>
                          </div>
                          <button
                            onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.product.id })}
                            className="p-1.5 text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <X size={16} strokeWidth={1.5} />
                          </button>
                        </div>
                        {item.customization && (
                          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-text-secondary)] mt-2">
                            {item.customization.karat}K {item.customization.metalType?.replace('-', ' ')}
                            {item.customization.diamond ? ' + Diamond' : ''}
                            {item.customization.engraving ? ` — "${item.customization.engraving}"` : ''}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity */}
                        <div className="flex items-center border border-[var(--color-border)]">
                          <button
                            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: item.product.id, quantity: item.quantity - 1 } })}
                            className="px-3 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} strokeWidth={1.5} />
                          </button>
                          <span className="px-4 py-2 font-[family-name:var(--font-body)] text-sm text-[var(--color-text-primary)] min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: item.product.id, quantity: item.quantity + 1 } })}
                            className="px-3 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} strokeWidth={1.5} />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="font-[family-name:var(--font-body)] text-base font-medium text-[var(--color-accent-text)]">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Order summary */}
              <div className="lg:col-span-1">
                <div className="bg-[var(--color-bg-secondary)] p-8 sticky top-28">
                  <h3 className="font-[family-name:var(--font-body)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-6">
                    Order Summary
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between font-[family-name:var(--font-body)] text-sm">
                      <span className="text-[var(--color-text-secondary)]">Subtotal ({totalItems} items)</span>
                      <span className="text-[var(--color-text-primary)]">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between font-[family-name:var(--font-body)] text-sm">
                      <span className="text-[var(--color-text-secondary)]">Shipping</span>
                      <span className="text-[var(--color-success)]">Complimentary</span>
                    </div>
                  </div>

                  <div className="border-t border-[var(--color-border)] pt-4 mb-8">
                    <div className="flex justify-between">
                      <span className="font-[family-name:var(--font-body)] text-sm font-medium text-[var(--color-text-primary)]">Total</span>
                      <span className="font-[family-name:var(--font-body)] text-lg font-medium text-[var(--color-accent-text)]">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <Button variant="primary" className="w-full mb-4" href="/login">
                    Proceed to Checkout
                  </Button>

                  <p className="font-[family-name:var(--font-body)] text-[0.6rem] text-[var(--color-text-tertiary)] text-center uppercase tracking-[0.15em]">
                    Free insured shipping &middot; Secure checkout &middot; 30-day returns
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
