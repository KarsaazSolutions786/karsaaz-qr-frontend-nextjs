'use client'

import { useTranslation } from '@/lib/i18n'
import PaymentProcessorFormBase, {
  inputClass,
  selectClass,
  textareaClass,
  labelClass,
  hintClass,
  type ProcessorFormProps,
} from '../payment-gateway/PaymentProcessorFormBase'

/**
 * Alipay China payment processor configuration form.
 *
 * Fields (matching P1 + PROCESSORS definition):
 * - Mode (sandbox / live)
 * - App ID
 * - App Secret Cert (textarea)
 * - App Public Certificate (textarea)
 * - AliPay Public Cert (textarea)
 * - AliPay Root Cert (textarea)
 * - App Auth Token (optional)
 *
 * P1 uses file upload for certs, but the system configs API stores text values.
 * We render textarea fields so admins can paste certificate contents directly,
 * matching the PROCESSORS definition on the page.
 */
export function AlipayForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase slug="alipay-china" settings={settings} onChange={onChange}>
      {/* Mode */}
      <div>
        <label htmlFor="alipay-mode" className={labelClass}>
          {t('Mode')}
        </label>
        <select
          id="alipay-mode"
          value={settings['alipay-china_mode'] ?? 'sandbox'}
          onChange={(e) => onChange('alipay-china_mode', e.target.value)}
          className={selectClass}
        >
          <option value="sandbox">{t('Sandbox')}</option>
          <option value="live">{t('Live')}</option>
        </select>
        {(settings['alipay-china_mode'] ?? 'sandbox') === 'sandbox' && (
          <p className="mt-1 text-xs text-yellow-600">
            {t('Sandbox mode is for testing only. Switch to Live for production.')}
          </p>
        )}
      </div>

      {/* App ID */}
      <div>
        <label htmlFor="alipay-app-id" className={labelClass}>
          {t('App ID')}
        </label>
        <input
          id="alipay-app-id"
          type="text"
          value={settings['alipay-china_app_id'] ?? ''}
          onChange={(e) => onChange('alipay-china_app_id', e.target.value)}
          placeholder="54654658"
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Your AliPay application ID from the open platform')}
        </p>
      </div>

      {/* App Secret Cert */}
      <div>
        <label htmlFor="alipay-app-secret-cert" className={labelClass}>
          {t('App Secret Cert')}
        </label>
        <textarea
          id="alipay-app-secret-cert"
          rows={5}
          value={settings['alipay-china_app_secret_cert'] ?? ''}
          onChange={(e) => onChange('alipay-china_app_secret_cert', e.target.value)}
          placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;...&#10;-----END RSA PRIVATE KEY-----"
          className={textareaClass}
        />
        <p className={hintClass}>
          {t("Paste your application's private key certificate content")}
        </p>
      </div>

      {/* App Public Certificate */}
      <div>
        <label htmlFor="alipay-app-public-cert" className={labelClass}>
          {t('App Public Certificate')}
        </label>
        <textarea
          id="alipay-app-public-cert"
          rows={5}
          value={settings['alipay-china_app_public_cert'] ?? ''}
          onChange={(e) => onChange('alipay-china_app_public_cert', e.target.value)}
          placeholder={t('Paste app public certificate content (.crt)')}
          className={textareaClass}
        />
        <p className={hintClass}>
          {t("Your application's public certificate file content")}
        </p>
      </div>

      {/* AliPay Public Cert */}
      <div>
        <label htmlFor="alipay-alipay-public-cert" className={labelClass}>
          {t('AliPay Public Cert')}
        </label>
        <textarea
          id="alipay-alipay-public-cert"
          rows={5}
          value={settings['alipay-china_alipay_public_cert'] ?? ''}
          onChange={(e) => onChange('alipay-china_alipay_public_cert', e.target.value)}
          placeholder={t('Paste AliPay public certificate content (.crt)')}
          className={textareaClass}
        />
        <p className={hintClass}>
          {t("AliPay's public certificate for payment verification")}
        </p>
      </div>

      {/* AliPay Root Cert */}
      <div>
        <label htmlFor="alipay-alipay-root-cert" className={labelClass}>
          {t('AliPay Root Cert')}
        </label>
        <textarea
          id="alipay-alipay-root-cert"
          rows={5}
          value={settings['alipay-china_alipay_root_cert'] ?? ''}
          onChange={(e) => onChange('alipay-china_alipay_root_cert', e.target.value)}
          placeholder={t('Paste AliPay root certificate content (.crt)')}
          className={textareaClass}
        />
        <p className={hintClass}>
          {t("AliPay's root CA certificate")}
        </p>
      </div>

      {/* App Auth Token (Optional) */}
      <div>
        <label htmlFor="alipay-app-auth-token" className={labelClass}>
          {t('App Auth Token')}
          <span className="text-gray-400 font-normal ml-1">({t('Optional')})</span>
        </label>
        <input
          id="alipay-app-auth-token"
          type="text"
          value={settings['alipay-china_app_auth_token'] ?? ''}
          onChange={(e) => onChange('alipay-china_app_auth_token', e.target.value)}
          placeholder={t('Optional')}
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Required for third-party authorization scenarios')}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
