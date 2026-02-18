/**
 * LazyImage Component
 * 
 * Lazy loading image with intersection observer.
 */

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/lib/utils/performance-utils';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E',
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
  className = '',
  ...props
}: LazyImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const isIntersecting = useIntersectionObserver(imgRef, { threshold, rootMargin });
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  
  useEffect(() => {
    if (isIntersecting && !isLoaded && !hasError) {
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        setCurrentSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };
      
      img.onerror = () => {
        setHasError(true);
        onError?.();
      };
    }
  }, [isIntersecting, src, isLoaded, hasError, onLoad, onError]);
  
  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-50'} ${className}`}
      {...props}
    />
  );
}

/**
 * LazyLoadWrapper Component
 * 
 * Wrapper for lazy loading any content.
 */
export interface LazyLoadWrapperProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function LazyLoadWrapper({
  children,
  placeholder,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
}: LazyLoadWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(ref, { threshold, rootMargin });
  const [hasLoaded, setHasLoaded] = useState(false);
  
  useEffect(() => {
    if (isIntersecting && !hasLoaded) {
      setHasLoaded(true);
    }
  }, [isIntersecting, hasLoaded]);
  
  return (
    <div ref={ref} className={className}>
      {hasLoaded ? children : placeholder || <div className="animate-pulse bg-gray-200 rounded h-full" />}
    </div>
  );
}

/**
 * ProgressiveImage Component
 * 
 * Progressive image loading with blur-up effect.
 */
export interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  lowResSrc?: string;
  placeholder?: string;
}

export function ProgressiveImage({
  src,
  alt,
  lowResSrc,
  placeholder,
  className = '',
  ...props
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(lowResSrc || placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
  }, [src]);
  
  return (
    <div className="relative overflow-hidden">
      <img
        src={currentSrc}
        alt={alt}
        className={`${!isLoaded && lowResSrc ? 'blur-sm scale-105' : ''} transition-all duration-500 ${className}`}
        {...props}
      />
    </div>
  );
}
