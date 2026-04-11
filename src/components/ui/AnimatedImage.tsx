'use client';

import { useState } from 'react';
import Image from 'next/image';
import { getBlurDataURL } from '@/lib/blur-placeholders';

interface AnimatedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  eager?: boolean;
}

export default function AnimatedImage({
  src,
  alt,
  fill = true,
  width,
  height,
  sizes,
  className = 'object-cover',
  priority = false,
  quality,
  eager = false,
}: AnimatedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const blurDataURL = getBlurDataURL(src);

  return (
    <div className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        className={`${className} transition-opacity duration-200 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
        priority={priority}
        quality={quality}
        loading={priority || eager ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        {...(blurDataURL ? { placeholder: 'blur' as const, blurDataURL } : {})}
      />
    </div>
  );
}
