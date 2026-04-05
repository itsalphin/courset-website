'use client';

import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  href,
  type = 'button',
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-[family-name:var(--font-body)] uppercase tracking-[0.15em] cursor-pointer transition-colors';

  const sizeStyles = {
    sm: 'px-5 py-2.5 text-[0.7rem]',
    md: 'px-8 py-3.5 text-[0.75rem]',
    lg: 'px-10 py-4 text-[0.8rem]',
  };

  const variantStyles = {
    primary:
      'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]',
    secondary:
      'bg-transparent text-[var(--color-text-primary)] border border-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-white',
    ghost:
      'bg-transparent text-[var(--color-accent)] border border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white',
  };

  const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}
