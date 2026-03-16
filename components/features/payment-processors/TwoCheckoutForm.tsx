'use client'

import { useTranslation } from '@/lib/i18n'
import PaymentProcessorFormBase, {
  inputClass,
  selectClass,
  labelClass,
  hintClass,
  type ProcessorFormProps,
} from '../payment-gateway/PaymentProcessorFormBase'

/**
 * 2Checkout (Verifone) payment processor configuration form.
 *
 * Fields (matching P1 + PROCESSORS definition):
 * - Mode (test / production)
 * - Seller ID
 * - Publishable Key
 * - Private Key
 *
 * Manual webhook URL is shown (showWebhookUrl on PROCESSORS).
 * P1 also has plan ID mapping but that is handled separately via system configs.
 */
export function TwoCheckoutForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase
      slug="2checkout"
      settings={settings}
      onChange={onChange}
      showWebhookUrl
      webhookMessage={t('Add the following webhook URL in your 2Checkout dashboard under Webhooks & API > IPN settings:')}
    >
      {/* Mode */}
      <div>
        <label htmlFor="2co-mode" className={labelClass}>
          {t('Mode')}
        </label>
        <select
          id="2co-mode"
          value={settings['2checkout_mode'] ?? 'test'}
          onChange={(e) => onChange('2checkout_mode', e.target.value)}
          className={selectClass}
        >
          <option value="test">{t('Test')}</option>
          <option value="production">{t('Production')}</option>
        </select>
        <p className={hintClass}>
          {t('Default: Test. Switch to Production when ready to accept live payments.')}
        </p>
      </div>

      {/* Seller ID */}
      <div>
        <label htmlFor="2co-seller-id" className={labelClass}>
          {t('Seller ID')}
        </label>
        <input
          id="2co-seller-id"
          type="text"
          value={settings['2checkout_seller_id'] ?? ''}
          onChange={(e) => onChange('2checkout_seller_id', e.target.value)}
          placeholder={t('Enter Seller ID')}
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Your 2Checkout merchant/seller ID')}
        </p>
      </div>

      {/* Publishable Key */}
      <div>
        <label htmlFor="2co-publishable-key" className={labelClass}>
          {t('Publishable Key')}
        </label>
        <input
          id="2co-publishable-key"
          type="password"
          value={settings['2checkout_publishable_key'] ?? ''}
          onChange={(e) => onChange('2checkout_publishable_key', e.target.value)}
          placeholder={t('Enter Publishable Key')}
          className={inputClass}
        />
      </div>

      {/* Private Key */}
      <div>
        <label htmlFor="2co-private-key" className={labelClass}>
          {t('Private Key')}
        </label>
        <input
          id="2co-private-key"
          type="password"
          value={settings['2checkout_private_key'] ?? ''}
          onChange={(e) => onChange('2checkout_private_key', e.target.value)}
          placeholder={t('Enter Private Key')}
          className={inputClass}
        />
      </div>

      {/* Plan ID mapping note */}
      <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
        <p className="font-medium mb-1">{t('Plan ID Mapping')}</p>
        <p>
          {t(
            'Please select 2Checkout Product for each plan below. Make sure to synchronize the prices manually in your 2Checkout dashboard as well.'
          )}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
