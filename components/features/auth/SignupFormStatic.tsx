import Link from 'next/link'

export function SignupFormStatic() {
  return (
    <div id="signup-form-ssr" className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">Create your account</h1>
      <p className="mb-6 text-center text-sm text-gray-600">
        Sign up free to create and manage QR codes
      </p>
      <form
        action="/register"
        method="get"
        aria-label="Create Karsaaz QR account"
        className="space-y-4"
      >
        <div>
          <label htmlFor="ssr-signup-name" className="block text-sm font-medium text-gray-700">
            Full name
          </label>
          <input
            id="ssr-signup-name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={100}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="ssr-signup-email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="ssr-signup-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={255}
            required
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="ssr-signup-password" className="block text-sm font-medium text-gray-700">
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
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-[#8351e0] py-2 text-sm font-semibold text-white"
        >
          Create account
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-[#8351e0] underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
