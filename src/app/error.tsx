'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[var(--color-bg-primary)]">
      <span className="font-[family-name:var(--font-body)] text-[0.8rem] font-medium uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
        Error
      </span>
      <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl font-light text-[var(--color-text-primary)] mb-4 text-center">
        Something Went Wrong
      </h1>
      <p className="font-[family-name:var(--font-body)] text-base text-[var(--color-text-secondary)] mb-8 text-center max-w-[40ch]">
        We apologize for the inconvenience. Please try again.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center justify-center px-8 py-3.5 bg-[var(--color-accent)] text-white font-[family-name:var(--font-body)] text-[0.75rem] font-medium uppercase tracking-[0.2em] hover:bg-[var(--color-accent-hover)] transition-colors cursor-pointer"
      >
        Try Again
      </button>
    </div>
  );
}
