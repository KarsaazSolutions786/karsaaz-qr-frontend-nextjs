'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useOrgPortalAuth } from '@/lib/context/OrgPortalAuthContext'

/**
 * Purpose: Executes OrgPortalLoginPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function OrgPortalLoginPage() {
  const { login } = useOrgPortalAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /**
   * Purpose: Executes handleSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      router.replace('/org-portal/dashboard')
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid email or password.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      id="main-content"
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(225deg, rgba(248, 127, 251, 1) 2%, rgba(150, 131, 255, 1) 98%)',
      }}
    >
      <div
        className="pointer-events-none absolute select-none"
        aria-hidden="true"
        style={{
          top: '-30%',
          right: '-21%',
          width: 918,
          height: 918,
          transform: 'rotate(-50.47deg)',
        }}
      >
        <img src="/images/auth/qr-diamonds.svg" alt="" className="block h-full w-full" />
      </div>
      <div
        className="pointer-events-none absolute select-none"
        aria-hidden="true"
        style={{ left: 35, top: 343, width: 1369, height: 1369 }}
      >
        <img src="/images/auth/ellipse-outer.svg" alt="" className="block h-full w-full" />
      </div>
      <div
        className="pointer-events-none absolute select-none"
        aria-hidden="true"
        style={{ left: 161, top: 467, width: 1115, height: 1115 }}
      >
        <img src="/images/auth/ellipse-mid.svg" alt="" className="block h-full w-full" />
      </div>
      <div
        className="pointer-events-none absolute select-none"
        aria-hidden="true"
        style={{ left: 276, top: 591, width: 881, height: 882 }}
      >
        <img src="/images/auth/ellipse-inner.svg" alt="" className="block h-full w-full" />
      </div>

      <div className="relative z-10 w-[447px] max-w-[calc(100%-32px)]">
        <div
          className="flex w-full flex-col rounded-[23px] bg-white/30 shadow-[0px_3px_12px_0px_rgba(54,54,54,0.3)] text-white"
          style={{ minHeight: 543, padding: '40px 24px 30px' }}
        >
          {/* Logo / Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/auth/karsaaz-logo.svg"
                alt="Karsaaz QR"
                width={176.5}
                height={36.9}
                priority
              />
            </div>
            <h1 className="text-2xl font-bold text-white">Organization Portal</h1>
            <p className="mt-1 text-sm text-white/90">Sign in to manage your API access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-center">
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-bold text-white">
                Portal Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="yourorg@portal.karsaazqr.com"
                required
                className="block w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-bold text-white">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-200 bg-white/90 px-4 py-2 text-sm text-gray-800 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-lg bg-red-500/25 border border-red-500/40 p-3 text-white text-xs"
              >
                <p className="text-xs font-medium text-red-100">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[#8351e0] py-2.5 text-sm font-semibold text-white hover:bg-[#7244c8] transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/90">
            Don&apos;t have an organization yet?{' '}
            <Link
              href="/signup?intent=organization"
              className="font-semibold text-white underline decoration-solid hover:text-white/80"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
