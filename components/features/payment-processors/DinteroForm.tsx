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
 * Purpose: Dintero (Norway) payment processor configuration form. Fields (matching P1 + PROCESSORS definition): - Mode (test / production) - Account ID - Client ID - Client Secret - Profile ID - VAT Percentage - Reference Prefix No auto-webhook registration; no manual webhook URL display.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

export function DinteroForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase slug="dintero" settings={settings} onChange={onChange}>
      {/* Mode */}
      <div>
        <label htmlFor="dintero-mode" className={labelClass}>
          {t('Mode')}
        </label>
        <select
          id="dintero-mode"
          value={settings.dintero_mode ?? 'test'}
          onChange={(e) => onChange('dintero_mode', e.target.value)}
          className={selectClass}
        >
          <option value="test">{t('Test')}</option>
          <option value="production">{t('Production')}</option>
        </select>
        <p className={hintClass}>
          {t('Default: Test. Switch to Production when ready to accept live payments.')}
        </p>
      </div>

      {/* Account ID */}
      <div>
        <label htmlFor="dintero-account-id" className={labelClass}>
          {t('Account ID')}
        </label>
        <input
          id="dintero-account-id"
          type="text"
          value={settings.dintero_account_id ?? ''}
          onChange={(e) => onChange('dintero_account_id', e.target.value)}
          placeholder="Account ID"
          className={inputClass}
        />
      </div>

      {/* Client ID */}
      <div>
        <label htmlFor="dintero-client-id" className={labelClass}>
          {t('Client ID')}
        </label>
        <input
          id="dintero-client-id"
          type="text"
          value={settings.dintero_client_id ?? ''}
          onChange={(e) => onChange('dintero_client_id', e.target.value)}
          placeholder="AsD3UQFE******"
          className={inputClass}
        />
      </div>

      {/* Client Secret */}
      <div>
        <label htmlFor="dintero-client-secret" className={labelClass}>
          {t('Client Secret')}
        </label>
        <input
          id="dintero-client-secret"
          type="password"
          value={settings.dintero_client_secret ?? ''}
          onChange={(e) => onChange('dintero_client_secret', e.target.value)}
          placeholder={t('Client Secret')}
          className={inputClass}
        />
      </div>

      {/* Profile ID */}
      <div>
        <label htmlFor="dintero-profile-id" className={labelClass}>
          {t('Profile ID')}
        </label>
        <input
          id="dintero-profile-id"
          type="text"
          value={settings.dintero_profile_id ?? ''}
          onChange={(e) => onChange('dintero_profile_id', e.target.value)}
          placeholder="default"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Optional. Defaults to "default" if left empty.')}
        </p>
      </div>

      {/* VAT Percentage */}
      <div>
        <label htmlFor="dintero-vat" className={labelClass}>
          {t('VAT Percentage')}
        </label>
        <input
          id="dintero-vat"
          type="text"
          value={settings.dintero_vat ?? ''}
          onChange={(e) => onChange('dintero_vat', e.target.value)}
          placeholder="E.g. 25"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Norwegian standard VAT rate is 25%')}
        </p>
      </div>

      {/* Reference Prefix */}
      <div>
        <label htmlFor="dintero-reference" className={labelClass}>
          {t('Reference Prefix')}
        </label>
        <input
          id="dintero-reference"
          type="text"
          value={settings.dintero_reference ?? ''}
          onChange={(e) => onChange('dintero_reference', e.target.value)}
          placeholder="e.g. SUBSCRIPTION-"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Prefix added to payment reference identifiers')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
