'use client';

import { motion } from 'framer-motion';
import type { CustomizationState } from '@/lib/types';

interface ShapeSelectorProps {
  selected: CustomizationState['shape'];
  onSelect: (shape: CustomizationState['shape']) => void;
}

const shapes: { value: CustomizationState['shape']; label: string; path: string }[] = [
  {
    value: 'paddle',
    label: 'Paddle',
    path: 'M12 3C8 3 5 6 5 10v8c0 1 .5 2 1.5 2.5L12 22l5.5-1.5C18.5 20 19 19 19 18v-8c0-4-3-7-7-7z',
  },
  {
    value: 'ball',
    label: 'Ball',
    path: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14z',
  },
  {
    value: 'court',
    label: 'Court',
    path: 'M3 5h18v14H3V5zm0 7h18M12 5v14',
  },
  {
    value: 'net',
    label: 'Net',
    path: 'M3 8h18M3 12h18M3 16h18M7 6v12M12 6v12M17 6v12',
  },
  {
    value: 'custom',
    label: 'Custom',
    path: 'M12 2l2.4 7.4H22l-6 4.4 2.3 7.2L12 17l-6.3 4L8 13.8 2 9.4h7.6L12 2z',
  },
];

export default function ShapeSelector({ selected, onSelect }: ShapeSelectorProps) {
  return (
    <div>
      <h3 className="font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-4">
        Shape
      </h3>
      <div className="grid grid-cols-5 gap-3">
        {shapes.map((shape) => (
          <motion.button
            key={shape.value}
            onClick={() => onSelect(shape.value)}
            className={`flex flex-col items-center gap-2 p-3 border cursor-pointer transition-colors ${
              selected === shape.value
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
                : 'border-[var(--color-border)] hover:border-[var(--color-text-tertiary)]'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-text-primary)]">
              <path d={shape.path} />
            </svg>
            <span className="font-[family-name:var(--font-body)] text-[0.6rem] uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">
              {shape.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
