'use client'

import { useTranslation } from '@/lib/i18n'
import PaymentProcessorFormBase, {
  inputClass,
  selectClass,
  labelClass,
  type ProcessorFormProps,
} from '../payment-gateway/PaymentProcessorFormBase'

/**
 * Orange (Mobile Money) payment processor configuration form.
 *
 * Fields (matching P1 + PROCESSORS definition):
 * - Mode (test / production)
 * - Merchant
 * - Login ID
 * - Password
 *
 * No webhook registration. No manual webhook URL display.
 */
export function OrangeBillingForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase slug="orange-bf" settings={settings} onChange={onChange}>
      {/* Mode */}
      <div>
        <label htmlFor="orange-bf-mode" className={labelClass}>
          {t('Mode')}
        </label>
        <select
          id="orange-bf-mode"
          value={settings['orange-bf_mode'] ?? 'test'}
          onChange={(e) => onChange('orange-bf_mode', e.target.value)}
          className={selectClass}
        >
          <option value="test">{t('Test')}</option>
          <option value="production">{t('Production')}</option>
        </select>
      </div>

      {/* Merchant */}
      <div>
        <label htmlFor="orange-bf-merchant" className={labelClass}>
          {t('Merchant')}
        </label>
        <input
          id="orange-bf-merchant"
          type="text"
          value={settings['orange-bf_merchant'] ?? ''}
          onChange={(e) => onChange('orange-bf_merchant', e.target.value)}
          placeholder={t('Enter Merchant')}
          className={inputClass}
        />
      </div>

      {/* Login ID */}
      <div>
        <label htmlFor="orange-bf-login-id" className={labelClass}>
          {t('Login ID')}
        </label>
        <input
          id="orange-bf-login-id"
          type="text"
          value={settings['orange-bf_login_id'] ?? ''}
          onChange={(e) => onChange('orange-bf_login_id', e.target.value)}
          placeholder={t('Enter Login ID')}
          className={inputClass}
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="orange-bf-password" className={labelClass}>
          {t('Password')}
        </label>
        <input
          id="orange-bf-password"
          type="password"
          value={settings['orange-bf_password'] ?? ''}
          onChange={(e) => onChange('orange-bf_password', e.target.value)}
          placeholder={t('Enter Password')}
          className={inputClass}
        />
      </div>
    </PaymentProcessorFormBase>
  )
}
