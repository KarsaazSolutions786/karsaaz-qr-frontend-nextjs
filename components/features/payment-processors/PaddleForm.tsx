'use client'

import { useTranslation } from '@/lib/i18n'
import PaymentProcessorFormBase, {
  inputClass,
  selectClass,
  textareaClass,
  labelClass,
  hintClass,
  type ProcessorFormProps,
} from '../payment-gateway/PaymentProcessorFormBase'

/**
 * Purpose: Paddle (Classic) payment processor configuration form. Fields (matching P1 + PROCESSORS definition): - Mode (Sandbox / Live) - Vendor ID - Vendor Auth Code - Public Key (textarea) Webhook is NOT auto-registered. Manual URL is displayed.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

export function PaddleForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase
      slug="paddle"
      settings={settings}
      onChange={onChange}
      showWebhookUrl
      webhookMessage={t(
        'Go to Paddle Dashboard > Developer Tools > Events > Subscriptions, and then enable Subscription Payment Success. Use the following URL:'
      )}
    >
      {/* Mode */}
      <div>
        <label htmlFor="paddle-mode" className={labelClass}>
          {t('Mode')}
        </label>
        <select
          id="paddle-mode"
          value={settings.paddle_mode ?? 'sandbox'}
          onChange={(e) => onChange('paddle_mode', e.target.value)}
          className={selectClass}
        >
          <option value="sandbox">{t('Sandbox')}</option>
          <option value="live">{t('Live')}</option>
        </select>
      </div>

      {/* Vendor ID */}
      <div>
        <label htmlFor="paddle-vendor-id" className={labelClass}>
          {t('Vendor ID')}
        </label>
        <input
          id="paddle-vendor-id"
          type="text"
          value={settings.paddle_vendor_id ?? ''}
          onChange={(e) => onChange('paddle_vendor_id', e.target.value)}
          placeholder="AYMnloVHN......"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Found in your Paddle Dashboard under Developer Tools > Authentication')}
        </p>
      </div>

      {/* Vendor Auth Code */}
      <div>
        <label htmlFor="paddle-auth-code" className={labelClass}>
          {t('Vendor Auth Code')}
        </label>
        <input
          id="paddle-auth-code"
          type="password"
          value={settings.paddle_vendor_auth_code ?? ''}
          onChange={(e) => onChange('paddle_vendor_auth_code', e.target.value)}
          placeholder="936cb64f......"
          className={inputClass}
        />
      </div>

      {/* Public Key */}
      <div>
        <label htmlFor="paddle-public-key" className={labelClass}>
          {t('Public Key')}
        </label>
        <textarea
          id="paddle-public-key"
          rows={6}
          value={settings.paddle_public_key ?? ''}
          onChange={(e) => onChange('paddle_public_key', e.target.value)}
          placeholder="-----BEGIN PUBLIC KEY-----"
          className={textareaClass}
        />
        <p className={hintClass}>
          {t('Your Paddle public key used for webhook signature verification')}
        </p>
      </div>

      {/* Plan mapping note */}
      <div className="rounded-md border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
        <p className="font-medium text-gray-700 mb-1">{t('Plan ID Mapping')}</p>
        <p>
          {t(
            'It is not possible to sync plans automatically with Paddle Classic because they do not offer an API endpoint for that. Please ensure you synchronize the plan IDs and prices manually between Paddle and your subscription plans.'
          )}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
