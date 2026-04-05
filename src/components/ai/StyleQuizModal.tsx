'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { EASE } from '@/lib/animations';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/ui/ProductCard';
import { getProductById } from '@/lib/products';
import { getQuizRecommendations } from '@/lib/recommendations';
import type { QuizAnswers, Recommendation } from '@/lib/types';

interface StyleQuizModalProps {
  open: boolean;
  onClose: () => void;
}

const questions = [
  {
    key: 'style' as const,
    question: 'Which court style speaks to you?',
    options: [
      { value: 'minimalist', label: 'Minimalist' },
      { value: 'bold', label: 'Bold' },
      { value: 'classic', label: 'Classic' },
      { value: 'artistic', label: 'Artistic' },
    ],
  },
  {
    key: 'occasion' as const,
    question: 'What brings you here today?',
    options: [
      { value: 'self-reward', label: 'Self-Reward' },
      { value: 'gift', label: 'Gift for Someone' },
      { value: 'milestone', label: 'Celebrating a Milestone' },
      { value: 'everyday', label: 'Everyday Luxury' },
    ],
  },
  {
    key: 'metal' as const,
    question: 'Your metal preference?',
    options: [
      { value: 'yellow-gold', label: 'Yellow Gold' },
      { value: 'white-gold', label: 'White Gold' },
      { value: 'rose-gold', label: 'Rose Gold' },
      { value: 'surprise', label: 'Surprise Me' },
    ],
  },
  {
    key: 'diamond' as const,
    question: 'How do you feel about diamonds?',
    options: [
      { value: 'essential', label: 'Essential' },
      { value: 'nice-to-have', label: 'Nice to Have' },
      { value: 'not-for-me', label: 'Not for Me' },
    ],
  },
  {
    key: 'budget' as const,
    question: 'Your comfort zone?',
    options: [
      { value: 'under-1k', label: 'Under $1,000' },
      { value: '1k-3k', label: '$1,000–$3,000' },
      { value: '3k-7k', label: '$3,000–$7,000' },
      { value: '7k-plus', label: '$7,000+' },
    ],
  },
];

export default function StyleQuizModal({ open, onClose }: StyleQuizModalProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (key: string, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      // Use client-side recommendations as fallback
      setTimeout(() => {
        const recs = getQuizRecommendations(newAnswers as QuizAnswers);
        setResults(recs);
        setLoading(false);
      }, 800);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setAnswers({});
      setResults(null);
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[var(--color-overlay)]" onClick={handleClose} />

          {/* Modal */}
          <motion.div
            className="relative bg-white w-full max-w-lg mx-4 p-8 md:p-12 max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 cursor-pointer text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label="Close quiz"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {/* Progress dots */}
            {!results && (
              <div className="flex items-center justify-center gap-2 mb-8">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === step ? 'bg-[var(--color-accent)]' : i < step ? 'bg-[var(--color-accent)] opacity-40' : 'bg-[var(--color-border)]'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Question */}
            {!results && !loading && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-light text-[var(--color-text-primary)] text-center mb-8">
                    {questions[step].question}
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {questions[step].options.map((opt) => (
                      <motion.button
                        key={opt.value}
                        onClick={() => handleSelect(questions[step].key, opt.value)}
                        className="p-5 border border-[var(--color-border)] cursor-pointer hover:border-[var(--color-accent)] transition-colors text-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-primary)]">
                          {opt.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {/* Loading */}
            {loading && (
              <div className="text-center py-12">
                <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)]">
                  Finding your perfect pieces...
                </p>
              </div>
            )}

            {/* Results */}
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-light text-[var(--color-text-primary)] text-center mb-2">
                  Your Signature Pieces
                </h3>
                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] text-center mb-8">
                  Curated for your style
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {results.map((rec, i) => {
                    const product = getProductById(rec.productId);
                    if (!product) return null;
                    return (
                      <motion.div
                        key={rec.productId}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4, ease: EASE }}
                      >
                        <ProductCard product={product} />
                        <p className="mt-2 font-[family-name:var(--font-body)] text-[0.7rem] text-[var(--color-text-secondary)] leading-relaxed">
                          {rec.reason}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-8 text-center">
                  <Button variant="secondary" onClick={handleClose}>
                    Explore All Collections
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
