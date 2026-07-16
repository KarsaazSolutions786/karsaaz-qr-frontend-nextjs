'use client'

import Link from 'next/link'
import {
  KeyRound,
  Users,
  Webhook,
  Wallet,
  ShieldCheck,
  BarChart3,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { useOrgPlans } from '@/lib/hooks/queries/useOrgPlans'
import type { OrgPlan } from '@/lib/api/endpoints/organization'

/** What every organization gets on the platform, regardless of plan tier -- mirrors
 * the actual capabilities built out under app/(dashboard)/organization/*. */
const PLATFORM_FEATURES = [
  {
    icon: KeyRound,
    title: 'API Key Management',
    description:
      'Issue, rotate, and revoke scoped API keys for your integrations, with per-key rate limits and usage tracking.',
  },
  {
    icon: Users,
    title: 'Team Roles & Permissions',
    description:
      'Invite teammates with owner, admin, developer, billing, or viewer roles -- each with a precise permission matrix.',
  },
  {
    icon: Webhook,
    title: 'Webhooks',
    description:
      'Subscribe to QR code events with HMAC-signed deliveries, automatic retry with backoff, and a delivery history you can replay.',
  },
  {
    icon: Wallet,
    title: 'Usage-Based Credits',
    description:
      'A transparent, auditable credit ledger for API usage -- buy credit packages or get included tokens with your plan.',
  },
  {
    icon: BarChart3,
    title: 'Usage Analytics',
    description:
      'Track API calls, QR code creation, and credit consumption by endpoint, with historical trends.',
  },
  {
    icon: ShieldCheck,
    title: 'Audit Log',
    description:
      'Every sensitive action -- member changes, key rotations, plan changes, credit adjustments -- is recorded for compliance.',
  },
]

function formatLimit(n: number) {
  return n === -1 ? 'Unlimited' : n.toLocaleString()
}

function PlanCard({ plan }: { plan: OrgPlan }) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-lg ${
        plan.is_popular ? 'border-purple-400 ring-2 ring-purple-200' : 'border-gray-200'
      }`}
    >
      {plan.is_popular && (
        <span className="absolute -top-3 left-6 rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
      {plan.description && <p className="mt-1 text-sm text-gray-500">{plan.description}</p>}

      <div className="mt-4 mb-6">
        <span className="text-4xl font-bold text-purple-700">${plan.price}</span>
        <span className="ml-1 text-base text-gray-400">/month</span>
      </div>

      <ul className="mb-6 flex-1 space-y-2.5 text-sm text-gray-600">
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
          {formatLimit(plan.monthly_api_calls)} API calls / month
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
          {formatLimit(plan.monthly_qr_creates)} QR code creates / month
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
          {plan.rate_limit_per_minute} requests/minute rate limit
        </li>
        {!!plan.included_tokens && (
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
            {plan.included_tokens.toLocaleString()} bonus credits included
          </li>
        )}
        {(plan.features ?? []).map(f => (
          <li key={f} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href="/signup?intent=organization"
        className="mt-auto flex w-full items-center justify-center rounded-full bg-purple-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
      >
        Get Started
      </Link>
    </div>
  )
}

function CustomPlanCard() {
  return (
    <div className="flex h-full flex-col rounded-2xl border-2 border-dashed border-purple-300 bg-purple-50/50 p-6">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <h3 className="text-xl font-bold text-gray-900">Custom</h3>
      </div>
      <p className="mb-6 text-sm text-gray-600">
        Need higher limits, a dedicated rate limit, or bespoke terms? We build a plan around your
        organization&apos;s actual usage.
      </p>
      <ul className="mb-6 flex-1 space-y-2.5 text-sm text-gray-600">
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
          Tailored API call & QR create limits
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
          Custom rate limits for high-volume integrations
        </li>
        <li className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-purple-500" />
          Negotiated included credits
        </li>
      </ul>
      <Link
        href="#contact"
        className="mt-auto flex w-full items-center justify-center rounded-full border-2 border-purple-600 py-3 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-100"
      >
        Talk to Sales
      </Link>
    </div>
  )
}

/**
 * Purpose: Organization platform marketing page -- what the platform provides (API
 * keys, team roles, webhooks, credits, analytics, audit log) plus the live public
 * org_plans catalog and a custom-plan contact CTA.
 * Owner/Author: Claude Code
 * Created/Updated: 2026-07-15
 */
export function OrganizationPlansContent() {
  const { data, isLoading, error } = useOrgPlans()
  const plans = (data?.data?.data ?? []).filter(p => p.is_active && !p.is_custom)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-6">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105.27deg, rgba(176, 72, 176, 0.6) 16.17%, rgba(128, 115, 224, 0.3) 87.53%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Built for{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(90.77deg, #B048B0 0%, #8073E0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Organizations
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-700">
            API access, team roles, webhooks, and usage-based billing for teams that integrate QR
            codes into their own products and workflows.
          </p>
        </div>
      </section>

      {/* Platform features */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Everything your organization gets
        </h2>
        <p className="mt-2 text-center text-gray-500">
          Included with every organization account, on every plan.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLATFORM_FEATURES.map(feature => (
            <div key={feature.title} className="rounded-2xl border border-gray-200 bg-white p-6">
              <feature.icon className="mb-3 h-6 w-6 text-purple-600" />
              <h3 className="mb-1 font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">Organization Plans</h2>
        <p className="mt-2 text-center text-gray-500">
          Pick a plan to start, or talk to us about a custom deal.
        </p>

        <div className="mt-10">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse rounded-2xl border bg-white p-6">
                  <div className="h-6 w-24 rounded bg-gray-200" />
                  <div className="mt-4 h-10 w-32 rounded bg-gray-200" />
                  <div className="mt-6 space-y-3">
                    {[1, 2, 3].map(j => (
                      <div key={j} className="h-4 w-full rounded bg-gray-200" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-800">
              Failed to load organization plans. Please try again later.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map(plan => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
              <CustomPlanCard />
            </div>
          )}
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          Already have an organization?{' '}
          <Link href="/org-portal" className="font-medium text-purple-600 hover:underline">
            Sign in to the Organization Portal
          </Link>
        </div>
      </section>
    </div>
  )
}
