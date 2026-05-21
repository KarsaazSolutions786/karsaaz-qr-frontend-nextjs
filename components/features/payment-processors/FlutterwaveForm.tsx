'use client'

import { useTranslation } from '@/lib/i18n'
import PaymentProcessorFormBase, {
  inputClass,
  labelClass,
  hintClass,
  type ProcessorFormProps,
} from '../payment-gateway/PaymentProcessorFormBase'

/**
 * Purpose: Flutterwave payment processor configuration form. Fields (matching P1 + PROCESSORS definition): - Public Key - Secret Key - Encryption Key Webhook is NOT auto-registered; a manual webhook URL is displayed.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

export function FlutterwaveForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase
      slug="flutterwave"
      settings={settings}
      onChange={onChange}
      showWebhookUrl
      webhookMessage={t(
        'Add the following webhook URL in your Flutterwave Dashboard under Settings > Webhooks:'
      )}
    >
      {/* Public Key */}
      <div>
        <label htmlFor="flutterwave-public-key" className={labelClass}>
          {t('Public Key')}
        </label>
        <input
          id="flutterwave-public-key"
          type="password"
          value={settings.flutterwave_public_key ?? ''}
          onChange={(e) => onChange('flutterwave_public_key', e.target.value)}
          placeholder={t('Enter Public Key')}
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Found in your Flutterwave Dashboard under Settings > API Keys')}
        </p>
      </div>

      {/* Secret Key */}
      <div>
        <label htmlFor="flutterwave-secret-key" className={labelClass}>
          {t('Secret Key')}
        </label>
        <input
          id="flutterwave-secret-key"
          type="password"
          value={settings.flutterwave_secret_key ?? ''}
          onChange={(e) => onChange('flutterwave_secret_key', e.target.value)}
          placeholder={t('Enter Secret Key')}
          className={inputClass}
        />
      </div>

      {/* Encryption Key */}
      <div>
        <label htmlFor="flutterwave-encryption-key" className={labelClass}>
          {t('Encryption Key')}
        </label>
        <input
          id="flutterwave-encryption-key"
          type="password"
          value={settings.flutterwave_encryption_key ?? ''}
          onChange={(e) => onChange('flutterwave_encryption_key', e.target.value)}
          placeholder={t('Enter Encryption Key')}
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Found in your Flutterwave Dashboard under Settings > API Keys')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
