'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { EASE } from '@/lib/animations';
import { useAuth } from '@/lib/auth-context';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = isRegister
      ? await register(email, password, name)
      : await login(email, password);

    setLoading(false);

    if (result.success) {
      router.push('/profile');
    } else {
      setError(result.error || 'Something went wrong.');
    }
  };

  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center px-[var(--gutter)] pt-24 pb-16">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <a href="/" className="font-[family-name:var(--font-display)] text-3xl font-light tracking-[0.08em] text-[var(--color-text-primary)]">
              COURSET
            </a>
            <h1 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-light text-[var(--color-text-primary)]">
              {isRegister ? 'Create Your Account' : 'Welcome Back'}
            </h1>
            <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)]">
              {isRegister
                ? 'Join the COURSET community'
                : 'Sign in to your account'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="block font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={1}
                  maxLength={100}
                  className="w-full px-4 py-3.5 border border-[var(--color-border)] font-[family-name:var(--font-body)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                  placeholder="Your name"
                />
              </div>
            )}

            <div>
              <label className="block font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={254}
                className="w-full px-4 py-3.5 border border-[var(--color-border)] font-[family-name:var(--font-body)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block font-[family-name:var(--font-body)] text-[0.65rem] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={isRegister ? 12 : 1}
                maxLength={128}
                className="w-full px-4 py-3.5 border border-[var(--color-border)] font-[family-name:var(--font-body)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                placeholder={isRegister ? 'Minimum 12 characters' : 'Your password'}
                autoComplete={isRegister ? 'new-password' : 'current-password'}
              />
            </div>

            {error && (
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-error)] text-center">
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[var(--color-accent)] text-white font-[family-name:var(--font-body)] text-[0.75rem] font-medium uppercase tracking-[0.2em] cursor-pointer hover:bg-[var(--color-accent-hover)] transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </motion.button>
          </form>

          {/* Toggle */}
          <div className="mt-8 text-center">
            <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)]">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                className="text-[var(--color-accent-text)] underline cursor-pointer hover:text-[var(--color-accent-hover)] transition-colors"
              >
                {isRegister ? 'Sign In' : 'Create One'}
              </button>
            </p>
          </div>

          {!isRegister && (
            <div className="mt-4 text-center">
              <a
                href="/reset-password"
                className="font-[family-name:var(--font-body)] text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors cursor-pointer"
              >
                Forgot your password?
              </a>
            </div>
          )}

          {/* Trust line */}
          <div className="mt-10 text-center">
            <p className="font-[family-name:var(--font-body)] text-[0.6rem] uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
              Secure &middot; Encrypted &middot; Private
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
