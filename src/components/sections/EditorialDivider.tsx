import Reveal from '@/components/ui/Reveal';

interface EditorialDividerProps {
  quote: string;
}

export default function EditorialDivider({ quote }: EditorialDividerProps) {
  return (
    <Reveal>
      <div className="w-full py-20 md:py-28 bg-[var(--color-bg-inverse)] relative flex items-center justify-center">
        <div className="mx-auto px-[var(--gutter)] text-center" style={{ maxWidth: 'var(--narrow-width)' }}>
          <div className="w-12 h-px bg-[#D4B87A] mx-auto mb-8" />
          <p
            className="font-[family-name:var(--font-display)] italic text-white text-center leading-relaxed"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}
          >
            {quote}
          </p>
          <div className="w-12 h-px bg-[#D4B87A] mx-auto mt-8" />
        </div>
      </div>
    </Reveal>
  );
}
