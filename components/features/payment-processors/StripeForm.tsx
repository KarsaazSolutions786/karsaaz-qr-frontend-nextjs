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
 * Stripe payment processor configuration form.
 *
 * Fields (matching PROCESSORS definition):
 * - Publisher Key
 * - Secret Key
 * - Automatic Tax (enabled / disabled)
 * - Tax Behavior (inclusive / exclusive)
 *
 * Webhook IS auto-registered. Test credentials supported.
 */
export function StripeForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase slug="stripe" settings={settings} onChange={onChange}>
      {/* Publishable Key */}
      <div>
        <label htmlFor="stripe-publisher-key" className={labelClass}>
          {t('Publishable Key')}
        </label>
        <input
          id="stripe-publisher-key"
          type="password"
          value={settings.stripe_publisher_key ?? ''}
          onChange={(e) => onChange('stripe_publisher_key', e.target.value)}
          placeholder="pk_live_..."
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Your Stripe publishable key starting with pk_test_ or pk_live_')}
        </p>
      </div>

      {/* Secret Key */}
      <div>
        <label htmlFor="stripe-secret-key" className={labelClass}>
          {t('Secret Key')}
        </label>
        <input
          id="stripe-secret-key"
          type="password"
          value={settings.stripe_secret_key ?? ''}
          onChange={(e) => onChange('stripe_secret_key', e.target.value)}
          placeholder="sk_live_..."
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Your Stripe secret key starting with sk_test_ or sk_live_')}
        </p>
      </div>

      {/* Automatic Tax */}
      <div>
        <label htmlFor="stripe-automatic-tax" className={labelClass}>
          {t('Automatic Tax')}
        </label>
        <select
          id="stripe-automatic-tax"
          value={settings.stripe_automatic_tax ?? 'disabled'}
          onChange={(e) => onChange('stripe_automatic_tax', e.target.value)}
          className={selectClass}
        >
          <option value="disabled">{t('Disabled')}</option>
          <option value="enabled">{t('Enabled')}</option>
        </select>
        <p className={hintClass}>
          {t('Enable Stripe Tax for automatic tax calculation')}
        </p>
      </div>

      {/* Tax Behavior */}
      <div>
        <label htmlFor="stripe-tax-behavior" className={labelClass}>
          {t('Tax Behavior')}
        </label>
        <select
          id="stripe-tax-behavior"
          value={settings.stripe_tax_behavior ?? 'exclusive'}
          onChange={(e) => onChange('stripe_tax_behavior', e.target.value)}
          className={selectClass}
        >
          <option value="exclusive">{t('Exclusive (Tax added to price)')}</option>
          <option value="inclusive">{t('Inclusive (Tax included in price)')}</option>
        </select>
        <p className={hintClass}>
          {t('How tax is calculated relative to the product price')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}

export default StripeForm
