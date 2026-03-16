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
 * Razorpay payment processor configuration form.
 *
 * Fields (matching P1 + PROCESSORS definition):
 * - Integration Type (onetime / recurring)
 * - Key ID
 * - Key Secret
 * - Webhook Secret
 *
 * Webhook is NOT auto-registered; a manual webhook URL is displayed.
 */
export function RazorpayForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase
      slug="razorpay"
      settings={settings}
      onChange={onChange}
      showWebhookUrl
      webhookMessage={t('Add the following webhook URL in your Razorpay Dashboard under Settings > Webhooks:')}
    >
      {/* Integration Type */}
      <div>
        <label htmlFor="razorpay-integration-type" className={labelClass}>
          {t('Integration Type')}
        </label>
        <select
          id="razorpay-integration-type"
          value={settings.razorpay_integration_type ?? 'recurring'}
          onChange={(e) => onChange('razorpay_integration_type', e.target.value)}
          className={selectClass}
        >
          <option value="onetime">{t('One Time')}</option>
          <option value="recurring">{t('Recurring')}</option>
        </select>
        <p className={hintClass}>
          {t('Default: Recurring. Use "One Time" for single payments only.')}
        </p>
      </div>

      {/* Key ID */}
      <div>
        <label htmlFor="razorpay-key-id" className={labelClass}>
          {t('Key ID')}
        </label>
        <input
          id="razorpay-key-id"
          type="password"
          value={settings.razorpay_key_id ?? ''}
          onChange={(e) => onChange('razorpay_key_id', e.target.value)}
          placeholder="rzp_***"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Found in your Razorpay Dashboard under Settings > API Keys')}
        </p>
      </div>

      {/* Key Secret */}
      <div>
        <label htmlFor="razorpay-key-secret" className={labelClass}>
          {t('Key Secret')}
        </label>
        <input
          id="razorpay-key-secret"
          type="password"
          value={settings.razorpay_key_secret ?? ''}
          onChange={(e) => onChange('razorpay_key_secret', e.target.value)}
          placeholder="gAR***"
          className={inputClass}
        />
      </div>

      {/* Webhook Secret */}
      <div>
        <label htmlFor="razorpay-webhook-secret" className={labelClass}>
          {t('Webhook Secret')}
        </label>
        <input
          id="razorpay-webhook-secret"
          type="password"
          value={settings.razorpay_webhook_secret ?? ''}
          onChange={(e) => onChange('razorpay_webhook_secret', e.target.value)}
          placeholder={t('Enter Webhook Secret')}
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Generated when creating a webhook endpoint in Razorpay Dashboard')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
