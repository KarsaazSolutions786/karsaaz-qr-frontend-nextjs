import { Metadata } from 'next'
import Link from 'next/link'
import { generateOGMetadata } from '@/lib/utils/og-metadata'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Terms of Service - Karsaaz QR',
    'Karsaaz QR Terms of Service and acceptable use policy.',
    undefined,
    '/terms'
  ),
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            &larr; Back to home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="prose prose-gray mt-8 max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Karsaaz QR (&ldquo;Service&rdquo;), you agree to be bound by
            these Terms of Service. If you do not agree to these terms, please do not use the
            Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Karsaaz QR provides QR code generation, customization, tracking, and management
            services. The Service includes a web-based dashboard, API access, and related tools for
            creating and managing QR codes.
          </p>

          <h2>3. User Accounts</h2>
          <p>
            To access certain features of the Service, you must create an account. You are
            responsible for maintaining the confidentiality of your account credentials and for all
            activities that occur under your account.
          </p>
          <ul>
            <li>You must provide accurate and complete registration information.</li>
            <li>You are responsible for safeguarding your password.</li>
            <li>You must notify us immediately of any unauthorized use of your account.</li>
          </ul>

          <h2>4. Subscriptions and Payments</h2>
          <p>
            Some features of the Service require a paid subscription. By subscribing, you agree to
            pay the applicable fees. Subscription fees are billed in advance on a recurring basis
            according to your chosen plan.
          </p>
          <ul>
            <li>All fees are non-refundable unless otherwise stated.</li>
            <li>We reserve the right to change subscription pricing with 30 days&apos; notice.</li>
            <li>Failure to pay may result in suspension or termination of your account.</li>
          </ul>

          <h2>5. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any applicable laws or regulations.</li>
            <li>Generate QR codes that link to malicious, harmful, or illegal content.</li>
            <li>Engage in spamming, phishing, or other fraudulent activities.</li>
            <li>Attempt to gain unauthorized access to the Service or its systems.</li>
            <li>Interfere with or disrupt the integrity or performance of the Service.</li>
          </ul>

          <h2>6. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by Karsaaz
            QR and are protected by international copyright, trademark, and other intellectual
            property laws. QR codes you generate remain your property.
          </p>

          <h2>7. Data and Privacy</h2>
          <p>
            Your use of the Service is also governed by our{' '}
            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
              Privacy Policy
            </Link>
            , which describes how we collect, use, and protect your information.
          </p>

          <h2>8. Service Availability</h2>
          <p>
            We strive to maintain high availability of the Service but do not guarantee
            uninterrupted access. We may perform maintenance, updates, or modifications that
            temporarily affect availability.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Karsaaz QR shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages resulting from your use of or
            inability to use the Service.
          </p>

          <h2>10. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service at our sole
            discretion, without prior notice, for conduct that we believe violates these Terms or is
            harmful to other users, us, or third parties.
          </p>

          <h2>11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of material
            changes via email or through the Service. Your continued use of the Service after
            changes constitutes acceptance of the updated Terms.
          </p>

          <h2>12. Contact</h2>
          <p>
            If you have questions about these Terms, please contact us through the support channels
            available in the Service dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
