/**
 * ============================================================================
 * COURSET — MASTER CATALOG CONFIGURATION
 * ============================================================================
 * Single source of truth for the customizer. Read by the UI to render only the
 * option axes each piece actually supports, by the price engine to estimate
 * cost, and by you/your manufacturer as the asset checklist.
 *
 *   ⚠️ ALL PRICES BELOW ARE PLACEHOLDERS — replace with real pricing. (// TODO)
 *   ⚠️ ALL IMAGE PATHS ARE CONVENTIONS — wire to real asset filenames. (// TODO)
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// SHARED OPTION VOCABULARIES
// ----------------------------------------------------------------------------

export type Form = 'ball' | 'paddle' | 'court';
export type WearType = 'pendant' | 'earring';
export type AxisKind = 'visual' | 'informational';

/** Metal COLOR is visual (changes the photo). */
export const METAL_COLORS = [
  { id: 'yellow', label: 'Yellow Gold', code: '-50', priceAdd: 0, kind: 'visual' as AxisKind },
  { id: 'white', label: 'White Gold', code: '-VZ', priceAdd: 0, kind: 'visual' as AxisKind },
  { id: 'twotone', label: 'Two-Tone', code: '-V', priceAdd: 150, kind: 'visual' as AxisKind }, // ⚠️ paddle only? confirm
];

/** Karat is INFORMATIONAL — looks ~identical in a photo, changes price/durability. */
export const KARATS = [
  { id: '10k', label: '10K', multiplier: 1.0, note: 'Most durable. Best for daily wear.', kind: 'informational' as AxisKind },
  { id: '14k', label: '14K', multiplier: 1.15, note: 'Our most popular. Daily wear, lasting shine.', kind: 'informational' as AxisKind },
  { id: '18k', label: '18K', multiplier: 1.4, note: 'Richer color, softer metal. Special occasions.', kind: 'informational' as AxisKind },
];

/** Stone treatment is VISUAL. Not every form supports every treatment. */
export const TREATMENTS = [
  { id: 'plain', label: 'Polished (no stones)', kind: 'visual' as AxisKind },
  { id: 'gypsy', label: 'Gypsy-Set (flush diamonds)', kind: 'visual' as AxisKind }, // ball only
  { id: 'outline', label: 'Diamond Outline', kind: 'visual' as AxisKind }, // court only
  { id: 'pave', label: 'Full Pavé', kind: 'visual' as AxisKind },
  { id: 'baguette', label: 'Baguette-Set', kind: 'visual' as AxisKind }, // court only
];

/** Accent / stone type is VISUAL (court family). */
export const ACCENTS = [
  { id: 'diamond', label: 'Diamond', priceAdd: 0, kind: 'visual' as AxisKind },
  { id: 'emerald', label: 'Emerald Accent', priceAdd: 1800, kind: 'visual' as AxisKind }, // GSP0482EM precedent
  { id: 'enamel', label: 'Enamel Court Color', priceAdd: 0, kind: 'visual' as AxisKind },
];

/** Enamel court colors — VISUAL, only when accent = enamel. The ownable feature. */
export const ENAMEL_COLORS = [
  { id: 'blue-green', label: 'Blue + Green (Classic Court)', kind: 'visual' as AxisKind },
  // ⚠️ confirm whether other color pairs are orderable (club/team colors = great upsell)
];

/** Earring back — VISUAL-ish, earring family only. */
export const EARRING_BACKS = [
  { id: 'lever', label: 'Lever Back', priceAdd: 0, kind: 'visual' as AxisKind },
  { id: 'post', label: 'Post / Stud', priceAdd: 0, kind: 'visual' as AxisKind },
];

/** Chain length — INFORMATIONAL, pendant family. */
export const CHAIN_LENGTHS = [
  { id: 16, label: '16"', priceAdd: 0, kind: 'informational' as AxisKind },
  { id: 18, label: '18"', priceAdd: 0, kind: 'informational' as AxisKind },
  { id: 20, label: '20"', priceAdd: 40, kind: 'informational' as AxisKind },
];

