'use client'

import { useTranslation } from '@/lib/i18n'
import PaymentProcessorFormBase, {
  inputClass,
  labelClass,
  hintClass,
  type ProcessorFormProps,
} from '../payment-gateway/PaymentProcessorFormBase'

/**
 * Purpose: PayStack payment processor configuration form. Fields (matching P1 + PROCESSORS definition): - Public Key - Secret Key Webhook is NOT auto-registered; a manual webhook URL is displayed.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

export function PayStackForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase
      slug="paystack"
      settings={settings}
      onChange={onChange}
      showWebhookUrl
      webhookMessage={t(
        'Go to PayStack Dashboard > Settings > API Keys & Webhooks and add the following webhook URL:'
      )}
    >
      {/* Public Key */}
      <div>
        <label htmlFor="paystack-public-key" className={labelClass}>
          {t('Public Key')}
        </label>
        <input
          id="paystack-public-key"
          type="password"
          value={settings.paystack_public_key ?? ''}
          onChange={(e) => onChange('paystack_public_key', e.target.value)}
          placeholder="pk_live_..."
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Your PayStack public key starting with pk_test_ or pk_live_')}
        </p>
      </div>

      {/* Secret Key */}
      <div>
        <label htmlFor="paystack-secret-key" className={labelClass}>
          {t('Secret Key')}
        </label>
        <input
          id="paystack-secret-key"
          type="password"
          value={settings.paystack_secret_key ?? ''}
          onChange={(e) => onChange('paystack_secret_key', e.target.value)}
          placeholder="sk_live_..."
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Your PayStack secret key starting with sk_test_ or sk_live_')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
