'use client';

import { useState, useEffect } from 'react';

export function useARSupport(): boolean {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    async function check() {
      if (typeof window === 'undefined') return;
      // Only show AR on mobile/tablet
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (!isMobile) return;

      if ('xr' in navigator) {
        try {
          const xr = navigator as Navigator & { xr: { isSessionSupported: (mode: string) => Promise<boolean> } };
          const isSupported = await xr.xr.isSessionSupported('immersive-ar');
          setSupported(isSupported);
        } catch {
          setSupported(false);
        }
      }
    }
    check();
  }, []);

  return supported;
}
