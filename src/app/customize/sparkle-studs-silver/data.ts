import type { ProductImage } from '@/lib/types';

/**
 * Local config for the dedicated "Sparkle Studs Silver" customize page.
 * Edit prices, descriptors, and asset paths here — everything on the page
 * reads from this object.
 */

export interface CaratVersion {
  id: string;
  /** Display label, e.g. "0.50ct twt" */
  label: string;
  /** Spec line shown in the summary */
  diamondSpec: string;
  /** Short marketing descriptor shown under the selector */
  descriptor: string;
  /** Numeric price in USD (used for cart math) */
  price: number;
  /** Pre-formatted price string */
  priceDisplay: string;
  /** OPTIONAL version-specific hero image. Omit to reuse the shared gallery. */
  // image?: string; // TODO: add per-carat imagery here if/when available
}

export const sparkleStudsSilver = {
  id: 'sparkle-studs-silver', // matches products.ts id — used to gate the Customize button & build the cart line
  name: 'Sparkle Studs Silver',
  productCode: 'GUE0003-VZ',
  eyebrow: 'Customize',
  collection: 'victory' as const,
  tagline: 'Cool brilliance.',
  description:
    'The white gold edition of our diamond-set pickleball studs — cooler in tone, equally brilliant. Rhodium-plated for lasting polish, these studs pair effortlessly with everything from courtside whites to evening black. Push-back posts engineered for all-day comfort.',

  // TODO: confirm this is the correct uploaded Sparkle Studs video.
  // It is the most-recently-added file in /public/videos (uploaded 2026-05-21).
  video: '/videos/nimbus-3e51e888-acdd-43b1-bcf2-644b2e393ff9.mp4',
  // Poster frame shown before the video is seekable.
  poster: '/images/sparkle-studs-silver-hero_white.jpg',

  // Shared still gallery (reused across all three carat versions).
  images: [
    { src: '/images/sparkle-studs-silver-hero_white.jpg', alt: 'Sparkle Studs Silver — front view on white background', label: 'Front View' },
    { src: '/images/sparkle-studs-silver-hero_gradient.jpg', alt: 'Sparkle Studs Silver — gradient background', label: 'Gradient' },
    { src: '/images/sparkle-studs-silver-on_model.jpg', alt: 'Sparkle Studs Silver — worn on model', label: 'On Model' },
    { src: '/images/sparkle-studs-silver-lifestyle_marble.jpg', alt: 'Sparkle Studs Silver — on marble surface', label: 'Lifestyle' },
    { src: '/images/sparkle-studs-silver-lifestyle_velvet.jpg', alt: 'Sparkle Studs Silver — on dark velvet', label: 'Velvet' },
    { src: '/images/sparkle-studs-silver-detail_macro.jpg', alt: 'Sparkle Studs Silver — macro detail of diamond setting', label: 'Detail' },
  ] as ProductImage[],

  // The ONLY variant axis: total diamond weight. No metal/color options.
  defaultVersionId: 'twt-050',
  caratVersions: [
    {
      id: 'twt-050',
      label: '0.50ct twt',
      diamondSpec: '0.50 ct twt · bezel-set brilliants',
      descriptor: 'Subtle, everyday sparkle.',
      price: 920, // TODO: confirm price for 0.50ct twt
      priceDisplay: '$920', // TODO: keep in sync with price above
    },
    {
      id: 'twt-075',
      label: '0.75ct twt',
      diamondSpec: '0.75 ct twt · bezel-set brilliants',
      descriptor: 'Balanced brilliance, elevated.',
      price: 1180, // TODO: confirm price for 0.75ct twt
      priceDisplay: '$1,180', // TODO: keep in sync with price above
    },
    {
      id: 'twt-098',
      label: '0.98ct twt',
      diamondSpec: '0.98 ct twt · bezel-set brilliants',
      descriptor: 'Full brilliance — a statement.',
      price: 1480, // TODO: confirm price for 0.98ct twt
      priceDisplay: '$1,480', // TODO: keep in sync with price above
    },
  ] as CaratVersion[],
};

export type SparkleStudsConfig = typeof sparkleStudsSilver;
