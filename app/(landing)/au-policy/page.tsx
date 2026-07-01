import { PlainEmailLink } from '@/components/common/PlainEmailLink'
/**
 * Purpose: Executes AcceptableUsePolicy functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
export default function AcceptableUsePolicy() {
  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Acceptable Use Policy</h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p>
              This Acceptable Use Policy (&ldquo;AUP&rdquo;) governs your use of KarsaazQR and
              defines prohibited activities. By using our service, you agree to comply with this
              policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              2. Prohibited Content
            </h2>
            <p>
              You may not use KarsaazQR to create, store, or distribute QR codes that contain or
              link to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Illegal content or content that promotes illegal activities</li>
              <li>Malware, viruses, or other harmful software</li>
              <li>Phishing schemes or fraudulent content</li>
              <li>Content that infringes intellectual property rights</li>
              <li>Defamatory, obscene, or offensive material</li>
              <li>Content that promotes violence, hatred, or discrimination</li>
              <li>Child sexual abuse material or content exploiting minors</li>
              <li>Spam or unsolicited commercial communications</li>
              <li>Personal information of others without consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              3. Prohibited Activities
            </h2>
            <p>When using our service, you must not:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Use automated systems to access the service excessively</li>
              <li>Reverse engineer, decompile, or disassemble our software</li>
              <li>Remove or modify any copyright or proprietary notices</li>
              <li>Use the service to harm, harass, or stalk others</li>
              <li>Impersonate any person or entity</li>
              <li>Collect or harvest information about users</li>
              <li>Use the service for cryptocurrency mining</li>
              <li>Resell or redistribute the service without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              4. Compliance with Laws
            </h2>
            <p>
              You must comply with all applicable local, national, and international laws and
              regulations when using our service, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Data protection and privacy laws (GDPR, CCPA, etc.)</li>
              <li>Intellectual property laws</li>
              <li>Anti-spam legislation</li>
              <li>Export control regulations</li>
              <li>Consumer protection laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Resource Usage</h2>
            <p>You agree to use our service responsibly and not to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Consume excessive bandwidth or server resources</li>
              <li>Create an unreasonable burden on our infrastructure</li>
              <li>Use the service in a manner that degrades performance for other users</li>
              <li>Generate an excessive number of QR codes beyond reasonable use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Account Security</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Using strong passwords and enabling two-factor authentication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              7. Monitoring and Enforcement
            </h2>
            <p>We reserve the right to:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Monitor your use of the service for compliance with this AUP</li>
              <li>Investigate suspected violations</li>
              <li>Remove or disable access to content that violates this policy</li>
              <li>Suspend or terminate accounts that breach this AUP</li>
              <li>Report illegal activities to law enforcement</li>
              <li>Cooperate with legal authorities in investigations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              8. Consequences of Violation
            </h2>
            <p>Violation of this AUP may result in:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Warning or notice to cease the prohibited activity</li>
              <li>Temporary suspension of your account</li>
              <li>Permanent termination of your account</li>
              <li>Legal action and prosecution</li>
              <li>Reporting to relevant authorities</li>
              <li>No refund of any fees paid</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              9. Reporting Violations
            </h2>
            <p>
              If you become aware of any violation of this AUP, please report it to us immediately
              at:
            </p>
            <p className="mt-4">
              <strong>Email:</strong> abuse@karsaazqr.com or{' '}
              <PlainEmailLink email="info@karsaazqr.com" />
            </p>
            <p className="mt-4">Include as much detail as possible, including:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Description of the violation</li>
              <li>QR code or account involved</li>
              <li>Date and time of the incident</li>
              <li>Any supporting evidence</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              10. Intellectual Property
            </h2>
            <p>
              You must respect the intellectual property rights of others. Do not use our service to
              create QR codes that:
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Infringe on trademarks, copyrights, or patents</li>
              <li>Violate trade secrets or confidential information</li>
              <li>Use others&apos; logos or branding without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this Acceptable Use Policy at any time. Continued use of our service
              after changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Contact Us</h2>
            <p>If you have questions about this Acceptable Use Policy, contact us at:</p>
            <p className="mt-4">
              <strong>Email:</strong> <PlainEmailLink email="info@karsaazqr.com" /> or
              abuse@karsaazqr.com
              <br />
              <strong>Address:</strong> 85 Great Portland Street, First Floor, London, W1W 7LT,
              United Kingdom
              <br />
              <strong>Phone:</strong> +44 7411 209240
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              13. Right to Modify Service
            </h2>
            <p>
              We reserve the right to modify, suspend, or discontinue any aspect of the service at
              any time to enforce this policy or for any other reason without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              14. No Liability for User Actions
            </h2>
            <p>
              We are not responsible for content created by users or actions taken by users of the
              service. Users are solely responsible for their own conduct and content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
              15. Cooperation with Authorities
            </h2>
            <p>
              We will cooperate fully with law enforcement authorities and comply with court orders
              regarding violations of this policy or illegal activities.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-12 pt-8 border-t">
            <strong>Document Version:</strong> 2.0
            <br />
            Last updated: 19 November 2025
          </p>
        </div>
      </div>
    </div>
  )
}
