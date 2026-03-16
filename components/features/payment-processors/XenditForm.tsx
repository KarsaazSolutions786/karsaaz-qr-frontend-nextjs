'use client'

import { useTranslation } from '@/lib/i18n'
import PaymentProcessorFormBase, {
  inputClass,
  labelClass,
  hintClass,
  type ProcessorFormProps,
} from '../payment-gateway/PaymentProcessorFormBase'

/**
 * Xendit (Southeast Asia) payment processor configuration form.
 *
 * Fields (matching P1 + PROCESSORS definition):
 * - Public Key
 * - Secret Key
 * - Webhook Verification Token
 *
 * Manual webhook URL is shown (showWebhookUrl on PROCESSORS).
 * Xendit requires callback URL set in Dashboard > Settings > Callbacks.
 */
export function XenditForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase
      slug="xendit"
      settings={settings}
      onChange={onChange}
      showWebhookUrl
      webhookMessage={t(
        'Go to Xendit Dashboard > Settings > Callbacks and then from the Invoices section, add the following URL in the invoice paid text input:'
      )}
    >
      {/* Public Key */}
      <div>
        <label htmlFor="xendit-public-key" className={labelClass}>
          {t('Public Key')}
        </label>
        <input
          id="xendit-public-key"
          type="password"
          value={settings.xendit_public_key ?? ''}
          onChange={(e) => onChange('xendit_public_key', e.target.value)}
          placeholder="xnd_public_***"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Found in your Xendit Dashboard under Settings > API Keys')}
        </p>
      </div>

      {/* Secret Key */}
      <div>
        <label htmlFor="xendit-secret-key" className={labelClass}>
          {t('Secret Key')}
        </label>
        <input
          id="xendit-secret-key"
          type="password"
          value={settings.xendit_secret_key ?? ''}
          onChange={(e) => onChange('xendit_secret_key', e.target.value)}
          placeholder="xnd_***"
          className={inputClass}
        />
      </div>

      {/* Webhook Verification Token */}
      <div>
        <label htmlFor="xendit-webhook-token" className={labelClass}>
          {t('Webhook Verification Token')}
        </label>
        <input
          id="xendit-webhook-token"
          type="password"
          value={settings.xendit_webhook_verification_token ?? ''}
          onChange={(e) => onChange('xendit_webhook_verification_token', e.target.value)}
          placeholder={t('Enter Webhook Verification Token')}
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Used to verify that incoming webhooks are from Xendit')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
