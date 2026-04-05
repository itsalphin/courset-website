import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import Providers from '@/components/Providers';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'COURSET\u2122 \u2014 Luxury Pickleball Jewelry | Worn from the Court',
  description:
    'Handcrafted luxury jewelry inspired by the game of pickleball. From entry-level gold pieces to diamond-set heirlooms \u2014 crafted by hand, designed with intention, made to be remembered.',
  openGraph: {
    title: 'COURSET\u2122 \u2014 Luxury Pickleball Jewelry',
    description: 'Worn from the Court. Handcrafted jewelry for the pickleball community.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body)]">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-[var(--color-text-primary)] focus:shadow-lg focus:text-sm">
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
