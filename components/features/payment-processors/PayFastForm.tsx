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
 * PayFast (South Africa) payment processor configuration form.
 *
 * Fields (matching P1 + PROCESSORS definition):
 * - Mode (sandbox / live)
 * - Merchant ID
 * - Merchant Key
 * - Passphrase
 *
 * No auto-webhook; no manual webhook URL display.
 */
export function PayFastForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase slug="payfast" settings={settings} onChange={onChange}>
      {/* Mode */}
      <div>
        <label htmlFor="payfast-mode" className={labelClass}>
          {t('Mode')}
        </label>
        <select
          id="payfast-mode"
          value={settings.payfast_mode ?? 'sandbox'}
          onChange={(e) => onChange('payfast_mode', e.target.value)}
          className={selectClass}
        >
          <option value="sandbox">{t('Sandbox')}</option>
          <option value="live">{t('Live')}</option>
        </select>
      </div>

      {/* Merchant ID */}
      <div>
        <label htmlFor="payfast-merchant-id" className={labelClass}>
          {t('Merchant ID')}
        </label>
        <input
          id="payfast-merchant-id"
          type="text"
          value={settings.payfast_merchant_id ?? ''}
          onChange={(e) => onChange('payfast_merchant_id', e.target.value)}
          placeholder="12321456"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Found in your PayFast dashboard under Settings > Merchant Details')}
        </p>
      </div>

      {/* Merchant Key */}
      <div>
        <label htmlFor="payfast-merchant-key" className={labelClass}>
          {t('Merchant Key')}
        </label>
        <input
          id="payfast-merchant-key"
          type="password"
          value={settings.payfast_merchant_key ?? ''}
          onChange={(e) => onChange('payfast_merchant_key', e.target.value)}
          placeholder="na38Jsh***"
          className={inputClass}
        />
      </div>

      {/* Passphrase */}
      <div>
        <label htmlFor="payfast-passphrase" className={labelClass}>
          {t('Passphrase')}
        </label>
        <input
          id="payfast-passphrase"
          type="password"
          value={settings.payfast_passphrase ?? ''}
          onChange={(e) => onChange('payfast_passphrase', e.target.value)}
          placeholder={t('Enter your passphrase')}
          className={inputClass}
        />
        <p className={hintClass}>
          {t('The passphrase set in your PayFast account security settings')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
