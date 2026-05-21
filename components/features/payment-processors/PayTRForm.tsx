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
 * Purpose: PayTR (Turkey) payment processor configuration form. Fields (matching P1 + PROCESSORS definition): - Mode (test / production) - Merchant ID - Merchant Key - Merchant Salt Manual webhook URL is shown (showWebhookUrl on PROCESSORS).
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

export function PayTRForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase
      slug="paytr"
      settings={settings}
      onChange={onChange}
      showWebhookUrl
      webhookMessage={t('Add the following callback URL in your PayTR merchant dashboard:')}
    >
      {/* Mode */}
      <div>
        <label htmlFor="paytr-mode" className={labelClass}>
          {t('Mode')}
        </label>
        <select
          id="paytr-mode"
          value={settings.paytr_mode ?? 'test'}
          onChange={(e) => onChange('paytr_mode', e.target.value)}
          className={selectClass}
        >
          <option value="test">{t('Test')}</option>
          <option value="production">{t('Production')}</option>
        </select>
      </div>

      {/* Merchant ID */}
      <div>
        <label htmlFor="paytr-merchant-id" className={labelClass}>
          {t('Merchant ID')}
        </label>
        <input
          id="paytr-merchant-id"
          type="text"
          value={settings.paytr_merchant_id ?? ''}
          onChange={(e) => onChange('paytr_merchant_id', e.target.value)}
          placeholder={t('Enter Merchant ID')}
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Your PayTR merchant identifier')}
        </p>
      </div>

      {/* Merchant Key */}
      <div>
        <label htmlFor="paytr-merchant-key" className={labelClass}>
          {t('Merchant Key')}
        </label>
        <input
          id="paytr-merchant-key"
          type="password"
          value={settings.paytr_merchant_key ?? ''}
          onChange={(e) => onChange('paytr_merchant_key', e.target.value)}
          placeholder="****-****"
          className={inputClass}
        />
      </div>

      {/* Merchant Salt */}
      <div>
        <label htmlFor="paytr-merchant-salt" className={labelClass}>
          {t('Merchant Salt')}
        </label>
        <input
          id="paytr-merchant-salt"
          type="password"
          value={settings.paytr_merchant_salt ?? ''}
          onChange={(e) => onChange('paytr_merchant_salt', e.target.value)}
          placeholder="****-****"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('The merchant salt value from your PayTR dashboard')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
