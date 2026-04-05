export interface Product {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  collection: 'victory' | 'signature' | 'legacy';
  category: 'pendant' | 'bracelet' | 'ring' | 'earrings' | 'cuff' | 'necklace' | 'charm' | 'commission';
  description: string;
  badges: string[];
  occasions: string[];
  customizable: boolean;
  has3D: boolean;
  hasAR: boolean;
  image: string;
  complementaryIds: string[];
  diamondSpec?: string;
}

export interface CustomizationState {
  shape: 'paddle' | 'ball' | 'court' | 'net' | 'custom';
  karat: 10 | 14 | 18 | 24;
  metalType: 'yellow-gold' | 'white-gold' | 'rose-gold' | 'platinum';
  diamond: {
    enabled: boolean;
    size: 0.25 | 0.5 | 0.75 | 1.0 | 1.5 | 2.0;
    cut: 'round' | 'princess' | 'cushion' | 'emerald';
    clarity: 'VS2' | 'VS1' | 'VVS2' | 'VVS1' | 'IF';
  };
  engraving: string;
  baseProduct: string;
}

export interface PriceBreakdown {
  base: number;
  metalCost: number;
  diamondCost: number;
  total: number;
}

export interface UserProfile {
  stylePreferences: string[];
  occasion: string | null;
  viewedProducts: string[];
  quizCompleted: boolean;
}

export interface QuizAnswers {
  style: 'minimalist' | 'bold' | 'classic' | 'artistic';
  occasion: 'self-reward' | 'gift' | 'milestone' | 'everyday';
  metal: 'yellow-gold' | 'white-gold' | 'rose-gold' | 'surprise';
  diamond: 'essential' | 'nice-to-have' | 'not-for-me';
  budget: 'under-1k' | '1k-3k' | '3k-7k' | '7k-plus';
}

export interface Recommendation {
  productId: string;
  reason: string;
}

export type CustomizationAction =
  | { type: 'SET_SHAPE'; payload: CustomizationState['shape'] }
  | { type: 'SET_KARAT'; payload: CustomizationState['karat'] }
  | { type: 'SET_METAL_TYPE'; payload: CustomizationState['metalType'] }
  | { type: 'TOGGLE_DIAMOND'; payload: boolean }
  | { type: 'SET_DIAMOND_SIZE'; payload: CustomizationState['diamond']['size'] }
  | { type: 'SET_DIAMOND_CUT'; payload: CustomizationState['diamond']['cut'] }
  | { type: 'SET_DIAMOND_CLARITY'; payload: CustomizationState['diamond']['clarity'] }
  | { type: 'SET_ENGRAVING'; payload: string }
  | { type: 'SET_BASE_PRODUCT'; payload: string };
