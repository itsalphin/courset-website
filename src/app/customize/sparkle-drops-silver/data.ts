/**
 * Local config for the dedicated "Sparkle Drops Silver" customize page.
 * (Catalog identity: Pickleball Ball Diamond Earrings with Lever Back.)
 * Edit prices, descriptors, mosaic tile sizing, and asset paths here.
 */

export type TileSpan = 'wide' | 'tall' | 'square';

export interface MosaicImage {
  src: string;
  alt: string;
  /** Mosaic tile size for the still-image grid. */
  span: TileSpan;
}

export interface CaratVersion {
  id: string;
  label: string;          // e.g. "0.50ct twt"
  diamondSpec: string;    // shown in the summary
  descriptor: string;     // short marketing line under the selector
  price: number;          // USD, used for cart math
  priceDisplay: string;   // pre-formatted
}

export const sparkleDropsSilver = {
  id: 'sparkle-drops-silver', // matches products.ts id — gates the Customize button & builds the cart line
  name: 'Sparkle Drops Silver',
  productCode: 'GUE0004-VZ',
  eyebrow: 'Customize',
  collection: 'victory' as const,
  tagline: 'Ice and fire.',
  description:
    'White gold lever-back drop earrings with fully diamond-set pickleball spheres. The cool rhodium finish gives these drops an icy elegance — perfect for the player who prefers silver to gold but refuses to compromise on sparkle. Secure lever-back closure keeps each sphere swinging in motion.',

  // TODO: confirm this is the correct uploaded Sparkle Drops video.
  // It is the most-recently-added file in /public/videos (uploaded 2026-05-21 19:34).
  video: '/videos/nimbus-80b72e5d-0dcd-4341-8410-f9bb6bf5dbe2.mp4',
  // Poster frame shown before the video is seekable.
  poster: '/images/sparkle-drops-silver-hero_white.jpg',

  // Still gallery for the mosaic. `span` controls tile size for editorial rhythm.
  images: [
    { src: '/images/sparkle-drops-silver-on_model.jpg', alt: 'Sparkle Drops Silver — worn on model', span: 'tall' },
    { src: '/images/sparkle-drops-silver-hero_white.jpg', alt: 'Sparkle Drops Silver — front view on white', span: 'square' },
    { src: '/images/sparkle-drops-silver-lifestyle_velvet.jpg', alt: 'Sparkle Drops Silver — on dark velvet', span: 'wide' },
    { src: '/images/sparkle-drops-silver-lifestyle_marble.jpg', alt: 'Sparkle Drops Silver — on marble surface', span: 'square' },
    { src: '/images/sparkle-drops-silver-detail_macro.jpg', alt: 'Sparkle Drops Silver — macro detail of diamond setting', span: 'square' },
    { src: '/images/sparkle-drops-silver-hero_gradient.jpg', alt: 'Sparkle Drops Silver — gradient background', span: 'wide' },
  ] as MosaicImage[],

  // The ONLY variant axis: total diamond weight. No metal/color options.
  defaultVersionId: 'twt-050',
  caratVersions: [
    {
      id: 'twt-050',
      label: '0.50ct twt',
      diamondSpec: '0.50 ct twt · bezel-set brilliants',
      descriptor: 'Subtle, everyday sparkle.',
      price: 1180, // TODO: confirm price for 0.50ct twt
      priceDisplay: '$1,180', // TODO: keep in sync with price above
    },
    {
      id: 'twt-075',
      label: '0.75ct twt',
      diamondSpec: '0.75 ct twt · bezel-set brilliants',
      descriptor: 'Balanced brilliance, elevated.',
      price: 1480, // TODO: confirm price for 0.75ct twt
      priceDisplay: '$1,480', // TODO: keep in sync with price above
    },
    {
      id: 'twt-098',
      label: '0.98ct twt',
      diamondSpec: '0.98 ct twt · bezel-set brilliants',
      descriptor: 'Full brilliance — a statement.',
      price: 1820, // TODO: confirm price for 0.98ct twt
      priceDisplay: '$1,820', // TODO: keep in sync with price above
    },
  ] as CaratVersion[],
};

export type SparkleDropsConfig = typeof sparkleDropsSilver;
