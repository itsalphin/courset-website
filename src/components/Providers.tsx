'use client';

import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import ScrollTriggerRefresh from '@/components/providers/ScrollTriggerRefresh';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <SmoothScrollProvider>
          <ScrollTriggerRefresh />
          {children}
        </SmoothScrollProvider>
      </CartProvider>
    </AuthProvider>
  );
}