/** Cut & clarity — INFORMATIONAL. Show on the spec sheet, never the photo. */
export const CUT_GRADES = [
  { id: 'vg', label: 'Very Good', multiplier: 1.0, kind: 'informational' as AxisKind },
  { id: 'ex', label: 'Excellent', multiplier: 1.12, kind: 'informational' as AxisKind },
  { id: 'id', label: 'Ideal', multiplier: 1.25, kind: 'informational' as AxisKind },
];
export const CLARITIES = [
  { id: 'vs', label: 'VS', multiplier: 1.0, kind: 'informational' as AxisKind },
  { id: 'vvs', label: 'VVS', multiplier: 1.2, kind: 'informational' as AxisKind },
  { id: 'if', label: 'IF', multiplier: 1.5, kind: 'informational' as AxisKind },
];

// ----------------------------------------------------------------------------
// PIECE TYPE
// ----------------------------------------------------------------------------

export interface Piece {
  id: string;
  name: string;
  codes: string[];
  form: Form;
  wearType: WearType;
  siteProductId: string | null;
  basePrice: number; // ⚠️ TODO placeholder
  axes: {
    metalColor?: string[];
    karat?: string[];
    treatment?: string[];
    accent?: string[];
    enamelColor?: string[];
    earringBack?: string[];
    chainLength?: number[];
    caratVersion?: number[];
    cutGrade?: string[];
    clarity?: string[];
  };
  defaults: Record<string, string | number>;
  video?: string | null; // ⚠️ TODO path
  imageBase: string; // ⚠️ TODO path
  notes?: string;
}

// ----------------------------------------------------------------------------
// THE CATALOG
// ----------------------------------------------------------------------------

