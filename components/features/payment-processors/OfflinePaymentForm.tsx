'use client'

import Link from 'next/link'
import { useTranslation } from '@/lib/i18n'
import PaymentProcessorFormBase, {
  selectClass,
  labelClass,
  hintClass,
  type ProcessorFormProps,
} from '../payment-gateway/PaymentProcessorFormBase'

const textareaClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

/**
 * Purpose: Offline Payments processor configuration form. Fields (matching P1 + PROCESSORS definition): - Customer Instructions (Markdown) - Payment Proof toggle (Enabled / Disabled) No webhook registration. No credentials test.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

export function OfflinePaymentForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase
      slug="offline-payments"
      settings={settings}
      onChange={onChange}
      description={
        <div className="space-y-2">
          <p>
            {t(
              'Offline payment gateway helps you receive payments from your customers without any third-party integrations. Customers will be asked to upload a proof of payment attachment, which is typically a transfer note or a deposit receipt.'
            )}
          </p>
          <p>
            {t('You can review offline transactions from the')}{' '}
            <Link href="/transactions" className="underline font-medium hover:text-blue-600">
              {t('transactions')}
            </Link>{' '}
            {t('page.')}
          </p>
        </div>
      }
    >
      {/* Customer Instructions */}
      <div>
        <label htmlFor="offline-customer-instructions" className={labelClass}>
          {t('Customer Instructions (Markdown)')}
        </label>
        <textarea
          id="offline-customer-instructions"
          rows={6}
          value={settings['offline-payment_customer_instructions'] ?? ''}
          onChange={(e) => onChange('offline-payment_customer_instructions', e.target.value)}
          placeholder={t('Explain how customers should make offline payments...')}
          className={textareaClass}
        />
        <p className={hintClass}>
          {t('Markdown is supported. These instructions are shown to customers at checkout.')}
        </p>
      </div>

      {/* Payment Proof */}
      <div>
        <label htmlFor="offline-payment-proof" className={labelClass}>
          {t('Require Payment Proof')}
        </label>
        <select
          id="offline-payment-proof"
          value={settings['offline-payment_payment_proof'] ?? 'enabled'}
          onChange={(e) => onChange('offline-payment_payment_proof', e.target.value)}
          className={selectClass}
        >
          <option value="enabled">{t('Enabled')}</option>
          <option value="disabled">{t('Disabled')}</option>
        </select>
        <p className={hintClass}>
          {t('When enabled, customers must upload a proof of payment (e.g. transfer receipt).')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
