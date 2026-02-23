import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '@/components/features/auth/LoginForm'
import { RegisterForm } from '@/components/features/auth/RegisterForm'

// Mock next/navigation
const pushMock = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), back: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

// Mock useLogin
const loginMutateAsync = vi.fn()
vi.mock('@/lib/hooks/mutations/useLogin', () => ({
  useLogin: () => ({
    mutateAsync: loginMutateAsync,
    isPending: false,
    isError: false,
    error: null,
  }),
}))

// Mock useRegister
const registerMutateAsync = vi.fn()
vi.mock('@/lib/hooks/mutations/useRegister', () => ({
  useRegister: () => ({
    mutateAsync: registerMutateAsync,
    isPending: false,
    isError: false,
    error: null,
  }),
}))

// Mock referral utilities
vi.mock('@/lib/utils/referral-tracking', () => ({
  extractReferralCode: vi.fn(() => null),
  storeReferralCode: vi.fn(),
  getStoredReferralCode: vi.fn(() => null),
  clearStoredReferralCode: vi.fn(),
}))

// Mock PasswordStrengthBar
vi.mock('@/lib/utils/password-strength', () => ({
  PasswordStrengthBar: ({ password }: { password: string }) => (
    <div data-testid="password-strength">{password ? 'strength-bar' : null}</div>
  ),
}))

beforeEach(() => {
  vi.clearAllMocks()
})

describe('LoginForm integration', () => {
  it('renders email and password fields with sign-in button', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields on submit', async () => {
    render(<LoginForm />)
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      const alerts = screen.getAllByRole('alert')
      expect(alerts.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('calls login mutation with valid data', async () => {
    loginMutateAsync.mockResolvedValue({ user: { id: 1 }, token: 'tok' })
    render(<LoginForm />)

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(loginMutateAsync).toHaveBeenCalledWith({
        email: 'user@test.com',
        password: 'password123',
        rememberMe: false,
      })
    })
  })

  it('toggles password visibility', () => {
    render(<LoginForm />)
    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toHaveAttribute('type', 'password')

    fireEvent.click(screen.getByText('Show'))
    expect(passwordInput).toHaveAttribute('type', 'text')

    fireEvent.click(screen.getByText('Hide'))
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  it('has links to signup and forgot password', () => {
    render(<LoginForm />)
    expect(screen.getByRole('link', { name: /sign up/i })).toHaveAttribute('href', '/signup')
    expect(screen.getByRole('link', { name: /forgot password/i })).toHaveAttribute(
      'href',
      '/forgot-password'
    )
  })
})

describe('RegisterForm integration', () => {
  it('renders all registration fields', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    render(<RegisterForm />)
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    await waitFor(() => {
      const alerts = screen.getAllByRole('alert')
      expect(alerts.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('calls register mutation with valid data', async () => {
    registerMutateAsync.mockResolvedValue({ user: { id: 1 }, token: 'tok' })
    render(<RegisterForm />)

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'john@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Password1' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'Password1' } })
    fireEvent.click(screen.getByLabelText(/i agree to the/i))
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(registerMutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@test.com',
          password: 'Password1',
          confirmPassword: 'Password1',
          termsConsent: true,
        })
      )
    })
  })

  it('shows password strength bar when typing', () => {
    render(<RegisterForm />)
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'Abc123' } })
    expect(screen.getByTestId('password-strength')).toBeInTheDocument()
  })

  it('has link to sign in page', () => {
    render(<RegisterForm />)
    expect(screen.getByRole('link', { name: /sign in/i })).toHaveAttribute('href', '/login')
  })
})
