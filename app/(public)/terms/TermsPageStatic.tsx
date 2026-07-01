import Link from 'next/link'
import { PlainEmailLink } from '@/components/common/PlainEmailLink'

/** SSR Terms content (audit). Hidden after client TermsPageContent hydrates. */
export function TermsPageStatic() {
  return (
    <div id="terms-ssr" className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            &larr; Back to home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: June 29, 2026</p>

        <div className="prose prose-gray mt-8 max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Karsaaz QR (&quot;Service&quot;), you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Karsaaz QR provides QR code generation, customization, tracking, and management
            services.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activities under your account.
          </p>

          <h2>4. Subscriptions and Payments</h2>
          <p>
            Some features require a paid subscription. Fees are billed according to your chosen
            plan.
          </p>

          <h2>5. Acceptable Use</h2>
          <p>You agree not to use the Service for unlawful, harmful, or fraudulent purposes.</p>

          <h2>6. Intellectual Property</h2>
          <p>
            The Service and its original content are owned by Karsaaz QR. QR codes you generate
            remain your property.
          </p>

          <h2>7. Data and Privacy</h2>
          <p>
            Your use of the Service is also governed by our{' '}
            <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
            , which describes how we collect, use, and protect your information.
          </p>

          <h2>8. Service Availability</h2>
          <p>We strive to maintain high availability but do not guarantee uninterrupted access.</p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Karsaaz QR shall not be liable for indirect or
            consequential damages.
          </p>

          <h2>10. Termination</h2>
          <p>We may suspend or terminate access for conduct that violates these Terms.</p>

          <h2>11. Changes to Terms</h2>
          <p>We may modify these Terms; continued use after changes constitutes acceptance.</p>

          <h2>12. Contact</h2>
          <p>
            If you have questions about these Terms, please contact us at{' '}
            <PlainEmailLink email="info@karsaazqr.com" />.
          </p>
        </div>
      </div>
    </div>
  )
}
