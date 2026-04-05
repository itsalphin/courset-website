interface PriceDisplayProps {
  price: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function PriceDisplay({ price, size = 'md', className = '' }: PriceDisplayProps) {
  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <span
      className={`font-[family-name:var(--font-body)] font-medium text-[var(--color-accent-text)] ${sizeStyles[size]} ${className}`}
    >
      {price}
    </span>
  );
}
