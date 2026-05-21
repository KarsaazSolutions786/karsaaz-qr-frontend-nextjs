'use client'

import { useTranslation } from '@/lib/i18n'
import PaymentProcessorFormBase, {
  inputClass,
  labelClass,
  hintClass,
  type ProcessorFormProps,
} from '../payment-gateway/PaymentProcessorFormBase'

/**
 * Purpose: Post Finance (Switzerland) payment processor configuration form. Fields (matching P1 + PROCESSORS definition): - Space ID - User ID - Secret - Tax Percentage Manual webhook URL is shown (showWebhookUrl on PROCESSORS).
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

export function PostFinanceForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase
      slug="postfinance"
      settings={settings}
      onChange={onChange}
      showWebhookUrl
      webhookMessage={t('Add the following webhook URL in your PostFinance merchant dashboard:')}
    >
      {/* Space ID */}
      <div>
        <label htmlFor="postfinance-space-id" className={labelClass}>
          {t('Space ID')}
        </label>
        <input
          id="postfinance-space-id"
          type="text"
          value={settings.postfinance_space_id ?? ''}
          onChange={(e) => onChange('postfinance_space_id', e.target.value)}
          placeholder={t('Space ID')}
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Your PostFinance space identifier')}
        </p>
      </div>

      {/* User ID */}
      <div>
        <label htmlFor="postfinance-user-id" className={labelClass}>
          {t('User ID')}
        </label>
        <input
          id="postfinance-user-id"
          type="text"
          value={settings.postfinance_user_id ?? ''}
          onChange={(e) => onChange('postfinance_user_id', e.target.value)}
          placeholder={t('User ID')}
          className={inputClass}
        />
      </div>

      {/* Secret */}
      <div>
        <label htmlFor="postfinance-secret" className={labelClass}>
          {t('Secret')}
        </label>
        <input
          id="postfinance-secret"
          type="password"
          value={settings.postfinance_secret ?? ''}
          onChange={(e) => onChange('postfinance_secret', e.target.value)}
          placeholder={t('Secret')}
          className={inputClass}
        />
      </div>

      {/* Tax Percentage */}
      <div>
        <label htmlFor="postfinance-tax-pct" className={labelClass}>
          {t('Tax Percentage')}
        </label>
        <input
          id="postfinance-tax-pct"
          type="text"
          value={settings.postfinance_tax_percentage ?? ''}
          onChange={(e) => onChange('postfinance_tax_percentage', e.target.value)}
          placeholder="10"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('The tax percentage to apply to transactions (e.g., 10 for 10%)')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
