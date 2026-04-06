'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

export default function ScrollTriggerRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
