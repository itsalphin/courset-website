'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function ConciergeButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.2 }}
            className="bg-white px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.15em] text-[var(--color-text-primary)] font-[family-name:var(--font-body)] whitespace-nowrap"
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            Virtual Concierge
          </motion.span>
        )}
      </AnimatePresence>
      <motion.a
        href="/concierge"
        className="w-12 h-12 rounded-full bg-white border border-[var(--color-accent)] flex items-center justify-center cursor-pointer"
        style={{ boxShadow: 'var(--shadow-md)' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        aria-label="Open virtual concierge"
      >
        <Sparkles size={18} strokeWidth={1.5} className="text-[var(--color-accent)]" />
      </motion.a>
    </div>
  );
}
