'use client'

import { useTranslation } from '@/lib/i18n'
import PaymentProcessorFormBase, {
  inputClass,
  labelClass,
  hintClass,
  type ProcessorFormProps,
} from '../payment-gateway/PaymentProcessorFormBase'

/**
 * Purpose: YooKassa (Russia) payment processor configuration form. Fields (matching P1 + PROCESSORS definition): - Shop ID - Secret Key Manual webhook URL is shown (showWebhookUrl on PROCESSORS).
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

export function YookassaForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase
      slug="yookassa"
      settings={settings}
      onChange={onChange}
      showWebhookUrl
      webhookMessage={t('Add the following webhook URL in your YooKassa merchant dashboard under Integration > HTTP Notifications:')}
    >
      {/* Shop ID */}
      <div>
        <label htmlFor="yookassa-shop-id" className={labelClass}>
          {t('Shop ID')}
        </label>
        <input
          id="yookassa-shop-id"
          type="text"
          value={settings.yookassa_shop_id ?? ''}
          onChange={(e) => onChange('yookassa_shop_id', e.target.value)}
          placeholder={t('Enter Shop ID')}
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Your YooKassa shop identifier from the merchant dashboard')}
        </p>
      </div>

      {/* Secret Key */}
      <div>
        <label htmlFor="yookassa-secret-key" className={labelClass}>
          {t('Secret Key')}
        </label>
        <input
          id="yookassa-secret-key"
          type="password"
          value={settings.yookassa_secret_key ?? ''}
          onChange={(e) => onChange('yookassa_secret_key', e.target.value)}
          placeholder={t('Enter Secret Key')}
          className={inputClass}
        />
        <p className={hintClass}>
          {t('The secret key generated in your YooKassa dashboard')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
