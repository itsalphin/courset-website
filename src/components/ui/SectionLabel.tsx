interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export default function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <span
      className={`block font-[family-name:var(--font-body)] text-[0.8rem] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)] mb-5 ${className}`}
    >
      {children}
    </span>
  );
}
