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
 * Purpose: PayU International payment processor configuration form. Fields (matching P1 + PROCESSORS definition): - Mode (sandbox / production) - POS ID - Second Key (MD5) - OAuth Client ID - OAuth Client Secret
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

export function PayUInternationalForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase slug="payu-international" settings={settings} onChange={onChange}>
      {/* Mode */}
      <div>
        <label htmlFor="payu-intl-mode" className={labelClass}>
          {t('Mode')}
        </label>
        <select
          id="payu-intl-mode"
          value={settings['payu-international_mode'] ?? 'sandbox'}
          onChange={(e) => onChange('payu-international_mode', e.target.value)}
          className={selectClass}
        >
          <option value="sandbox">{t('Sandbox')}</option>
          <option value="production">{t('Production')}</option>
        </select>
      </div>

      {/* POS ID */}
      <div>
        <label htmlFor="payu-intl-pos-id" className={labelClass}>
          {t('POS ID')}
        </label>
        <input
          id="payu-intl-pos-id"
          type="text"
          value={settings['payu-international_pos_id'] ?? ''}
          onChange={(e) => onChange('payu-international_pos_id', e.target.value)}
          placeholder="458***"
          className={inputClass}
        />
      </div>

      {/* Second Key (MD5) */}
      <div>
        <label htmlFor="payu-intl-second-key" className={labelClass}>
          {t('Second Key (MD5)')}
        </label>
        <input
          id="payu-intl-second-key"
          type="password"
          value={settings['payu-international_second_key'] ?? ''}
          onChange={(e) => onChange('payu-international_second_key', e.target.value)}
          placeholder="05dbc4a507c0e256..."
          className={inputClass}
        />
        <p className={hintClass}>
          {t('The second key (MD5 hash) from your PayU dashboard')}
        </p>
      </div>

      {/* OAuth Client ID */}
      <div>
        <label htmlFor="payu-intl-client-id" className={labelClass}>
          {t('OAuth Client ID')}
        </label>
        <input
          id="payu-intl-client-id"
          type="text"
          value={settings['payu-international_client_id'] ?? ''}
          onChange={(e) => onChange('payu-international_client_id', e.target.value)}
          placeholder="4568***"
          className={inputClass}
        />
      </div>

      {/* OAuth Client Secret */}
      <div>
        <label htmlFor="payu-intl-client-secret" className={labelClass}>
          {t('OAuth Client Secret')}
        </label>
        <input
          id="payu-intl-client-secret"
          type="password"
          value={settings['payu-international_client_secret'] ?? ''}
          onChange={(e) => onChange('payu-international_client_secret', e.target.value)}
          placeholder="59d1531b96c237c4af617**********"
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}
