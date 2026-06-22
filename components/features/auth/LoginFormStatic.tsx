import Link from 'next/link'

/**
 * Server-rendered login form skeleton for crawlers, no-JS users, and accessibility.
 * Audit F-01: login page must include form elements in initial HTML.
 * Hidden after client hydration by LoginHydrationBridge.
 */
export function LoginFormStatic() {
  return (
    <div
      id="login-form-ssr"
      className="rounded-[23px] bg-white/30 p-8 shadow-[0px_3px_12px_0px_rgba(54,54,54,0.3)]"
    >
      <h1 className="mb-4 text-center text-xl font-semibold text-white">Sign In</h1>
      <form action="/login" method="get" aria-label="Sign in to Karsaaz QR" className="space-y-3">
        <div>
          <label htmlFor="ssr-login-email" className="mb-1 block text-xs font-bold text-white">
            Email
          </label>
          <input
            id="ssr-login-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="block w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-800"
          />
        </div>
        <div>
          <label htmlFor="ssr-login-password" className="mb-1 block text-xs font-bold text-white">
            Password
          </label>
          <input
            id="ssr-login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="block w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-800"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-[#8351e0] py-2 text-sm font-semibold text-white"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-white/90">
        <Link href="/register" className="underline">
          Create account
        </Link>
        {' · '}
        <Link href="/forgot-password" className="underline">
          Forgot password?
        </Link>
      </p>
    </div>
  )
}
