'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { CustomizationState } from '@/lib/types';

interface JewelryPreviewProps {
  state: CustomizationState;
}

const metalColors: Record<string, { fill: string; stroke: string }> = {
  'yellow-gold-10': { fill: 'var(--gold-10k)', stroke: '#C4B88A' },
  'yellow-gold-14': { fill: 'var(--gold-14k)', stroke: '#C9A96E' },
  'yellow-gold-18': { fill: 'var(--gold-18k)', stroke: '#B8941A' },
  'yellow-gold-24': { fill: 'var(--gold-24k)', stroke: '#D4B800' },
  'white-gold': { fill: 'var(--white-gold)', stroke: '#C8C8C8' },
  'rose-gold': { fill: 'var(--rose-gold)', stroke: '#C89A88' },
  'platinum': { fill: 'var(--platinum)', stroke: '#B4B4B8' },
};

function getMetalKey(state: CustomizationState): string {
  if (state.metalType === 'yellow-gold') return `yellow-gold-${state.karat}`;
  return state.metalType;
}

function getShapeSVG(shape: CustomizationState['shape']): React.ReactNode {
  const common = { strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (shape) {
    case 'paddle':
      return <path d="M60 25C40 25 25 42 25 65v50c0 5 2.5 10 7.5 12.5L60 140l27.5-12.5c5-2.5 7.5-7.5 7.5-12.5V65c0-23-15-40-35-40z" {...common} />;
    case 'ball':
      return <circle cx="60" cy="75" r="45" {...common} />;
    case 'court':
      return <><rect x="15" y="30" width="90" height="90" rx="2" {...common} /><line x1="15" y1="75" x2="105" y2="75" {...common} /><line x1="60" y1="30" x2="60" y2="120" {...common} /></>;
    case 'net':
      return <><rect x="20" y="35" width="80" height="80" rx="2" {...common} /><line x1="20" y1="55" x2="100" y2="55" {...common} /><line x1="20" y1="75" x2="100" y2="75" {...common} /><line x1="20" y1="95" x2="100" y2="95" {...common} /><line x1="40" y1="35" x2="40" y2="115" {...common} /><line x1="60" y1="35" x2="60" y2="115" {...common} /><line x1="80" y1="35" x2="80" y2="115" {...common} /></>;
    case 'custom':
      return <path d="M60 15l12 37h39l-31.5 23 12 37L60 89 28.5 112l12-37L9 52h39L60 15z" {...common} />;
    default:
      return <circle cx="60" cy="75" r="45" {...common} />;
  }
}

export default function JewelryPreview({ state }: JewelryPreviewProps) {
  const metalKey = getMetalKey(state);
  const colors = metalColors[metalKey] || metalColors['yellow-gold-14'];
  const diamondScale = state.diamond.enabled ? 0.5 + state.diamond.size * 0.5 : 0;

  return (
    <div className="flex flex-col items-center">
      {/* Main preview */}
      <div className="relative w-full max-w-md aspect-square flex items-center justify-center bg-gradient-to-b from-[#FAFAF8] to-[#F0EFED] rounded-sm">
        <AnimatePresence mode="wait">
          <motion.svg
            key={`${state.shape}-${metalKey}`}
            width="120"
            height="150"
            viewBox="0 0 120 150"
            fill="none"
            className="w-40 h-48 md:w-52 md:h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Shadow */}
            <defs>
              <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={colors.fill} />
                <stop offset="50%" stopColor="white" stopOpacity="0.3" />
                <stop offset="100%" stopColor={colors.fill} />
              </linearGradient>
              <radialGradient id="shadowGrad">
                <stop offset="0%" stopColor="black" stopOpacity="0.08" />
                <stop offset="100%" stopColor="black" stopOpacity="0" />
              </radialGradient>
            </defs>
            <ellipse cx="60" cy="140" rx="35" ry="6" fill="url(#shadowGrad)" />
            <g fill={colors.fill} stroke={colors.stroke}>
              {getShapeSVG(state.shape)}
            </g>
            {/* Diamond */}
            {state.diamond.enabled && (
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: diamondScale }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ transformOrigin: '60px 65px' }}
              >
                <polygon
                  points="60,50 70,62 65,75 55,75 50,62"
                  fill="#F0F8FF"
                  stroke="#D0D8E0"
                  strokeWidth="0.5"
                  opacity="0.9"
                />
                <polygon
                  points="60,50 65,62 60,70 55,62"
                  fill="white"
                  opacity="0.6"
                />
              </motion.g>
            )}
          </motion.svg>
        </AnimatePresence>
      </div>

      {/* CAD sketch label */}
      <div className="mt-4 flex items-center gap-2">
        <div className="w-6 h-px bg-[var(--color-border)]" />
        <span className="font-[family-name:var(--font-body)] text-[0.6rem] uppercase tracking-[0.15em] text-[var(--color-text-tertiary)]">
          CAD Sketch Preview
        </span>
        <div className="w-6 h-px bg-[var(--color-border)]" />
      </div>
    </div>
  );
}
