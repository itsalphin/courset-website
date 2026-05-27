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
   * Parent-controlled "configuring" state. When true, a shimmer overlay covers
   * the preview and the image dims — giving every axis click a tactile feel.
   */
  loading?: boolean;
}

/**
 * Renders the composed catalog image; if that asset isn't loaded yet it falls
 * back to the mapped product photo, and finally to a styled placeholder.
 * The `loading` prop controls a brief shimmer overlay on selection changes.
 */
export default function PreviewImage({ src, fallbackSrc, alt, loading = false }: PreviewImageProps) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const candidates = [src, fallbackSrc].filter((c): c is string => Boolean(c));
  const shown = candidates.find((c) => !failed[c]);

  return (
    <div
      className="relative aspect-square w-full overflow-hidden bg-[var(--color-bg-secondary)] ring-1 ring-[var(--color-border)]"
      style={{ boxShadow: 'var(--shadow-sm)' }}
      aria-busy={loading || undefined}
    >
      {shown ? (
        // No `key` on purpose: keeping the same <img> element across src changes
        // lets the browser hold the previous frame until the new one is decoded,
        // so swaps don't flash to the background colour.
        <Image
          src={shown}
          alt={alt}
          fill
          quality={85}
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className={`object-cover transition-opacity duration-300 ${loading ? 'opacity-60' : 'opacity-100'}`}
          onError={() => setFailed((f) => ({ ...f, [shown]: true }))}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[var(--color-text-tertiary)]">
          <ImageOff size={28} strokeWidth={1.25} />
          <span className="font-[family-name:var(--font-body)] text-[var(--text-caption)]">Preview imagery coming soon</span>
        </div>
      )}

      {/* Selection-change shimmer overlay (parent-controlled) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br from-white/45 via-white/10 to-white/45 transition-opacity duration-300 ${
          loading ? 'opacity-100 animate-pulse' : 'opacity-0'
        }`}
      />
    </div>
  );
}
