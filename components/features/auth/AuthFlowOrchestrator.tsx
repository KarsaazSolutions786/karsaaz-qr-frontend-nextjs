'use client'

import { useState, useCallback, useEffect, createContext, useContext, type ReactNode } from 'react'
import { LoginForm } from './LoginForm'
import { OTPVerificationForm } from './OTPVerificationForm'

type AuthStep = 'login' | 'twoFactor' | 'redirect'

interface AuthFlowState {
  step: AuthStep
  email: string
}

interface AuthFlowContextValue {
  state: AuthFlowState
  goToStep: (step: AuthStep, email?: string) => void
  reset: () => void
}

const AuthFlowContext = createContext<AuthFlowContextValue | null>(null)

export function useAuthFlow() {
  const ctx = useContext(AuthFlowContext)
  if (!ctx) throw new Error('useAuthFlow must be used within AuthFlowOrchestrator')
  return ctx
}

interface AuthFlowOrchestratorProps {
  onSuccess?: () => void
  children?: ReactNode
  initialStep?: AuthStep
}

/**
 * Multi-step auth controller: credentials → 2FA → redirect.
 * Can be used standalone or as a modal gate (requireAuth wrapper).
 */
export function AuthFlowOrchestrator({
  onSuccess,
  initialStep = 'login',
}: AuthFlowOrchestratorProps) {
  const [state, setState] = useState<AuthFlowState>({
    step: initialStep,
    email: '',
  })

  const goToStep = useCallback((step: AuthStep, email?: string) => {
    setState((prev) => ({ ...prev, step, ...(email ? { email } : {}) }))
  }, [])

  const reset = useCallback(() => {
    setState({ step: 'login', email: '' })
  }, [])

  // Call onSuccess when reaching the redirect step
  useEffect(() => {
    if (state.step === 'redirect' && onSuccess) {
      onSuccess()
    }
  }, [state.step, onSuccess])

  const contextValue: AuthFlowContextValue = { state, goToStep, reset }

  return (
    <AuthFlowContext.Provider value={contextValue}>
      <div className="w-full space-y-6">
        {state.step === 'login' && (
          <div>
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-gray-900">Sign In</h2>
              <p className="mt-1 text-sm text-gray-600">
                Enter your credentials to continue
              </p>
            </div>
            <LoginForm />
          </div>
        )}

        {state.step === 'twoFactor' && state.email && (
          <div>
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-gray-900">Two-Factor Authentication</h2>
              <p className="mt-1 text-sm text-gray-600">
                Enter the verification code sent to your email
              </p>
            </div>
            <OTPVerificationForm email={state.email} />
          </div>
        )}

        {state.step === 'redirect' && (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
            <p className="text-sm text-gray-600">Redirecting…</p>
          </div>
        )}
      </div>
    </AuthFlowContext.Provider>
  )
}

/**
 * HOC / wrapper that requires auth before rendering children.
 */
export function RequireAuth({
  children,
  fallback,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const [authed, setAuthed] = useState(false)

  if (authed) return <>{children}</>

  return (
    <>
      {fallback ?? (
        <AuthFlowOrchestrator onSuccess={() => setAuthed(true)} />
      )}
    </>
  )
}