export const CATALOG: Piece[] = [
  // ========================= BALL FAMILY =========================
  // One piece per wear type. Finish = "Polished" hides the diamond-only axes
  // (caratVersion / cut / clarity); Finish = "Gypsy-Set" reveals them.
  {
    id: 'ball-pendant',
    name: 'Pickleball Pendant',
    codes: ['PGYPSY', 'PPICKLEB', 'GUP0002', 'GUP0003-50-1.00', 'GUP0003-VZ-1.00'],
    form: 'ball', wearType: 'pendant',
    siteProductId: 'diamond-ball-pendant',
    basePrice: 480, // TODO — polished floor; diamond config adds carat × RATE
    axes: {
      treatment: ['plain', 'gypsy'],
      caratVersion: [0.2, 0.25, 0.5, 0.75, 1.0],
      metalColor: ['yellow', 'white'],
      karat: ['14k', '18k'],
      chainLength: [16, 18, 20],
      cutGrade: ['vg', 'ex', 'id'],
      clarity: ['vs', 'vvs', 'if'],
    },
    defaults: { treatment: 'gypsy', caratVersion: 0.5, metalColor: 'white', karat: '14k', chainLength: 18, cutGrade: 'ex', clarity: 'vs' },
    video: null, // TODO
    imageBase: '/images/catalog/ball-pendant', // TODO
    notes: 'Diamond axes (carat/cut/clarity) hide when Finish = Polished.',
  },
  {
    id: 'ball-earring',
    name: 'Pickleball Earrings',
    codes: ['EGYPSY', 'EPICKLEB', 'GUE0001', 'GUE0002', 'GUE0003-50-1.00', 'GUE0004-50-1.00', 'GUE0003-VZ-1.00', 'GUE0004-VZ-1.00'],
    form: 'ball', wearType: 'earring',
    siteProductId: 'sparkle-drops-silver',
    basePrice: 520, // TODO — polished floor; diamond config adds carat × RATE
    axes: {
      treatment: ['plain', 'gypsy'],
      caratVersion: [0.5, 0.75, 0.98],
      metalColor: ['yellow', 'white'],
      karat: ['14k', '18k'],
      earringBack: ['lever', 'post'],
      cutGrade: ['vg', 'ex', 'id'],
      clarity: ['vs', 'vvs', 'if'],
    },
    defaults: { treatment: 'gypsy', caratVersion: 0.5, metalColor: 'white', karat: '14k', earringBack: 'lever', cutGrade: 'ex', clarity: 'vs' },
    video: null, imageBase: '/images/catalog/ball-earring',
    notes: "Lever-back gypsy = 'Sparkle Drops Silver'. Diamond axes hide when Finish = Polished.",
  },

  // ========================= PADDLE FAMILY =========================
  {
    id: 'paddle-pendant-pave',
    name: 'Paddle Pavé Pendant',
    codes: ['GUP0006', 'GUP0006-VZ', 'GUP0007-50', 'GUP0007-VZ', 'PADDLE/.74CT/WG'],
    form: 'paddle', wearType: 'pendant',
    siteProductId: 'paddle-pave-silver', // ⚠️ confirm — page already built
    basePrice: 1450, // TODO
    axes: {
      treatment: ['pave'],
      metalColor: ['yellow', 'white', 'twotone'],
      karat: ['14k', '18k'],
      chainLength: [16, 18, 20],
      cutGrade: ['vg', 'ex', 'id'],
      clarity: ['vs', 'vvs', 'if'],
    },
    defaults: { treatment: 'pave', metalColor: 'white', karat: '14k', chainLength: 18, cutGrade: 'ex', clarity: 'vs' },
    video: null, imageBase: '/images/catalog/paddle-pendant-pave',
    notes: 'Two-tone (-V) shows a contrasting gold ball accent on a white paddle.',
  },
  {
    id: 'paddle-pendant-plain',
    name: 'Paddle Pendant — Textured',
    codes: ['GUP0004', 'GUP0004-V'],
    form: 'paddle', wearType: 'pendant',
    siteProductId: null,
    basePrice: 890, // TODO
    axes: {
      treatment: ['plain'],
      metalColor: ['yellow', 'white', 'twotone'],
      karat: ['14k', '18k'],
      chainLength: [16, 18, 20],
    },
    defaults: { treatment: 'plain', metalColor: 'yellow', karat: '14k', chainLength: 18 },
    video: null, imageBase: '/images/catalog/paddle-pendant-plain',
  },

  // ========================= COURT / BAR FAMILY =========================
  {
    id: 'court-pendant-plain',
    name: 'Pickleball Court Pendant — Polished',
    codes: ['PICKLE BALL COURT'],
    form: 'court', wearType: 'pendant',
    siteProductId: null,
    basePrice: 650, // TODO
    axes: {
      treatment: ['plain'],
      metalColor: ['yellow', 'white'],
      karat: ['14k', '18k'],
      chainLength: [16, 18, 20],
    },
    defaults: { treatment: 'plain', metalColor: 'white', karat: '14k', chainLength: 18 },
    video: null, imageBase: '/images/catalog/court-pendant-plain',
  },
  {
    id: 'court-pendant-outline',
    name: 'Court Bar — Diamond Outline',
    codes: ['ASP0419', 'ASP0420', 'GUP0010-50', 'GUP0010-VZ', 'GUP0001-50', 'GUP0001-VZ'],
    form: 'court', wearType: 'pendant',
    siteProductId: null,
    basePrice: 1200, // TODO  (catalog .65CT)
    axes: {
      treatment: ['outline'],
      accent: ['diamond'],
      metalColor: ['yellow', 'white'],
      karat: ['14k', '18k'],
      chainLength: [16, 18, 20],
      cutGrade: ['vg', 'ex', 'id'],
      clarity: ['vs', 'vvs', 'if'],
    },
    defaults: { treatment: 'outline', accent: 'diamond', metalColor: 'white', karat: '14k', chainLength: 18, cutGrade: 'ex', clarity: 'vs' },
    video: null, imageBase: '/images/catalog/court-pendant-outline',
  },
  {
    id: 'court-pendant-pave',
    name: 'Court Bar — Full Pavé / Baguette',
    codes: ['GSP0480', 'GSP0481', 'GSP0482EM', 'GUP0011-50', 'GUP0011-VZ', 'GUP0012-50', 'GUP0012-VZ'],
    form: 'court', wearType: 'pendant',
    siteProductId: null,
    basePrice: 6800, // TODO  (catalog 8.40–9.00CT — high end)
    axes: {
      treatment: ['pave', 'baguette'],
      accent: ['diamond', 'emerald'],
      metalColor: ['yellow', 'white'],
      karat: ['14k', '18k'],
      chainLength: [16, 18, 20],
      cutGrade: ['vg', 'ex', 'id'],
      clarity: ['vs', 'vvs', 'if'],
    },
    defaults: { treatment: 'pave', accent: 'diamond', metalColor: 'white', karat: '14k', chainLength: 18, cutGrade: 'ex', clarity: 'vs' },
    video: null, imageBase: '/images/catalog/court-pendant-pave',
    notes: 'High-stone-count → route to concierge above price threshold.',
  },
  {
    id: 'court-pendant-enamel',
    name: 'Court Bar — Enamel Colors',
    codes: ['GSP0483', 'GSP0484', 'GUP0014-50', 'GUP0014-VZ'],
    form: 'court', wearType: 'pendant',
    siteProductId: null,
    basePrice: 2400, // TODO  (.70CT + enamel)
    axes: {
      treatment: ['pave', 'plain'],
      accent: ['enamel'],
      enamelColor: ['blue-green'],
      metalColor: ['yellow', 'white'],
      karat: ['14k', '18k'],
      chainLength: [16, 18, 20],
    },
    defaults: { treatment: 'pave', accent: 'enamel', enamelColor: 'blue-green', metalColor: 'white', karat: '14k', chainLength: 18 },
    video: null, imageBase: '/images/catalog/court-pendant-enamel',
    notes: 'Enamel court-color is the most ownable feature. Custom color pairs = strong upsell.',
  },
];

