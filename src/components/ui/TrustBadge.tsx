import type { LucideIcon } from 'lucide-react';

interface TrustBadgeProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

export default function TrustBadge({ icon: Icon, label, className = '' }: TrustBadgeProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Icon
        size={18}
        strokeWidth={1.5}
        className="text-[var(--color-text-tertiary)] shrink-0"
      />
      <span className="font-[family-name:var(--font-body)] text-[var(--text-caption)] text-[var(--color-text-secondary)]">
        {label}
      </span>
    </div>
  );
}
