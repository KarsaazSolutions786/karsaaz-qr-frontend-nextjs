'use client'

interface Props {
  settings: Record<string, string>
  onChange: (key: string, value: string) => void
}

const inputClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

const selectClass =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white'

export function StripeForm({ settings, onChange }: Props) {
  return (
    <div className="space-y-4">
      {/* Publishable Key */}
      <div>
        <label htmlFor="stripe-publisher-key" className="block text-sm font-medium text-gray-700">
          Publishable Key
        </label>
        <input
          id="stripe-publisher-key"
          type="password"
          value={settings.publisher_key ?? ''}
          onChange={e => onChange('publisher_key', e.target.value)}
          placeholder="pk_..."
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-500">
          Your Stripe publishable key starting with pk_test_ or pk_live_
        </p>
      </div>

      {/* Secret Key */}
      <div>
        <label htmlFor="stripe-secret-key" className="block text-sm font-medium text-gray-700">
          Secret Key
        </label>
        <input
          id="stripe-secret-key"
          type="password"
          value={settings.secret_key ?? ''}
          onChange={e => onChange('secret_key', e.target.value)}
          placeholder="sk_..."
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-500">
          Your Stripe secret key starting with sk_test_ or sk_live_
        </p>
      </div>

      {/* Webhook Secret */}
      <div>
        <label htmlFor="stripe-webhook-secret" className="block text-sm font-medium text-gray-700">
          Webhook Secret
        </label>
        <input
          id="stripe-webhook-secret"
          type="password"
          value={settings.webhook_secret ?? ''}
          onChange={e => onChange('webhook_secret', e.target.value)}
          placeholder="whsec_..."
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-500">Found in your Stripe Dashboard under Webhooks</p>
      </div>

      {/* Automatic Tax */}
      <div>
        <label htmlFor="stripe-automatic-tax" className="block text-sm font-medium text-gray-700">
          Automatic Tax
        </label>
        <select
          id="stripe-automatic-tax"
          value={settings.automatic_tax ?? 'disabled'}
          onChange={e => onChange('automatic_tax', e.target.value)}
          className={selectClass}
        >
          <option value="disabled">Disabled (Default)</option>
          <option value="enabled">Enabled</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Enable Stripe Tax for automatic tax calculation
        </p>
      </div>

      {/* Tax Behavior */}
      <div>
        <label htmlFor="stripe-tax-behavior" className="block text-sm font-medium text-gray-700">
          Tax Behavior
        </label>
        <select
          id="stripe-tax-behavior"
          value={settings.tax_behavior ?? 'exclusive'}
          onChange={e => onChange('tax_behavior', e.target.value)}
          className={selectClass}
        >
          <option value="exclusive">Exclusive (Tax added to price)</option>
          <option value="inclusive">Inclusive (Tax included in price)</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          How tax is calculated relative to the product price
        </p>
      </div>

      {/* Mode */}
      <div>
        <label htmlFor="stripe-mode" className="block text-sm font-medium text-gray-700">
          Mode
        </label>
        <select
          id="stripe-mode"
          value={settings.mode ?? 'test'}
          onChange={e => onChange('mode', e.target.value)}
          className={selectClass}
        >
          <option value="test">Test Mode</option>
          <option value="live">Live Mode</option>
        </select>
      </div>

      {/* Webhook URL (read-only display) */}
      {settings.webhook_url && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
          <div className="mt-1 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={settings.webhook_url}
              className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
            />
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(settings.webhook_url ?? '')}
              className="flex-shrink-0 rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Copy
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Add this URL to your Stripe webhook endpoints
          </p>
        </div>
      )}
    </div>
  )
}

export default StripeForm
