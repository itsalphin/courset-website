'use client';

import { AuthProvider } from '@/lib/auth-context';
import { CartProvider } from '@/lib/cart-context';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </CartProvider>
    </AuthProvider>
  );
}
