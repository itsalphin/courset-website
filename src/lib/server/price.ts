/**
 * Server-side price authority. Checkout MUST NOT trust client-supplied prices
 * (`POST /api/checkout` with `{priceInCents: 1}` would otherwise let anyone
 * buy anything for a penny). Every cart line is re-resolved here from its
 * product id, and the result replaces whatever the client sent.
 *
 * Id formats handled:
 *   1. Plain static product:   "court-royale-pendant"
 *   2. Static-product variant: "sparkle-studs-silver__twt-050"
 *   3. Configurator derived:   "ball-pendant__metalColor-yellow_treatment-plain_..."
 *
 * Returns null when the id is unknown — callers should reject the request.
 */
import { products } from '@/lib/products';
import { byId, estimatePrice } from '@/lib/catalog';
import { sparkleStudsSilver } from '@/app/customize/sparkle-studs-silver/data';
import { sparkleDropsSilver } from '@/app/customize/sparkle-drops-silver/data';
import { paddlePaveSilver } from '@/app/customize/paddle-pave-silver/data';

/** Bespoke registry — id of the showcase product → its priced variants (or single price). */
const BESPOKE: Record<string, { variants?: Record<string, number>; price?: number }> = {
  [sparkleStudsSilver.id]: {
    variants: Object.fromEntries(sparkleStudsSilver.caratVersions.map((v) => [v.id, v.price])),
  },
  [sparkleDropsSilver.id]: {
    variants: Object.fromEntries(sparkleDropsSilver.caratVersions.map((v) => [v.id, v.price])),
  },
  [paddlePaveSilver.id]: { price: paddlePaveSilver.price },
};

const toCents = (dollars: number) => Math.round(dollars * 100);

export function resolvePriceCents(productId: string): number | null {
  if (typeof productId !== 'string' || productId.length === 0) return null;

  const sepIdx = productId.indexOf('__');
  if (sepIdx === -1) {
    // No variant suffix → static product OR bespoke single-price piece.
    const bespoke = BESPOKE[productId];
    if (bespoke?.price !== undefined) return toCents(bespoke.price);

    const product = products.find((p) => p.id === productId);
    if (product) return toCents(product.price);
    return null;
  }

  const baseId = productId.slice(0, sepIdx);
  const variantPart = productId.slice(sepIdx + 2);

  // Configurator-derived: variant part contains underscores joining `key-value` pairs.
  if (variantPart.includes('_')) {
    const piece = byId(baseId);
    if (!piece) return null;

    const sel: Record<string, string | number> = { ...piece.defaults };
    for (const segment of variantPart.split('_')) {
      const dash = segment.indexOf('-');
      if (dash < 1) continue;
      const key = segment.slice(0, dash);
      const value = segment.slice(dash + 1);
      // Numeric axes (caratVersion, chainLength) — parse with finite-number guard.
      if (key === 'caratVersion' || key === 'chainLength') {
        const n = Number(value);
        if (Number.isFinite(n)) sel[key] = n;
      } else if (value.length > 0 && value.length <= 64) {
        sel[key] = value;
      }
    }
    return toCents(estimatePrice(piece, sel));
  }

  // Single-token variant → bespoke caratVersion (no static product has a
  // `variants` field in the current Product type, so it's bespoke-only).
  const bespoke = BESPOKE[baseId];
  if (bespoke?.variants) {
    const price = bespoke.variants[variantPart];
    if (typeof price === 'number') return toCents(price);
  }

  return null;
}
