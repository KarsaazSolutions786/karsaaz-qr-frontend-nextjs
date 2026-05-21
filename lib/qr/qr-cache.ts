/**
 * Content-hash based caching utility for QR code previews
 */

import crypto from 'crypto';

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  hash: string;
}

/**
 * Purpose: Class definition for QRCache.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
class QRCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxAge: number;
  private maxSize: number;

  /**
   * Purpose: Constructor for constructor.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  constructor(maxAge = 1000 * 60 * 60, maxSize = 1000) {
    this.maxAge = maxAge;
    this.maxSize = maxSize;
  }

  /**
   * Purpose: Generate content hash for cache key
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  generateHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Purpose: Set cache entry
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  set(key: string, value: T, hash?: string): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      hash: hash || this.generateHash(valueStr),
    });
  }

  /**
   * Purpose: Get cache entry
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Purpose: Check if cache has valid entry
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Purpose: Verify cache entry hash
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  verify(key: string, expectedHash: string): boolean {
    const entry = this.cache.get(key);
    return entry?.hash === expectedHash;
  }

  /**
   * Purpose: Clear cache
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  clear(): void {
    this.cache.clear();
  }

  /**
   * Purpose: Get cache size
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  size(): number {
    return this.cache.size;
  }

  /**
   * Purpose: Clean expired entries
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

// Export singleton instance
export const qrPreviewCache = new QRCache<string>();

// Export class for custom instances
export default QRCache;
