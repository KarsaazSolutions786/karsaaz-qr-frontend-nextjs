import Link from 'next/link'

export function SignupFormStatic() {
  return (
    <div
      id="signup-form-ssr"
      className="w-full rounded-[23px] bg-white/30 shadow-[0px_3px_12px_0px_rgba(54,54,54,0.3)] space-y-4"
      style={{ minHeight: 543, padding: '40px 24px 30px' }}
    >
      <h1 className="mb-2 text-center text-2xl font-bold text-white">Create your account</h1>
      <p className="mb-6 text-center text-sm text-white/90">
        Sign up free to create and manage QR codes
      </p>
      <form
        action="/register"
        method="get"
        aria-label="Create Karsaaz QR account"
        className="space-y-4"
      >
        <div>
          <label htmlFor="ssr-signup-name" className="mb-1 block text-xs font-bold text-white">
            Full name
          </label>
          <input
            id="ssr-signup-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            required
            className="block w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="ssr-signup-email" className="mb-1 block text-xs font-bold text-white">
            Email
          </label>
          <input
            id="ssr-signup-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={255}
            required
            className="block w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="ssr-signup-password" className="mb-1 block text-xs font-bold text-white">
            Password
          </label>
          <input
            id="ssr-signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            maxLength={128}
            required
            minLength={8}
            className="block w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-[#8351e0] py-2.5 text-sm font-semibold text-white hover:bg-[#7244c8] transition-colors"
        >
          Create account
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-white/90">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-white underline decoration-solid hover:text-white/80"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
