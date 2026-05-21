// Analytics Tracker Service (T322 - Phase 14)
// Lightweight client-side analytics using fetch to API endpoint
// Singleton pattern per project conventions — auto-initializes on import

import apiClient from '@/lib/api/client'

const SESSION_KEY = 'analytics_session_id'

/**
 * Purpose: Class definition for AnalyticsTracker.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
class AnalyticsTracker {
  private static instance: AnalyticsTracker
  private sessionId: string | null = null
  private initialized = false

  /**
   * Purpose: Retrieves instance.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  static getInstance(): AnalyticsTracker {
    if (!this.instance) this.instance = new AnalyticsTracker()
    return this.instance
  }

  /**
   * Purpose: * Initialize the tracker (safe to call multiple times) 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  init(): void {
    if (this.initialized) return
    if (typeof window === 'undefined') return

    this.sessionId = this.getSessionId()
    this.initialized = true
  }

  /**
   * Purpose: * Get or create a persistent session ID for the current browser session 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  getSessionId(): string {
    if (this.sessionId) return this.sessionId

    if (typeof window === 'undefined') return 'ssr'

    let id = sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
      sessionStorage.setItem(SESSION_KEY, id)
    }
    this.sessionId = id
    return id
  }

  /**
   * Purpose: * Track a page view 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  async trackPageView(path: string): Promise<void> {
    await this.send('page_view', { path })
  }

  /**
   * Purpose: * Track a custom event 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  async trackEvent(name: string, data?: Record<string, unknown>): Promise<void> {
    await this.send(name, data)
  }

  /**
   * Purpose: * Send analytics data to the API 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  private async send(event: string, data?: Record<string, unknown>): Promise<void> {
    if (typeof window === 'undefined') return

    try {
      await apiClient.post('/analytics/track', {
        event,
        session_id: this.getSessionId(),
        timestamp: new Date().toISOString(),
        url: window.location.href,
        referrer: document.referrer || null,
        ...data,
      })
    } catch {
      // Silently fail — analytics should never break the app
    }
  }
}

// Auto-initialize singleton on import
const analyticsTracker = AnalyticsTracker.getInstance()
if (typeof window !== 'undefined') {
  analyticsTracker.init()
}

export { AnalyticsTracker, analyticsTracker }

// Convenience exports
/**
 * Purpose: Executes trackPageView functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export const trackPageView = (path: string) => analyticsTracker.trackPageView(path)
/**
 * Purpose: Executes trackEvent functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export const trackEvent = (name: string, data?: Record<string, unknown>) =>
  analyticsTracker.trackEvent(name, data)
/**
 * Purpose: Retrieves sessionid.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export const getSessionId = () => analyticsTracker.getSessionId()
