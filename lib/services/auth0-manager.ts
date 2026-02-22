// Auth0 Manager Service (T144)
// Handles Auth0 Universal Login integration
// Singleton pattern per project conventions

import apiClient from '@/lib/api/client'

interface Auth0Config {
  domain: string
  clientId: string
  redirectUri: string
}

interface Auth0TokenResponse {
  user: Record<string, unknown>
  token: string
}

class Auth0Manager {
  private static instance: Auth0Manager
  private config: Auth0Config | null = null

  static getInstance(): Auth0Manager {
    if (!this.instance) this.instance = new Auth0Manager()
    return this.instance
  }

  /** Initialize with Auth0 tenant configuration */
  init(config: Auth0Config): void {
    this.config = config
  }

  /** Check if Auth0 has been initialized */
  isInitialized(): boolean {
    return this.config !== null
  }

  /** Redirect to Auth0 Universal Login */
  login(): void {
    if (!this.config) {
      console.error('[Auth0Manager] Not initialized. Call init() first.')
      return
    }
    if (typeof window === 'undefined') return

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: 'openid profile email',
    })

    window.location.href = `https://${this.config.domain}/authorize?${params.toString()}`
  }

  /** Exchange authorization code for tokens via backend */
  async handleCallback(code: string): Promise<Auth0TokenResponse> {
    const response = await apiClient.post<Auth0TokenResponse>('/auth0/callback', {
      code,
      redirect_uri: this.config?.redirectUri,
    })
    return response.data
  }

  /** Redirect to Auth0 logout endpoint */
  logout(): void {
    if (!this.config) return
    if (typeof window === 'undefined') return

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      returnTo: window.location.origin + '/login',
    })

    window.location.href = `https://${this.config.domain}/v2/logout?${params.toString()}`
  }
}

export const auth0Manager = Auth0Manager.getInstance()
