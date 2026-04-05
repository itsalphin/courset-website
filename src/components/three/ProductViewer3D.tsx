'use client';

import { Suspense, lazy } from 'react';
import type { CustomizationState } from '@/lib/types';

const ThreeCanvas = lazy(() => import('./ThreeCanvas'));

interface ProductViewer3DProps {
  state: CustomizationState;
}

export default function ProductViewer3D({ state }: ProductViewer3DProps) {
  return (
    <div className="w-full aspect-square bg-gradient-to-b from-[#FAFAF8] to-[#F0EFED] relative">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--gold-14k)] to-[var(--gold-18k)] opacity-20 animate-pulse" />
          </div>
        }
      >
        <ThreeCanvas state={state} />
      </Suspense>
    </div>
  );
}
