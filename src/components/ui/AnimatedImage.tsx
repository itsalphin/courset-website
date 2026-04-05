'use client';

import { useState } from 'react';
import Image from 'next/image';

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
}: AnimatedImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="absolute inset-0">
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        className={`${className} transition-opacity duration-300 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
        priority={priority}
        quality={quality}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
