'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'

export function PrivacyPageContent() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            &larr; {t('Back to home')}
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">{t('Privacy Policy')}</h1>
        <p className="mt-2 text-sm text-gray-500">
          {t('Last updated:')}{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="prose prose-gray mt-8 max-w-none">
          <h2>{t('1. Information We Collect')}</h2>
          <p>{t('We collect information that you provide directly to us, including:')}</p>
          <ul>
            <li>
              <strong>{t('Account Information:')}</strong> {t('Name, email address, and password when you create an account.')}
            </li>
            <li>
              <strong>{t('Payment Information:')}</strong> {t('Billing details processed securely through our payment provider (Stripe). We do not store your full card details.')}
            </li>
            <li>
              <strong>{t('QR Code Data:')}</strong> {t('Content and configuration for QR codes you create through the Service.')}
            </li>
            <li>
              <strong>{t('Usage Data:')}</strong> {t('Information about how you interact with the Service, including pages visited, features used, and actions taken.')}
            </li>
          </ul>

          <h2>{t('2. How We Use Your Information')}</h2>
          <p>{t('We use collected information to:')}</p>
          <ul>
            <li>{t('Provide, maintain, and improve the Service.')}</li>
            <li>{t('Process transactions and send related notifications.')}</li>
            <li>{t('Send technical notices, updates, and support messages.')}</li>
            <li>{t('Respond to your comments, questions, and requests.')}</li>
            <li>{t('Monitor and analyze trends, usage, and activities.')}</li>
            <li>{t('Detect, investigate, and prevent fraudulent or unauthorized activities.')}</li>
          </ul>

          <h2>{t('3. QR Code Scan Data')}</h2>
          <p>
            {t('When a QR code created through our Service is scanned, we may collect analytics data including:')}
          </p>
          <ul>
            <li>{t('Date and time of the scan.')}</li>
            <li>{t('Approximate geographic location (city/country level).')}</li>
            <li>{t('Device type and operating system.')}</li>
            <li>{t('Referring source (if applicable).')}</li>
          </ul>
          <p>
            {t('This data is used to provide analytics features to QR code owners and is not used to personally identify individual scanners.')}
          </p>

          <h2>{t('4. Information Sharing')}</h2>
          <p>
            {t('We do not sell your personal information. We may share information in the following circumstances:')}
          </p>
          <ul>
            <li>
              <strong>{t('Service Providers:')}</strong> {t('With third-party vendors who assist in providing the Service (e.g., payment processing, hosting, analytics).')}
            </li>
            <li>
              <strong>{t('Legal Requirements:')}</strong> {t('When required by law, court order, or government regulation.')}
            </li>
            <li>
              <strong>{t('Business Transfers:')}</strong> {t('In connection with a merger, acquisition, or sale of assets.')}
            </li>
          </ul>

          <h2>{t('5. Data Security')}</h2>
          <p>
            {t('We implement appropriate security measures to protect your information, including encryption of data in transit and at rest, secure authentication mechanisms, and regular security audits. However, no method of transmission over the internet is 100% secure.')}
          </p>

          <h2>{t('6. Data Retention')}</h2>
          <p>
            {t('We retain your information for as long as your account is active or as needed to provide the Service. You may request deletion of your account and associated data at any time through the account settings.')}
          </p>

          <h2>{t('7. Your Rights')}</h2>
          <p>{t('You have the right to:')}</p>
          <ul>
            <li>{t('Access and receive a copy of your personal data.')}</li>
            <li>{t('Correct inaccurate personal data.')}</li>
            <li>{t('Request deletion of your personal data.')}</li>
            <li>{t('Object to or restrict processing of your personal data.')}</li>
            <li>{t('Data portability — receive your data in a structured format.')}</li>
          </ul>

          <h2>{t('8. Cookies and Tracking')}</h2>
          <p>
            {t('We use cookies and similar technologies to maintain your session, remember your preferences, and analyze Service usage. You can control cookie settings through your browser preferences.')}
          </p>

          <h2>{t("9. Children's Privacy")}</h2>
          <p>
            {t('The Service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will take steps to delete the information.')}
          </p>

          <h2>{t('10. Changes to This Policy')}</h2>
          <p>
            {t('We may update this Privacy Policy from time to time. We will notify you of material changes via email or through the Service. Your continued use of the Service after changes constitutes acceptance of the updated policy.')}
          </p>

          <h2>{t('11. Contact')}</h2>
          <p>
            {t('If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us through the support channels available in the Service dashboard.')}
          </p>
        </div>
      </div>
    </div>
  )
}
