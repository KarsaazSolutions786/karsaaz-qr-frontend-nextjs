// Cache Manager Service (T011)
// Thin wrapper around localStorage/sessionStorage with event-based clearing
// Per research.md R2: Singleton pattern, clears both storages on logout

class CacheManager {
  private static instance: CacheManager;

  static getInstance(): CacheManager {
    if (!this.instance) this.instance = new CacheManager();
    return this.instance;
  }

  /** Clear all cached data from both storages */
  clearAll(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.dispatchEvent(new CustomEvent('cache-manager:logout-cache-cleared'));
    } catch (e) {
      console.error('[CacheManager] Failed to clear storage:', e);
    }
  }

  /** Clear only session-specific data, preserving persistent preferences */
  clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.clear();
      // Remove user-specific keys from localStorage
      const keysToRemove = ['user', 'token', 'mainUser', 'subscription_cache'];
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      console.error('[CacheManager] Failed to clear session:', e);
    }
  }

  /** Get cached value with optional JSON parsing */
  get<T = string>(key: string, parse = false): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const value = localStorage.getItem(key) ?? sessionStorage.getItem(key);
      if (!value) return null;
      return parse ? JSON.parse(value) : (value as unknown as T);
    } catch {
      return null;
    }
  }

  /** Set cached value */
  set(key: string, value: string | object, storage: 'local' | 'session' = 'local'): void {
    if (typeof window === 'undefined') return;
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      if (storage === 'session') {
        sessionStorage.setItem(key, serialized);
      } else {
        localStorage.setItem(key, serialized);
      }
    } catch (e) {
      console.error('[CacheManager] Failed to set cache:', e);
    }
  }

  /** Remove a specific cached key */
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}

export const cacheManager = CacheManager.getInstance();
