import Link from 'next/link'

/** SSR pricing cards (audit F-08). Hidden after client Pricing hydrates. */
const PLANS = [
  {
    name: 'Trial',
    price: '$0',
    period: 'Free',
    features: ['50 MB storage', 'Limited QR codes', 'Basic analytics'],
  },
  {
    name: 'Starter',
    price: '$12',
    period: '/year',
    features: ['500 MB storage', 'More QR codes', 'Custom designs'],
  },
  {
    name: 'Pro',
    price: '$24',
    period: '/year',
    features: ['5 GB storage', 'Unlimited dynamic QR', 'Advanced analytics', 'Priority support'],
    popular: true,
  },
]

export default function PricingStatic() {
  return (
    <section id="pricing-ssr" className="py-16 px-6 bg-purple-50" aria-label="Pricing plans">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Choose Your QR Plan</h2>
        <p className="text-center text-gray-600 mb-10">
          Start with our free trial. Upgrade anytime.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <article
              key={plan.name}
              className={`rounded-2xl border p-6 bg-white shadow-sm ${plan.popular ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'}`}
            >
              {plan.popular && (
                <span className="mb-2 inline-block rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
                  Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-2 text-3xl font-bold text-purple-700">
                {plan.price}
                <span className="text-base font-normal text-gray-500">{plan.period}</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                {plan.features.map(f => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="mt-6 inline-block w-full rounded-full bg-purple-600 py-2 text-center text-sm font-semibold text-white"
              >
                Get Started
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