// ----------------------------------------------------------------------------
// IMAGE PATH RESOLVER — composes a filename from the VISUAL selections only
// ----------------------------------------------------------------------------
/**
 * Convention: {imageBase}/{metalColor}-{treatment}[-{accent}][-{enamelColor}][-{caratVersion}][-{earringBack}].jpg
 * Informational axes (karat, cut, clarity, chainLength) are intentionally absent.
 */
export function imagePath(piece: Piece, sel: Record<string, string | number>): string {
  const parts = [
    sel.metalColor,
    sel.treatment,
    sel.accent && sel.accent !== 'diamond' ? sel.accent : null, // diamond is the default, omit
    sel.enamelColor,
    sel.caratVersion,
    sel.earringBack, // ball earrings differ lever vs post visually
  ].filter((p) => p !== undefined && p !== null && p !== '');
  return `${piece.imageBase}/${parts.join('-')}.jpg`.toLowerCase();
}

// ----------------------------------------------------------------------------
// PRICE ENGINE — reads the SAME selections so price never drifts from the UI
// ----------------------------------------------------------------------------
export function estimatePrice(piece: Piece, sel: Record<string, string | number>): number {
  let p = piece.basePrice;

  const karat = KARATS.find((k) => k.id === sel.karat);
  if (karat) p *= karat.multiplier;

  const metal = METAL_COLORS.find((m) => m.id === sel.metalColor);
  if (metal) p += metal.priceAdd;

  const accent = ACCENTS.find((a) => a.id === sel.accent);
  if (accent) p += accent.priceAdd;

  // Diamond-only math only applies when the piece is actually stoned.
  const hasStones = sel.treatment !== 'plain';

  if (hasStones && typeof sel.caratVersion === 'number') {
    const RATE = 1600; // TODO per-family rate
    p += sel.caratVersion * RATE;
  }

  if (hasStones) {
    const cut = CUT_GRADES.find((c) => c.id === sel.cutGrade);
    if (cut) p *= cut.multiplier;

    const clarity = CLARITIES.find((c) => c.id === sel.clarity);
    if (clarity) p *= clarity.multiplier;
  }

  const chain = CHAIN_LENGTHS.find((c) => c.id === sel.chainLength);
  if (chain) p += chain.priceAdd;

  return Math.round(p);
}

// ----------------------------------------------------------------------------
// CONVENIENCE LOOKUPS
// ----------------------------------------------------------------------------
export const byForm = (form: Form) => CATALOG.filter((p) => p.form === form);
export const byId = (id: string) => CATALOG.find((p) => p.id === id);
export const bySiteProduct = (sid: string) => CATALOG.find((p) => p.siteProductId === sid);

/** Threshold above which a build should route to the concierge instead of cart. */
export const CONCIERGE_PRICE_THRESHOLD = 5000; // TODO
