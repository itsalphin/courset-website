'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import { getBlurDataURL } from '@/lib/blur-placeholders';

interface PreviewImageProps {
  /** Computed catalog path (may not exist yet). */
  src: string;
  /** Guaranteed-to-exist fallback (mapped product photo). */
  fallbackSrc?: string;
  alt: string;
}

/**
 * Renders the composed catalog image with a graceful fallback chain. Matches
 * the same load behavior used everywhere else on the site (AnimatedImage):
 * the element starts at opacity 0, then fades to 100% on `onLoad` over 200ms.
 * Subsequent src swaps stay seamless because the browser keeps the previous
 * frame painted until the new one is decoded.
 */
export default function PreviewImage({ src, fallbackSrc, alt }: PreviewImageProps) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  const candidates = [src, fallbackSrc].filter((c): c is string => Boolean(c));
  const shown = candidates.find((c) => !failed[c]);
  const blurDataURL = shown ? getBlurDataURL(shown) : null;

  return (
    <div
      className="relative aspect-square w-full overflow-hidden bg-[var(--color-bg-secondary)] ring-1 ring-[var(--color-border)]"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      {shown ? (
        <Image
          src={shown}
          alt={alt}
          fill
          quality={85}
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className={`object-cover transition-opacity duration-200 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed((f) => ({ ...f, [shown]: true }))}
          {...(blurDataURL ? { placeholder: 'blur' as const, blurDataURL } : {})}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[var(--color-text-tertiary)]">
          <ImageOff size={28} strokeWidth={1.25} />
          <span className="font-[family-name:var(--font-body)] text-[var(--text-caption)]">Preview imagery coming soon</span>
        </div>
      )}
    </div>
  );
}
