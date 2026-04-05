'use client';

import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';

interface StyleQuizProps {
  onOpenQuiz: () => void;
}

export default function StyleQuiz({ onOpenQuiz }: StyleQuizProps) {
  return (
    <Reveal>
      <div className="bg-[var(--color-bg-tertiary)] py-16 md:py-20 text-center">
        <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--narrow-width)' }}>
          <h2 className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)] text-2xl md:text-3xl mb-3">
            Not Sure Where to Start?
          </h2>
          <p className="font-[family-name:var(--font-body)] text-[var(--text-body)] text-[var(--color-text-secondary)] mb-8">
            Take our 60-second style quiz and discover the pieces that match your game.
          </p>
          <Button variant="primary" onClick={onOpenQuiz}>
            Take the Style Quiz
          </Button>
        </div>
      </div>
    </Reveal>
  );
}
