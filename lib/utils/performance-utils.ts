/**
 * Performance Utilities
 * 
 * Utilities for optimizing performance: debounce, throttle, memoization.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Purpose: Debounce function - delays execution until after wait milliseconds
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Purpose: Throttle function - limits execution to once per wait milliseconds
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
}

/**
 * Purpose: useDebounce Hook Debounces a value with specified delay.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

/**
 * Purpose: useDebouncedCallback Hook Creates a debounced version of a callback.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);
}

/**
 * Purpose: useThrottledCallback Hook Creates a throttled version of a callback.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);
  const inThrottleRef = useRef(false);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  return useCallback((...args: Parameters<T>) => {
    if (!inThrottleRef.current) {
      callbackRef.current(...args);
      inThrottleRef.current = true;
      
      setTimeout(() => {
        inThrottleRef.current = false;
      }, delay);
    }
  }, [delay]);
}

/**
 * Purpose: useIntersectionObserver Hook Detects when element enters viewport (for lazy loading).
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useIntersectionObserver(
  ref: React.RefObject<Element | null>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        ...options,
      }
    );
    
    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [ref, options]);
  
  return isIntersecting;
}

/**
 * Purpose: useMemoizedValue Hook Advanced memoization with custom equality check.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useMemoizedValue<T>(
  value: T,
  isEqual: (prev: T, next: T) => boolean = (a, b) => a === b
): T {
  const ref = useRef<T>(value);
  
  if (!isEqual(ref.current, value)) {
    ref.current = value;
  }
  
  return ref.current;
}

/**
 * Purpose: useImagePreloader Hook Preloads images for better performance.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function useImagePreloader(urls: string[]): boolean {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    if (urls.length === 0) {
      setLoaded(true);
      return;
    }
    
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === urls.length) {
          setLoaded(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === urls.length) {
          setLoaded(true);
        }
      };
      images.push(img);
    });
    
    return () => {
      images.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [urls]);
  
  return loaded;
}

/**
 * Purpose: Measure function execution time
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
  }
  
  return result;
}

/**
 * Purpose: Deep equality check for objects/arrays
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  
  if (a == null || b == null) return false;
  if (typeof a !== 'object' || typeof b !== 'object') return false;
  
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
}

/**
 * Purpose: Batch updates to reduce re-renders
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function batchUpdates(
  updates: Array<() => void>,
  callback?: () => void
): void {
  // Use React's automatic batching (React 18+)
  updates.forEach(update => update());
  callback?.();
}

/**
 * Purpose: Request Idle Callback wrapper
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function requestIdleTask(
  callback: () => void,
  options?: { timeout?: number }
): number {
  if (typeof requestIdleCallback !== 'undefined') {
    return requestIdleCallback(callback, options);
  }
  
  // Fallback to setTimeout
  return setTimeout(callback, 1) as any;
}

/**
 * Purpose: Cancel Idle Callback wrapper
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function cancelIdleTask(id: number): void {
  if (typeof cancelIdleCallback !== 'undefined') {
    cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Purpose: Chunk array processing for better performance
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export async function processInChunks<T, R>(
  items: T[],
  processor: (item: T) => R | Promise<R>,
  chunkSize: number = 100,
  onProgress?: (processed: number, total: number) => void
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(chunk.map(processor));
    results.push(...chunkResults);
    
    onProgress?.(Math.min(i + chunkSize, items.length), items.length);
    
    // Yield to browser
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return results;
}
