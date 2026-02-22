// Auth Workflow Engine Service (T143)
// Manages OAuth provider registration and flow orchestration
// Singleton pattern per project conventions

import apiClient from '@/lib/api/client'

export interface OAuthProviderConfig {
  clientId: string
  clientSecret?: string
  enabled: boolean
  redirectUri?: string
  scopes?: string[]
}

export type OAuthProviderName = 'google' | 'facebook' | 'twitter' | 'auth0'

interface RegisteredProvider {
  name: OAuthProviderName
  config: OAuthProviderConfig
}

interface OAuthCallbackResponse {
  user: Record<string, unknown>
  token: string
}

class AuthWorkflowEngine {
  private static instance: AuthWorkflowEngine
  private providers: Map<OAuthProviderName, OAuthProviderConfig> = new Map()

  static getInstance(): AuthWorkflowEngine {
    if (!this.instance) this.instance = new AuthWorkflowEngine()
    return this.instance
  }

  /** Register an OAuth provider with its configuration */
  registerProvider(name: OAuthProviderName, config: OAuthProviderConfig): void {
    this.providers.set(name, config)
  }

  /** Get all registered and enabled providers */
  getEnabledProviders(): RegisteredProvider[] {
    const enabled: RegisteredProvider[] = []
    this.providers.forEach((config, name) => {
      if (config.enabled) {
        enabled.push({ name, config })
      }
    })
    return enabled
  }

  /** Get a specific provider config */
  getProvider(name: OAuthProviderName): OAuthProviderConfig | undefined {
    return this.providers.get(name)
  }

  /** Initiate OAuth flow by redirecting to the provider's authorize URL */
  initiateOAuth(provider: OAuthProviderName): void {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

    const urlMap: Record<OAuthProviderName, string> = {
      google: `${apiBase}/auth-workflow/google/redirect`,
      facebook: `${apiBase}/auth-workflow/facebook/redirect`,
      twitter: `${apiBase}/auth-workflow/twitter/redirect`,
      auth0: `${apiBase}/auth0/login`,
    }

    const url = urlMap[provider]
    if (url && typeof window !== 'undefined') {
      window.location.href = url
    }
  }

  /** Handle OAuth callback — exchange authorization code for user/token */
  async handleCallback(
    provider: OAuthProviderName,
    code: string
  ): Promise<OAuthCallbackResponse> {
    const response = await apiClient.post<OAuthCallbackResponse>(
      `/auth-workflow/${provider}/callback`,
      { code }
    )
    return response.data
  }
}

export const authWorkflowEngine = AuthWorkflowEngine.getInstance()
