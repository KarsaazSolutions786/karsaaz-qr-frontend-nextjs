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
 * PayKickstart subscription billing payment processor configuration form.
 *
 * Fields (matching P1 + PROCESSORS definition):
 * - Mode (test / live)
 * - Secret Key
 * - New Registration Email Template (textarea)
 * - Upsale Email Template (textarea)
 *
 * Manual webhook URL is shown (showWebhookUrl on PROCESSORS).
 * PayKickstart requires IPN URL in Product Settings > Integration.
 */
export function PayKickstartForm({ settings, onChange }: ProcessorFormProps) {
  const { t } = useTranslation()

  return (
    <PaymentProcessorFormBase
      slug="paykickstart"
      settings={settings}
      onChange={onChange}
      showWebhookUrl
      webhookMessage={t(
        'In PayKickstart dashboard, go to Product Settings > Integration (section 3) > Enable IPN and add the following URL for all events. This should be done for every product.'
      )}
    >
      {/* Mode */}
      <div>
        <label htmlFor="paykickstart-mode" className={labelClass}>
          {t('Mode')}
        </label>
        <select
          id="paykickstart-mode"
          value={settings.paykickstart_mode ?? 'test'}
          onChange={(e) => onChange('paykickstart_mode', e.target.value)}
          className={selectClass}
        >
          <option value="test">{t('Test')}</option>
          <option value="live">{t('Live')}</option>
        </select>
      </div>

      {/* Secret Key */}
      <div>
        <label htmlFor="paykickstart-secret-key" className={labelClass}>
          {t('Secret Key')}
        </label>
        <input
          id="paykickstart-secret-key"
          type="password"
          value={settings.paykickstart_secret_key ?? ''}
          onChange={(e) => onChange('paykickstart_secret_key', e.target.value)}
          placeholder={t('Secret key')}
          className={inputClass}
        />
        <p className={hintClass}>
          {t('Secret key can be found in your campaign settings.')}
        </p>
      </div>

      {/* New Registration Email Template */}
      <div>
        <label htmlFor="paykickstart-email-template" className={labelClass}>
          {t('New Registration Email Template')}
        </label>
        <textarea
          id="paykickstart-email-template"
          rows={6}
          value={settings.paykickstart_email_template ?? ''}
          onChange={(e) => onChange('paykickstart_email_template', e.target.value)}
          placeholder={t('Enter email template...')}
          className={textareaClass}
        />
        <p className={hintClass}>
          {t(
            'Automatically sent after successful payment via PayKickstart checkout page. Available variables: FULL_NAME, EMAIL, PASSWORD, PLAN_NAME'
          )}
        </p>
      </div>

      {/* Upsale Email Template */}
      <div>
        <label htmlFor="paykickstart-upgrade-email-template" className={labelClass}>
          {t('Upsale Email Template')}
        </label>
        <textarea
          id="paykickstart-upgrade-email-template"
          rows={6}
          value={settings.paykickstart_upgrade_email_template ?? ''}
          onChange={(e) => onChange('paykickstart_upgrade_email_template', e.target.value)}
          placeholder={t('Enter upsale email template...')}
          className={textareaClass}
        />
        <p className={hintClass}>
          {t(
            'Automatically sent after successful upsale. The account will be upgraded. Available variables: FULL_NAME, EMAIL, PLAN_NAME'
          )}
        </p>
      </div>
    </PaymentProcessorFormBase>
  )
}
