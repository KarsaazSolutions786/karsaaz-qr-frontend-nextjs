/**
 * Cache Manager
 * In-memory + localStorage cache with TTL support.
 */

interface CacheEntry<T> {
  data: T;
  expiry: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export const cacheManager = {
  /** Get cached value (checks memory first, then localStorage) */
  get<T>(key: string): T | null {
    // Memory cache
    const memEntry = memoryCache.get(key) as CacheEntry<T> | undefined;
    if (memEntry && Date.now() < memEntry.expiry) {
      return memEntry.data;
    }
    if (memEntry) memoryCache.delete(key);

    // localStorage fallback
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(`cache:${key}`);
      if (!stored) return null;
      const entry: CacheEntry<T> = JSON.parse(stored);
      if (Date.now() < entry.expiry) {
        memoryCache.set(key, entry);
        return entry.data;
      }
      localStorage.removeItem(`cache:${key}`);
    } catch {
      // Ignore parse errors
    }
    return null;
  },

  /** Set cache value with TTL */
  set<T>(key: string, data: T, ttl = DEFAULT_TTL): void {
    const entry: CacheEntry<T> = { data, expiry: Date.now() + ttl };
    memoryCache.set(key, entry as CacheEntry<unknown>);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`cache:${key}`, JSON.stringify(entry));
      } catch {
        // Storage full or unavailable
      }
    }
  },

  /** Remove a cached entry */
  remove(key: string): void {
    memoryCache.delete(key);
    if (typeof window !== "undefined") {
      localStorage.removeItem(`cache:${key}`);
    }
  },

  /** Clear all cache entries */
  clear(): void {
    memoryCache.clear();
    if (typeof window !== "undefined") {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith("cache:"));
      keys.forEach((k) => localStorage.removeItem(k));
    }
  },
};

export default cacheManager;
