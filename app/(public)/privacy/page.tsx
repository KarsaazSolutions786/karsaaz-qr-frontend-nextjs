import { Metadata } from 'next'
import Link from 'next/link'
import { generateOGMetadata } from '@/lib/utils/og-metadata'

export const metadata: Metadata = {
  ...generateOGMetadata(
    'Privacy Policy - Karsaaz QR',
    'Karsaaz QR Privacy Policy — how we collect, use, and protect your data.',
    undefined,
    '/privacy'
  ),
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            &larr; Back to home
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="prose prose-gray mt-8 max-w-none">
          <h2>1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>
              <strong>Account Information:</strong> Name, email address, and password when you
              create an account.
            </li>
            <li>
              <strong>Payment Information:</strong> Billing details processed securely through our
              payment provider (Stripe). We do not store your full card details.
            </li>
            <li>
              <strong>QR Code Data:</strong> Content and configuration for QR codes you create
              through the Service.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you interact with the Service,
              including pages visited, features used, and actions taken.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Provide, maintain, and improve the Service.</li>
            <li>Process transactions and send related notifications.</li>
            <li>Send technical notices, updates, and support messages.</li>
            <li>Respond to your comments, questions, and requests.</li>
            <li>Monitor and analyze trends, usage, and activities.</li>
            <li>Detect, investigate, and prevent fraudulent or unauthorized activities.</li>
          </ul>

          <h2>3. QR Code Scan Data</h2>
          <p>
            When a QR code created through our Service is scanned, we may collect analytics data
            including:
          </p>
          <ul>
            <li>Date and time of the scan.</li>
            <li>Approximate geographic location (city/country level).</li>
            <li>Device type and operating system.</li>
            <li>Referring source (if applicable).</li>
          </ul>
          <p>
            This data is used to provide analytics features to QR code owners and is not used to
            personally identify individual scanners.
          </p>

          <h2>4. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share information in the following
            circumstances:
          </p>
          <ul>
            <li>
              <strong>Service Providers:</strong> With third-party vendors who assist in providing
              the Service (e.g., payment processing, hosting, analytics).
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law, court order, or government
              regulation.
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale
              of assets.
            </li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your information, including
            encryption of data in transit and at rest, secure authentication mechanisms, and regular
            security audits. However, no method of transmission over the internet is 100% secure.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            We retain your information for as long as your account is active or as needed to provide
            the Service. You may request deletion of your account and associated data at any time
            through the account settings.
          </p>

          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and receive a copy of your personal data.</li>
            <li>Correct inaccurate personal data.</li>
            <li>Request deletion of your personal data.</li>
            <li>Object to or restrict processing of your personal data.</li>
            <li>Data portability — receive your data in a structured format.</li>
          </ul>

          <h2>8. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to maintain your session, remember your
            preferences, and analyze Service usage. You can control cookie settings through your
            browser preferences.
          </p>

          <h2>9. Children&apos;s Privacy</h2>
          <p>
            The Service is not directed to children under 13. We do not knowingly collect personal
            information from children under 13. If we become aware of such collection, we will take
            steps to delete the information.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material
            changes via email or through the Service. Your continued use of the Service after
            changes constitutes acceptance of the updated policy.
          </p>

          <h2>11. Contact</h2>
          <p>
            If you have questions about this Privacy Policy or wish to exercise your data rights,
            please contact us through the support channels available in the Service dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
