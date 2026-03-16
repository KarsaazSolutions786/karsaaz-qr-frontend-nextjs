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
 * FIB (First Iraqi Bank) payment processor configuration form.
 *
 * Fields (matching P1 + PROCESSORS definition):
 * - Mode (staging / production)
 * - Client ID
 * - Client Secret
 *
 * No auto-webhook registration; no manual webhook URL display.
 * Test credentials are verified after save (shouldTestCredentialsAfterSave = true in P1).
 */
export function FIBForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase slug="fib" settings={settings} onChange={onChange}>
      {/* Mode */}
      <div>
        <label htmlFor="fib-mode" className={labelClass}>
          {t('Mode')}
        </label>
        <select
          id="fib-mode"
          value={settings.fib_mode ?? 'staging'}
          onChange={(e) => onChange('fib_mode', e.target.value)}
          className={selectClass}
        >
          <option value="staging">{t('Staging')}</option>
          <option value="production">{t('Production')}</option>
        </select>
        <p className={hintClass}>
          {t('Default: Staging. Switch to Production when ready to accept live payments.')}
        </p>
      </div>

      {/* Client ID */}
      <div>
        <label htmlFor="fib-client-id" className={labelClass}>
          {t('Client ID')}
        </label>
        <input
          id="fib-client-id"
          type="text"
          value={settings.fib_client_id ?? ''}
          onChange={(e) => onChange('fib_client_id', e.target.value)}
          placeholder={t('Client ID')}
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Your FIB merchant client identifier')}
        </p>
      </div>

      {/* Client Secret */}
      <div>
        <label htmlFor="fib-client-secret" className={labelClass}>
          {t('Client Secret')}
        </label>
        <input
          id="fib-client-secret"
          type="password"
          value={settings.fib_client_secret ?? ''}
          onChange={(e) => onChange('fib_client_secret', e.target.value)}
          placeholder="a3b17**************"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}
