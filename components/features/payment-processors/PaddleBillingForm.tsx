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
 * Paddle (Billing) payment processor configuration form.
 *
 * Fields (matching P1 + PROCESSORS definition):
 * - Mode (Sandbox / Live)
 * - Seller ID
 * - API Key
 * - Client Side Token
 * - Webhook Secret
 *
 * Webhook IS auto-registered after save.
 */
export function PaddleBillingForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase
      slug="paddle-billing"
      settings={settings}
      onChange={onChange}
      description={t('Get your credentials from Developer Tools > Authentication in the Paddle Dashboard.')}
    >
      {/* Mode */}
      <div>
        <label htmlFor="paddle-billing-mode" className={labelClass}>
          {t('Mode')}
        </label>
        <select
          id="paddle-billing-mode"
          value={settings['paddle-billing_mode'] ?? 'sandbox'}
          onChange={(e) => onChange('paddle-billing_mode', e.target.value)}
          className={selectClass}
        >
          <option value="sandbox">{t('Sandbox')}</option>
          <option value="live">{t('Live')}</option>
        </select>
      </div>

      {/* Seller ID */}
      <div>
        <label htmlFor="paddle-billing-seller-id" className={labelClass}>
          {t('Seller ID')}
        </label>
        <input
          id="paddle-billing-seller-id"
          type="text"
          value={settings['paddle-billing_seller_id'] ?? ''}
          onChange={(e) => onChange('paddle-billing_seller_id', e.target.value)}
          placeholder="123456..."
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Your Paddle Seller ID from Developer Tools > Authentication')}
        </p>
      </div>

      {/* API Key */}
      <div>
        <label htmlFor="paddle-billing-api-key" className={labelClass}>
          {t('API Key')}
        </label>
        <input
          id="paddle-billing-api-key"
          type="password"
          value={settings['paddle-billing_api_key'] ?? ''}
          onChange={(e) => onChange('paddle-billing_api_key', e.target.value)}
          placeholder="936cb64f......"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Your Paddle Billing API authentication key')}
        </p>
      </div>

      {/* Client Side Token */}
      <div>
        <label htmlFor="paddle-billing-client-token" className={labelClass}>
          {t('Client Side Token')}
        </label>
        <input
          id="paddle-billing-client-token"
          type="password"
          value={settings['paddle-billing_client_side_token'] ?? ''}
          onChange={(e) => onChange('paddle-billing_client_side_token', e.target.value)}
          placeholder="936cb64f......"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Used for Paddle.js integration on the client side')}
        </p>
      </div>

      {/* Webhook Secret */}
      <div>
        <label htmlFor="paddle-billing-webhook-secret" className={labelClass}>
          {t('Webhook Secret')}
        </label>
        <input
          id="paddle-billing-webhook-secret"
          type="password"
          value={settings['paddle-billing_webhook_secret'] ?? ''}
          onChange={(e) => onChange('paddle-billing_webhook_secret', e.target.value)}
          placeholder={t('Enter Webhook Secret')}
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Used to verify webhook signatures. Found under Developer Tools > Notifications.')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
