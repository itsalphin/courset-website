'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react';
import { EASE } from '@/lib/animations';
import { useAuth } from '@/lib/auth-context';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <>
        <Navigation />
        <main id="main-content" className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
        </main>
      </>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-[var(--color-bg-primary)] pt-28 pb-20">
        <div className="mx-auto px-[var(--gutter)]" style={{ maxWidth: 'var(--content-width)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {/* Profile header */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="block font-[family-name:var(--font-body)] text-[0.8rem] font-medium uppercase tracking-[0.25em] text-[var(--color-accent)] mb-3">
                  My Account
                </span>
                <h1 className="font-[family-name:var(--font-display)] font-light text-[var(--color-text-primary)]" style={{ fontSize: 'var(--text-section-title)' }}>
                  Welcome, {user.name}
                </h1>
                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] mt-2">
                  {user.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 font-[family-name:var(--font-body)] text-[0.7rem] uppercase tracking-[0.2em] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
              >
                <LogOut size={16} strokeWidth={1.5} />
                Sign Out
              </button>
            </div>

            {/* Dashboard grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { icon: User, label: 'Profile Details', desc: 'Name, email, password', href: '#' },
                { icon: ShoppingBag, label: 'Order History', desc: 'Track your commissions', href: '#' },
                { icon: Heart, label: 'Wishlist', desc: 'Saved pieces', href: '#' },
                { icon: Settings, label: 'Settings', desc: 'Preferences & security', href: '#' },
              ].map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="block p-8 bg-white border border-[var(--color-divider)] hover:border-[var(--color-accent)] transition-colors cursor-pointer group"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <item.icon size={24} strokeWidth={1.5} className="text-[var(--color-accent)] mb-4" />
                  <h3 className="font-[family-name:var(--font-display)] text-lg text-[var(--color-text-primary)] mb-1">
                    {item.label}
                  </h3>
                  <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)]">
                    {item.desc}
                  </p>
                </motion.a>
              ))}
            </div>

            {/* Recent orders placeholder */}
            <div className="mb-12">
              <h2 className="font-[family-name:var(--font-display)] text-xl font-light text-[var(--color-text-primary)] mb-6">
                Recent Orders
              </h2>
              <div className="bg-[var(--color-bg-secondary)] p-10 text-center">
                <ShoppingBag size={32} strokeWidth={1} className="text-[var(--color-text-tertiary)] mx-auto mb-4" />
                <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-text-secondary)] mb-4">
                  No orders yet. Your commissions will appear here.
                </p>
                <Button variant="primary" href="/collections">
                  Explore Collections
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
