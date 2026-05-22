'use client';

import type { ResolvedAxis } from '@/lib/catalog-axes';

interface OptionSelectorProps {
  axis: ResolvedAxis;
  value: string | number;
  onChange: (value: string | number) => void;
}

export default function OptionSelector({ axis, value, onChange }: OptionSelectorProps) {
  const selected = axis.options.find((o) => o.id === value);

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-[family-name:var(--font-body)] text-[var(--text-label)] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
          {axis.label}
        </h3>
        {axis.kind === 'informational' && (
          <span className="font-[family-name:var(--font-body)] text-[0.55rem] uppercase tracking-[0.18em] text-[var(--color-text-tertiary)]">
            Affects price &amp; spec
          </span>
        )}
      </div>

      <div role="radiogroup" aria-label={axis.label} className="flex flex-wrap gap-2.5">
        {axis.options.map((o) => {
          const isSel = o.id === value;
          return (
            <button
              key={String(o.id)}
              role="radio"
              aria-checked={isSel}
              onClick={() => onChange(o.id)}
              className={`flex min-h-[44px] items-center justify-center px-4 py-2.5 font-[family-name:var(--font-body)] text-[0.8rem] tracking-[0.04em] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 ${
                isSel
                  ? 'border border-[var(--color-accent)] bg-[var(--color-accent-subtle)] text-[var(--color-accent-text)]'
                  : 'border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-tertiary)]'
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>

      {selected?.note && (
        <p className="mt-2 font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-tertiary)]">
          {selected.note}
        </p>
      )}
    </div>
  );
}
