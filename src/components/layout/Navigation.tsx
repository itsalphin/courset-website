'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, ShoppingBag } from 'lucide-react';
import { EASE } from '@/lib/animations';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';

const navLinks = [
  { label: 'Collections', href: '/collections' },
  { label: 'Customize', href: '/customize' },
  { label: 'Our Story', href: '/story' },
  { label: 'Concierge', href: '/concierge' },
];

interface NavigationProps {
  variant?: 'light' | 'dark';
}

export default function Navigation({ variant = 'dark' }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const useDark = variant === 'dark' || scrolled;

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-divider)' : '1px solid transparent',
        }}
      >
        <nav className="mx-auto flex items-center justify-between px-[var(--gutter)] py-5" style={{ maxWidth: 'var(--max-width)' }}>
          {/* Logo */}
          <a
            href="/"
            className={`font-[family-name:var(--font-display)] text-2xl font-light tracking-[0.08em] transition-colors duration-300 ${useDark ? 'text-[var(--color-text-primary)]' : 'text-white'}`}
          >
            COURSET
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`font-[family-name:var(--font-body)] text-[0.85rem] font-light tracking-[0.22em] uppercase hover:text-[var(--color-accent)] transition-colors cursor-pointer ${useDark ? 'text-[var(--color-text-primary)]' : 'text-white/90'}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right icons: Account + Cart + Mobile menu */}
          <div className="flex items-center gap-5">
            {/* Account */}
            <a
              href={user ? '/profile' : '/login'}
              className={`p-1 transition-colors cursor-pointer ${useDark ? 'text-[var(--color-text-primary)] hover:text-[var(--color-accent)]' : 'text-white/90 hover:text-white'}`}
              aria-label={user ? 'My account' : 'Sign in'}
            >
              <User size={20} strokeWidth={1.5} />
            </a>

            {/* Cart */}
            <a
              href="/cart"
              className={`relative p-1 transition-colors cursor-pointer ${useDark ? 'text-[var(--color-text-primary)] hover:text-[var(--color-accent)]' : 'text-white/90 hover:text-white'}`}
              aria-label={`Shopping bag${totalItems > 0 ? ` (${totalItems} items)` : ''}`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-accent)] text-white text-[0.5rem] font-[family-name:var(--font-body)] font-medium rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </a>

            {/* Mobile hamburger */}
            <button
              className={`md:hidden p-1 cursor-pointer transition-colors duration-300 ${useDark ? 'text-[var(--color-text-primary)]' : 'text-white'}`}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-white flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="flex items-center justify-between px-[var(--gutter)] py-5">
              <a
                href="/"
                className="font-[family-name:var(--font-display)] text-2xl font-light tracking-[0.08em] text-[var(--color-text-primary)]"
              >
                COURSET
              </a>
              <button
                className="p-2 cursor-pointer text-[var(--color-text-primary)]"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-[family-name:var(--font-display)] text-3xl font-light tracking-[0.05em] text-[var(--color-text-primary)] cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4, ease: EASE }}
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Mobile auth + cart links */}
              <div className="border-t border-[var(--color-divider)] pt-6 mt-4 flex items-center gap-8">
                <motion.a
                  href={user ? '/profile' : '/login'}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <User size={18} strokeWidth={1.5} />
                  {user ? 'My Account' : 'Sign In'}
                </motion.a>
                <motion.a
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                >
                  <ShoppingBag size={18} strokeWidth={1.5} />
                  Bag {totalItems > 0 && `(${totalItems})`}
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
