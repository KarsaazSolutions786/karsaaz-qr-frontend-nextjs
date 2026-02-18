/**
 * Content-hash based caching utility for QR code previews
 */

import crypto from 'crypto';

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  hash: string;
}

class QRCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxAge: number;
  private maxSize: number;

  constructor(maxAge = 1000 * 60 * 60, maxSize = 1000) {
    this.maxAge = maxAge;
    this.maxSize = maxSize;
  }

  /**
   * Generate content hash for cache key
   */
  generateHash(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Set cache entry
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
   * Get cache entry
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
   * Check if cache has valid entry
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Verify cache entry hash
   */
  verify(key: string, expectedHash: string): boolean {
    const entry = this.cache.get(key);
    return entry?.hash === expectedHash;
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Clean expired entries
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
