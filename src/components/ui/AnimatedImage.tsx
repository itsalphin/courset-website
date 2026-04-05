'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

  // Fallback: force show after 3s even if onLoad doesn't fire
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: loaded ? 1 : 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={sizes}
        className={className}
        priority={priority}
        quality={quality}
        onLoad={() => setLoaded(true)}
        loading={priority ? 'eager' : 'lazy'}
      />
    </motion.div>
  );
}
