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
}

/**
 * Renders the composed catalog image; if that asset isn't loaded yet it falls
 * back to the mapped product photo, and finally to a styled placeholder — so
 * the configurator never shows a broken image while assets are being sourced.
 */
export default function PreviewImage({ src, fallbackSrc, alt }: PreviewImageProps) {
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const candidates = [src, fallbackSrc].filter((c): c is string => Boolean(c));
  const shown = candidates.find((c) => !failed[c]);

  return (
    <div
      className="relative aspect-square w-full overflow-hidden bg-[var(--color-bg-secondary)] ring-1 ring-[var(--color-border)]"
      style={{ boxShadow: 'var(--shadow-sm)' }}
    >
      {shown ? (
        <Image
          key={shown}
          src={shown}
          alt={alt}
          fill
          quality={85}
          priority
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
    </div>
  );
}
