'use client'

import { useTranslation } from '@/lib/i18n'
import PaymentProcessorFormBase, {
  inputClass,
  labelClass,
  hintClass,
  type ProcessorFormProps,
} from '../payment-gateway/PaymentProcessorFormBase'

/**
 * Purpose: Mollie payment processor configuration form. Fields (matching P1 + PROCESSORS definition): - API Key - Partner ID - Profile ID No webhook registration (P1: shouldRegisterWebhook = false).
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

export function MollieForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase slug="mollie" settings={settings} onChange={onChange}>
      {/* API Key */}
      <div>
        <label htmlFor="mollie-api-key" className={labelClass}>
          {t('API Key')}
        </label>
        <input
          id="mollie-api-key"
          type="password"
          value={settings.mollie_api_key ?? ''}
          onChange={(e) => onChange('mollie_api_key', e.target.value)}
          placeholder="live_..."
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Found in your Mollie Dashboard under Developers > API keys')}
        </p>
      </div>

      {/* Partner ID */}
      <div>
        <label htmlFor="mollie-partner-id" className={labelClass}>
          {t('Partner ID')}
        </label>
        <input
          id="mollie-partner-id"
          type="text"
          value={settings.mollie_partner_id ?? ''}
          onChange={(e) => onChange('mollie_partner_id', e.target.value)}
          placeholder="****-****"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Your Mollie Partner ID (optional for non-partners)')}
        </p>
      </div>

      {/* Profile ID */}
      <div>
        <label htmlFor="mollie-profile-id" className={labelClass}>
          {t('Profile ID')}
        </label>
        <input
          id="mollie-profile-id"
          type="text"
          value={settings.mollie_profile_id ?? ''}
          onChange={(e) => onChange('mollie_profile_id', e.target.value)}
          placeholder="pfl_****"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Found in your Mollie Dashboard under Settings > Website profiles')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
