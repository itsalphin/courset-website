'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

interface PreviewImageProps {
  /** Computed catalog path (may not exist yet). */
  src: string;
  /** Guaranteed-to-exist fallback (mapped product photo). */
  fallbackSrc?: string;
  alt: string;
  /**
   * Parent-controlled "configuring" state. When true, a subtle pulse overlays
   * the preview — quick tactile feedback on selection changes.
   */
  loading?: boolean;
  /**
   * Other variant URLs to prefetch in the background (browser cache) so option
   * swaps are instant. Catalog URLs only; emitted as <link rel="prefetch">.
   */
  prefetchSrcs?: string[];
}

const isCatalog = (u?: string) => Boolean(u && u.startsWith('/images/catalog/'));

/**
 * Renders the composed catalog image; falls back to the mapped product photo,
 * then a styled placeholder. Catalog images are served unoptimized (raw JPG)
 * so the URL matches the prefetch URL — meaning every variant is sitting in
 * the browser cache by the time the user clicks an option.
 */
export default function PreviewImage({ src, fallbackSrc, alt, loading = false, prefetchSrcs = [] }: PreviewImageProps) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const candidates = [src, fallbackSrc].filter((c): c is string => Boolean(c));
  const shown = candidates.find((c) => !failed[c]);

  // De-dupe prefetch list and exclude the currently shown image (already in DOM).
  const seen = new Set<string>([shown ?? '']);
  const prefetch = prefetchSrcs.filter((u) => isCatalog(u) && !seen.has(u) && (seen.add(u), true));

  return (
    <div
      className="relative aspect-square w-full overflow-hidden bg-[var(--color-bg-secondary)] ring-1 ring-[var(--color-border)]"
      style={{ boxShadow: 'var(--shadow-sm)' }}
      aria-busy={loading || undefined}
    >
      {/*
        Browser-cache warmer: idle-priority prefetch of every catalog variant for
        this piece. React hoists <link> to <head> automatically.
      */}
      {prefetch.map((u) => (
        <link key={u} rel="prefetch" as="image" href={u} />
      ))}

      {shown ? (
        // No `key` on purpose: keeping the same <img> element across src changes
        // lets the browser hold the previous frame until the new one is decoded,
        // so swaps don't flash to the background colour.
        // `unoptimized` on catalog images so the URL matches the prefetched one
        // (avoids the /_next/image optimizer round-trip on every variant click).
        <Image
          src={shown}
          alt={alt}
          fill
          quality={85}
          priority
          unoptimized={isCatalog(shown)}
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
          onError={() => setFailed((f) => ({ ...f, [shown]: true }))}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[var(--color-text-tertiary)]">
          <ImageOff size={28} strokeWidth={1.25} />
          <span className="font-[family-name:var(--font-body)] text-[var(--text-caption)]">Preview imagery coming soon</span>
        </div>
      )}

      {/* Subtle selection-change pulse — quick tactile feedback, never obscures the image */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-white transition-opacity duration-150 ease-out ${
          loading ? 'opacity-20' : 'opacity-0'
        }`}
      />
    </div>
  );
}
