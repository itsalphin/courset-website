/**
 * Local config for the dedicated "Paddle Pavé Silver" customize page.
 * (Catalog identity: Paddle pendant — PE / .74CT / WG with cable chain.)
 * SINGLE configuration — no carat / color / metal variant selectors.
 * Edit price, descriptor, mosaic tile sizing, and asset paths here.
 */

export type TileSpan = 'wide' | 'tall' | 'square';

export interface MosaicImage {
  src: string;
  alt: string;
  /** Mosaic tile size for the still-image grid. */
  span: TileSpan;
}

export const paddlePaveSilver = {
  id: 'paddle-pave-silver', // matches products.ts id — gates the Customize button & builds the cart line
  name: 'Paddle Pavé Silver',
  productCode: 'GUP0006-VZ',
  eyebrow: 'Customize',
  descriptor: '.74ct pavé-set white-gold paddle pendant on a cable chain',
  tagline: 'Cool. Collected. Iconic.',
  description:
    'A full pickleball paddle rendered in 14K white gold and blanketed in pavé diamonds (0.74 ct twt), the handle rope-textured for authenticity. Rhodium-plated for lasting brilliance and suspended from a 20" cable chain — a cooler, contemporary take on our most iconic silhouette.',

  video: '/videos/paddle-pave-silver.mp4',
  // Poster frame shown before the video is seekable.
  poster: '/images/paddle-pave-silver-hero_white.jpg',

  // Single configuration price.
  price: 1520, // TODO: confirm price
  priceDisplay: '$1,520', // TODO: keep in sync with price above

  // Still gallery for the mosaic. `span` controls tile size for editorial rhythm.
  // Paddle shows front-pavé, angled/on-model, and lifestyle/detail views for variety.
  images: [
    { src: '/images/paddle-pave-silver-on_model.jpg', alt: 'Paddle Pavé Silver — worn on model', span: 'tall' },
    { src: '/images/paddle-pave-silver-hero_white.jpg', alt: 'Paddle Pavé Silver — front pavé view on white', span: 'square' },
    { src: '/images/paddle-pave-silver-lifestyle_velvet.jpg', alt: 'Paddle Pavé Silver — on dark velvet', span: 'wide' },
    { src: '/images/paddle-pave-silver-lifestyle_marble.jpg', alt: 'Paddle Pavé Silver — on marble surface', span: 'square' },
    { src: '/images/paddle-pave-silver-detail_macro.jpg', alt: 'Paddle Pavé Silver — macro detail of pavé and handle', span: 'square' },
    { src: '/images/paddle-pave-silver-hero_gradient.jpg', alt: 'Paddle Pavé Silver — gradient background', span: 'wide' },
  ] as MosaicImage[],
};

export type PaddlePaveConfig = typeof paddlePaveSilver;
