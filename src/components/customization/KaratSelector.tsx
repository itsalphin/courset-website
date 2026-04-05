'use client';

import { motion } from 'framer-motion';
import type { CustomizationState } from '@/lib/types';

interface KaratSelectorProps {
  karat: CustomizationState['karat'];
  metalType: CustomizationState['metalType'];
  onKaratChange: (k: CustomizationState['karat']) => void;
  onMetalChange: (m: CustomizationState['metalType']) => void;
}

const karats: CustomizationState['karat'][] = [10, 14, 18, 24];
const metals: { value: CustomizationState['metalType']; label: string; swatch: string }[] = [
  { value: 'yellow-gold', label: 'Yellow Gold', swatch: 'var(--gold-14k)' },
  { value: 'white-gold', label: 'White Gold', swatch: 'var(--white-gold)' },
  { value: 'rose-gold', label: 'Rose Gold', swatch: 'var(--rose-gold)' },
  { value: 'platinum', label: 'Platinum', swatch: 'var(--platinum)' },
];

export default function KaratSelector({ karat, metalType, onKaratChange, onMetalChange }: KaratSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Karat */}
      <div>
        <h3 className="font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-4">
          Karat
        </h3>
        <div className="flex gap-2">
          {karats.map((k) => (
            <motion.button
              key={k}
              onClick={() => onKaratChange(k)}
              className={`px-5 py-2.5 text-[0.7rem] uppercase tracking-[0.15em] font-[family-name:var(--font-body)] cursor-pointer transition-colors ${
                karat === k
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {k}K
            </motion.button>
          ))}
        </div>
      </div>

      {/* Metal Type */}
      <div>
        <h3 className="font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-4">
          Metal
        </h3>
        <div className="flex flex-wrap gap-3">
          {metals.map((m) => (
            <motion.button
              key={m.value}
              onClick={() => onMetalChange(m.value)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.1em] font-[family-name:var(--font-body)] cursor-pointer transition-colors ${
                metalType === m.value
                  ? 'bg-[var(--color-accent)] text-white'
                  : 'bg-transparent text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: m.swatch }}
              />
              {m.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
