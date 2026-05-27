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
  /**
   * Other variant URLs to warm the Vercel image optimizer cache for. Rendered
   * as hidden <Image> elements once the visible image has loaded — silent,
   * background-only, no UI impact. Without this, the optimizer is cold the
   * first time a user picks any new variant (collections doesn't have this
   * problem because every product image is in the prerendered HTML up-front).
   */
  prefetchSrcs?: string[];
}

export default function PreviewImage({ src, fallbackSrc, alt, prefetchSrcs = [] }: PreviewImageProps) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  const candidates = [src, fallbackSrc].filter((c): c is string => Boolean(c));
  const shown = candidates.find((c) => !failed[c]);
  const blurDataURL = shown ? getBlurDataURL(shown) : null;

  // Only kick off the warming once the visible image is in — never compete with
  // the one the user is actually looking at.
  const toWarm = loaded ? prefetchSrcs.filter((u) => u !== shown && !failed[u]) : [];

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

      {/*
        Hidden cache-warmer. Same sizes+quality as the visible image so the
        srcset entries match — the browser hits the same /_next/image URLs the
        visible image will request when the user clicks an option, so those
        responses are sitting in Vercel's edge cache.
      */}
      <div className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
        {toWarm.map((u) => (
          <Image
            key={u}
            src={u}
            alt=""
            fill
            quality={85}
            sizes="(max-width: 1024px) 100vw, 55vw"
            loading="eager"
          />
        ))}
      </div>
    </div>
  );
}
