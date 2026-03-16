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
 * PayU LATAM payment processor configuration form.
 *
 * Fields (matching P1 + PROCESSORS definition):
 * - Mode (sandbox / production)
 * - API Key
 * - API Login
 * - Merchant ID
 * - Account ID
 */
export function PayULatamForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase slug="payu-latam" settings={settings} onChange={onChange}>
      {/* Mode */}
      <div>
        <label htmlFor="payu-latam-mode" className={labelClass}>
          {t('Mode')}
        </label>
        <select
          id="payu-latam-mode"
          value={settings['payu-latam_mode'] ?? 'sandbox'}
          onChange={(e) => onChange('payu-latam_mode', e.target.value)}
          className={selectClass}
        >
          <option value="sandbox">{t('Sandbox')}</option>
          <option value="production">{t('Production')}</option>
        </select>
      </div>

      {/* API Key */}
      <div>
        <label htmlFor="payu-latam-api-key" className={labelClass}>
          {t('API Key')}
        </label>
        <input
          id="payu-latam-api-key"
          type="password"
          value={settings['payu-latam_api_key'] ?? ''}
          onChange={(e) => onChange('payu-latam_api_key', e.target.value)}
          placeholder="4Vj8eK4********arnUA"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Found in your PayU LATAM merchant dashboard')}
        </p>
      </div>

      {/* API Login */}
      <div>
        <label htmlFor="payu-latam-api-login" className={labelClass}>
          {t('API Login')}
        </label>
        <input
          id="payu-latam-api-login"
          type="text"
          value={settings['payu-latam_api_login'] ?? ''}
          onChange={(e) => onChange('payu-latam_api_login', e.target.value)}
          placeholder={t('Enter API Login')}
          className={inputClass}
        />
      </div>

      {/* Merchant ID */}
      <div>
        <label htmlFor="payu-latam-merchant-id" className={labelClass}>
          {t('Merchant ID')}
        </label>
        <input
          id="payu-latam-merchant-id"
          type="text"
          value={settings['payu-latam_merchant_id'] ?? ''}
          onChange={(e) => onChange('payu-latam_merchant_id', e.target.value)}
          placeholder="123456"
          className={inputClass}
        />
      </div>

      {/* Account ID */}
      <div>
        <label htmlFor="payu-latam-account-id" className={labelClass}>
          {t('Account ID')}
        </label>
        <input
          id="payu-latam-account-id"
          type="text"
          value={settings['payu-latam_account_id'] ?? ''}
          onChange={(e) => onChange('payu-latam_account_id', e.target.value)}
          placeholder="123456"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}
