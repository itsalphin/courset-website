'use client';

import { useState } from 'react';
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

  return (
    <>
      {/* Shimmer skeleton while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#F0EDEA] via-[#F7F5F2] to-[#F0EDEA] animate-pulse" />
      )}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={loaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
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
        />
      </motion.div>
    </>
  );
}
