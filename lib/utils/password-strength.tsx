/**
 * Password strength calculator — reused across RegisterForm, ResetPasswordForm, etc.
 *
 * Scoring criteria (5 total):
 * - Length >= 8 characters
 * - Length >= 12 characters
 * - Mix of lower + uppercase letters
 * - Contains digits
 * - Contains special characters
 */
export function getPasswordStrength(password: string): {
  score: number
  label: string
  color: string
} {
  if (!password) return { score: 0, label: '', color: 'bg-gray-200' }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z\d]/.test(password)) score++

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' }
  if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-500' }
  if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500' }
  return { score, label: 'Strong', color: 'bg-green-500' }
}

/**
 * PasswordStrengthBar — visual strength indicator component.
 * Renders a progress bar with label text.
 */
export function PasswordStrengthBar({ password }: { password: string }) {
  const strength = getPasswordStrength(password)

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${strength.color} transition-all duration-300`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600">{strength.label}</span>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Use 8+ characters with a mix of letters, numbers &amp; symbols
      </p>
    </div>
  )
}
