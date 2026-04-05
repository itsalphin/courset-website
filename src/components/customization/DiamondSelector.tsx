'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { CustomizationState } from '@/lib/types';

interface DiamondSelectorProps {
  diamond: CustomizationState['diamond'];
  onToggle: (enabled: boolean) => void;
  onSizeChange: (size: CustomizationState['diamond']['size']) => void;
  onCutChange: (cut: CustomizationState['diamond']['cut']) => void;
  onClarityChange: (clarity: CustomizationState['diamond']['clarity']) => void;
}

const sizes: CustomizationState['diamond']['size'][] = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0];
const cuts: { value: CustomizationState['diamond']['cut']; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'princess', label: 'Princess' },
  { value: 'cushion', label: 'Cushion' },
  { value: 'emerald', label: 'Emerald' },
];
const clarities: { value: CustomizationState['diamond']['clarity']; label: string; desc: string }[] = [
  { value: 'VS2', label: 'VS2', desc: 'Very Slightly Included' },
  { value: 'VS1', label: 'VS1', desc: 'Very Slightly Included' },
  { value: 'VVS2', label: 'VVS2', desc: 'Very Very Slightly Included' },
  { value: 'VVS1', label: 'VVS1', desc: 'Very Very Slightly Included' },
  { value: 'IF', label: 'IF', desc: 'Internally Flawless' },
];

export default function DiamondSelector({ diamond, onToggle, onSizeChange, onCutChange, onClarityChange }: DiamondSelectorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
          Diamond
        </h3>
        <button
          onClick={() => onToggle(!diamond.enabled)}
          className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${
            diamond.enabled ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]'
          }`}
          role="switch"
          aria-checked={diamond.enabled}
          aria-label="Add diamond"
        >
          <motion.span
            className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
            style={{ boxShadow: 'var(--shadow-sm)' }}
            animate={{ left: diamond.enabled ? '22px' : '2px' }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      <AnimatePresence>
        {diamond.enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-6 pt-2">
              {/* Size */}
              <div>
                <span className="block font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.15em] text-[var(--color-text-tertiary)] mb-3">
                  Carat Size
                </span>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => onSizeChange(s)}
                      className={`px-3.5 py-2 text-[0.7rem] font-[family-name:var(--font-body)] cursor-pointer transition-colors ${
                        diamond.size === s
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)]'
                      }`}
                    >
                      {s}ct
                    </button>
                  ))}
                </div>
              </div>

              {/* Cut */}
              <div>
                <span className="block font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.15em] text-[var(--color-text-tertiary)] mb-3">
                  Cut
                </span>
                <div className="flex flex-wrap gap-2">
                  {cuts.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => onCutChange(c.value)}
                      className={`px-3.5 py-2 text-[0.7rem] font-[family-name:var(--font-body)] cursor-pointer transition-colors ${
                        diamond.cut === c.value
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)]'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clarity */}
              <div>
                <span className="block font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.15em] text-[var(--color-text-tertiary)] mb-3">
                  Clarity
                </span>
                <div className="flex flex-wrap gap-2">
                  {clarities.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => onClarityChange(c.value)}
                      className={`group relative px-3.5 py-2 text-[0.7rem] font-[family-name:var(--font-body)] cursor-pointer transition-colors ${
                        diamond.clarity === c.value
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)]'
                      }`}
                      title={c.desc}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
