import { Metadata } from 'next'
import { PricingPageContent } from '@/components/features/subscriptions/PricingPageContent'

export const metadata: Metadata = {
  title: 'Pricing - Karsaaz QR',
  description: 'Choose the perfect plan for your QR code needs',
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that's right for you. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Billing Toggle + Pricing Cards */}
        <div className="mt-12">
          <PricingPageContent />
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <dl className="mt-8 space-y-6">
            <div>
              <dt className="text-lg font-medium text-gray-900">
                Can I change my plan later?
              </dt>
              <dd className="mt-2 text-base text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the charges.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-medium text-gray-900">
                What payment methods do you accept?
              </dt>
              <dd className="mt-2 text-base text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) via Stripe's secure payment processing.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-medium text-gray-900">
                Can I cancel my subscription?
              </dt>
              <dd className="mt-2 text-base text-gray-600">
                Yes, you can cancel at any time. You'll continue to have access until the end of your billing period, with no refunds for partial months.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
