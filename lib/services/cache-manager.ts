// Cache Manager Service (T011)
// Thin wrapper around localStorage/sessionStorage with event-based clearing
// Per research.md R2: Singleton pattern, clears both storages on logout

/**
 * Purpose: Class definition for CacheManager.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
class CacheManager {
  private static instance: CacheManager;

  /**
   * Purpose: Retrieves instance.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  static getInstance(): CacheManager {
    if (!this.instance) this.instance = new CacheManager();
    return this.instance;
  }

  /**
   * Purpose: * Clear all cached data from both storages 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  clearAll(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.dispatchEvent(new CustomEvent('cache-manager:logout-cache-cleared'));
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.error('[CacheManager] Failed to clear storage:', e);
    }
  }

  /**
   * Purpose: * Clear only session-specific data, preserving persistent preferences 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  clearSession(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.clear();
      // Remove user-specific keys from localStorage
      const keysToRemove = ['user', 'token', 'mainUser', 'subscription_cache'];
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      if (process.env.NODE_ENV === 'development') console.error('[CacheManager] Failed to clear session:', e);
    }
  }

  /**
   * Purpose: * Get cached value with optional JSON parsing 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
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

  /**
   * Purpose: * Set cached value 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
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
      if (process.env.NODE_ENV === 'development') console.error('[CacheManager] Failed to set cache:', e);
    }
  }

  /**
   * Purpose: * Remove a specific cached key 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}

export const cacheManager = CacheManager.getInstance();
