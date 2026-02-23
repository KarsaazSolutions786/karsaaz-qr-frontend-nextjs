'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string
}

/**
 * Wrapper around next/image with sensible defaults:
 * - Lazy loading by default
 * - Fallback on error
 * - Blur placeholder for known dimensions
 */
export function OptimizedImage({
  className,
  fallbackSrc = '/images/placeholder.png',
  alt,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false)

  return (
    <Image
      {...props}
      alt={alt}
      src={error ? fallbackSrc : props.src}
      loading={props.loading ?? 'lazy'}
      className={cn('object-cover', className)}
      onError={() => setError(true)}
    />
  )
}

export default OptimizedImage
