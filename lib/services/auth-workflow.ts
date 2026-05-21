// Auth Workflow Engine Service (T143)
// Manages OAuth provider registration and flow orchestration
// Singleton pattern per project conventions

import apiClient from '@/lib/api/client'
import { envConfig } from '@/lib/config/env-config'

/**
 * Purpose: * Generate a cryptographically random OAuth state parameter for CSRF protection 
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

function generateOAuthState(): string {
  const state = crypto.randomUUID()
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('oauth_state', state)
  }
  return state
}

/**
 * Purpose: * Generate OAuth state and store it — exported for use by auth API redirect helpers 
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function generateOAuthStateForRedirect(): string {
  return generateOAuthState()
}

/**
 * Purpose: * Validate OAuth state parameter against stored value. Returns true if valid. 
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function validateOAuthState(stateParam: string | null): boolean {
  if (typeof window === 'undefined') return true
  const storedState = sessionStorage.getItem('oauth_state')
  if (!storedState) return true // No state stored means flow didn't originate here (e.g., code exchange)
  if (!stateParam || stateParam !== storedState) return false
  sessionStorage.removeItem('oauth_state')
  return true
}

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

/**
 * Purpose: Class definition for AuthWorkflowEngine.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
class AuthWorkflowEngine {
  private static instance: AuthWorkflowEngine
  private providers: Map<OAuthProviderName, OAuthProviderConfig> = new Map()

  /**
   * Purpose: Retrieves instance.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  static getInstance(): AuthWorkflowEngine {
    if (!this.instance) this.instance = new AuthWorkflowEngine()
    return this.instance
  }

  /**
   * Purpose: * Register an OAuth provider with its configuration 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  registerProvider(name: OAuthProviderName, config: OAuthProviderConfig): void {
    this.providers.set(name, config)
  }

  /**
   * Purpose: * Get all registered and enabled providers 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  getEnabledProviders(): RegisteredProvider[] {
    const enabled: RegisteredProvider[] = []
    this.providers.forEach((config, name) => {
      if (config.enabled) {
        enabled.push({ name, config })
      }
    })
    return enabled
  }

  /**
   * Purpose: * Get a specific provider config 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  getProvider(name: OAuthProviderName): OAuthProviderConfig | undefined {
    return this.providers.get(name)
  }

  /**
   * Purpose: * Initiate OAuth flow by redirecting to the provider's authorize URL 
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  
  initiateOAuth(provider: OAuthProviderName): void {
    const apiBase = envConfig.API_URL
    const state = generateOAuthState()

    const urlMap: Record<OAuthProviderName, string> = {
      google: `${apiBase}/auth-workflow/google/redirect?state=${state}`,
      facebook: `${apiBase}/auth-workflow/facebook/redirect?state=${state}`,
      twitter: `${apiBase}/auth-workflow/twitter/redirect?state=${state}`,
      auth0: `${apiBase}/auth0/login?state=${state}`,
    }

    const url = urlMap[provider]
    if (url && typeof window !== 'undefined') {
      window.location.href = url
    }
  }

  /**
   * Purpose: * Handle OAuth callback — exchange authorization code for user/token 
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  
  async handleCallback(provider: OAuthProviderName, code: string): Promise<OAuthCallbackResponse> {
    const response = await apiClient.post<OAuthCallbackResponse>(
      `/auth-workflow/${provider}/callback`,
      { code }
    )
    return response.data
  }
}

export const authWorkflowEngine = AuthWorkflowEngine.getInstance()
