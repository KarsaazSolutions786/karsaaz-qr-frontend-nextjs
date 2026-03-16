'use client'

import { useTranslation } from '@/lib/i18n'
import PaymentProcessorFormBase, {
  inputClass,
  labelClass,
  hintClass,
  type ProcessorFormProps,
} from '../payment-gateway/PaymentProcessorFormBase'

/**
 * MercadoPago payment processor configuration form.
 *
 * Fields (matching P1 + PROCESSORS definition):
 * - Public Key
 * - Access Token
 *
 * No auto-webhook registration; no manual webhook URL display.
 */
export function MercadoPagoForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase slug="mercadopago" settings={settings} onChange={onChange}>
      {/* Public Key */}
      <div>
        <label htmlFor="mercadopago-public-key" className={labelClass}>
          {t('Public Key')}
        </label>
        <input
          id="mercadopago-public-key"
          type="password"
          value={settings.mercadopago_public_key ?? ''}
          onChange={(e) => onChange('mercadopago_public_key', e.target.value)}
          placeholder="****-****"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Found in your Mercado Pago developer dashboard under Credentials')}
        </p>
      </div>

      {/* Access Token */}
      <div>
        <label htmlFor="mercadopago-access-token" className={labelClass}>
          {t('Access Token')}
        </label>
        <input
          id="mercadopago-access-token"
          type="password"
          value={settings.mercadopago_access_token ?? ''}
          onChange={(e) => onChange('mercadopago_access_token', e.target.value)}
          placeholder="****-****"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Your production or sandbox access token from Mercado Pago')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
