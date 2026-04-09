import type { CustomizationState, PriceBreakdown } from './types';

const BASE_PRICES: Record<string, number> = {
  // Category-based
  pendant: 500,
  bracelet: 750,
  ring: 600,
  earrings: 450,
  statement_pendant: 2000,
  charm_bracelet: 3100,
  cuff: 4500,
  championship_ring: 5000,
  necklace: 5200,
  diamond_ring: 8500,
  diamond_pendant: 12000,
  // Product-ID-based (maps every product directly)
  'court-pendant': 520,
  'rally-bracelet': 680,
  'match-point-studs': 450,
  'ace-pendant': 750,
  'first-win-ring': 890,
  'drop-shot-charm': 560,
  'signature-ring': 2200,
  'heritage-charm-bracelet': 3100,
  'statement-court-pendant': 2800,
  'milestone-cuff': 4500,
  'custom-initial-earrings': 2400,
  'champions-necklace': 5200,
  'dynasty-diamond-ring': 8500,
  'grand-slam-pendant': 12000,
  'legacy-championship-bracelet': 9800,
  'bespoke-commission': 7000,
  'court-royale-pendant': 980,
};

const KARAT_MULTIPLIERS: Record<number, number> = {
  10: 1.0,
  14: 1.4,
  18: 1.85,
  24: 2.5,
};

const METAL_SURCHARGES: Record<string, number> = {
  'yellow-gold': 0,
  'white-gold': 150,
  'rose-gold': 200,
  'platinum': 800,
};

const DIAMOND_PRICES_PER_CARAT: Record<string, number> = {
  VS2: 3000,
  VS1: 4200,
  VVS2: 5800,
  VVS1: 7500,
  IF: 12000,
};

const CUT_MODIFIERS: Record<string, number> = {
  round: 1.0,
  princess: 0.85,
  cushion: 0.9,
  emerald: 0.95,
};

export function calculatePrice(state: CustomizationState): PriceBreakdown {
  const base = BASE_PRICES[state.baseProduct] ?? 500;
  const metalCost =
    base * KARAT_MULTIPLIERS[state.karat] + METAL_SURCHARGES[state.metalType];
  let diamondCost = 0;
  if (state.diamond.enabled) {
    diamondCost =
      state.diamond.size *
      DIAMOND_PRICES_PER_CARAT[state.diamond.clarity] *
      CUT_MODIFIERS[state.diamond.cut];
  }
  return {
    base,
    metalCost: metalCost - base,
    diamondCost,
    total: metalCost + diamondCost,
  };
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
