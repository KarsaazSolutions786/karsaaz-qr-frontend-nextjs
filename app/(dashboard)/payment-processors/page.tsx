'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSystemConfigs } from '@/lib/hooks/queries/useSystemConfigs'
import { useSaveSystemConfigs } from '@/lib/hooks/mutations/useSystemConfigMutations'
import apiClient from '@/lib/api/client'

// ─── Processor Definitions ────────────────────────────────────────────────────

interface ProcessorField {
  key: string
  label: string
  type: 'text' | 'password' | 'textarea' | 'select'
  placeholder?: string
  options?: { value: string; label: string }[]
}

interface ProcessorDef {
  id: string
  slug: string
  name: string
  fields: ProcessorField[]
  hasWebhook?: boolean
  hasTestCredentials?: boolean
}

const PROCESSORS: ProcessorDef[] = [
  {
    id: 'stripe', slug: 'stripe', name: 'Stripe', hasWebhook: true, hasTestCredentials: true,
    fields: [
      { key: 'stripe_publisher_key', label: 'Publisher Key', type: 'password', placeholder: 'pk_live_...' },
      { key: 'stripe_secret_key', label: 'Secret Key', type: 'password', placeholder: 'sk_live_...' },
      { key: 'stripe_automatic_tax', label: 'Automatic Tax', type: 'select', options: [{ value: 'enabled', label: 'Enabled' }, { value: 'disabled', label: 'Disabled' }] },
      { key: 'stripe_tax_behavior', label: 'Tax Behavior', type: 'select', options: [{ value: 'inclusive', label: 'Inclusive' }, { value: 'exclusive', label: 'Exclusive' }] },
    ],
  },
  {
    id: 'paypal', slug: 'paypal', name: 'PayPal', hasTestCredentials: true,
    fields: [
      { key: 'paypal_client_id', label: 'Client ID', type: 'password', placeholder: 'AeA...' },
      { key: 'paypal_client_secret', label: 'Client Secret', type: 'password' },
    ],
  },
  {
    id: 'payu-international', slug: 'payu-international', name: 'PayU International', hasTestCredentials: true,
    fields: [
      { key: 'payu-international_merchant_key', label: 'Merchant Key', type: 'password' },
      { key: 'payu-international_merchant_salt', label: 'Merchant Salt', type: 'password' },
    ],
  },
  {
    id: 'paddle', slug: 'paddle', name: 'Paddle (Classic)', hasWebhook: true, hasTestCredentials: true,
    fields: [
      { key: 'paddle_vendor_id', label: 'Vendor ID', type: 'text' },
      { key: 'paddle_vendor_auth_code', label: 'Vendor Auth Code', type: 'password' },
      { key: 'paddle_public_key', label: 'Public Key', type: 'textarea' },
    ],
  },
  {
    id: 'paddle-billing', slug: 'paddle-billing', name: 'Paddle (Billing)', hasWebhook: true, hasTestCredentials: true,
    fields: [
      { key: 'paddle-billing_api_key', label: 'API Key', type: 'password' },
      { key: 'paddle-billing_client_side_token', label: 'Client Side Token', type: 'password' },
      { key: 'paddle-billing_webhook_secret', label: 'Webhook Secret', type: 'password' },
    ],
  },
  {
    id: 'razorpay', slug: 'razorpay', name: 'Razorpay', hasWebhook: true, hasTestCredentials: true,
    fields: [
      { key: 'razorpay_key_id', label: 'Key ID', type: 'password' },
      { key: 'razorpay_key_secret', label: 'Key Secret', type: 'password' },
    ],
  },
  {
    id: 'mercadopago', slug: 'mercadopago', name: 'Mercado Pago', hasTestCredentials: true,
    fields: [
      { key: 'mercadopago_access_token', label: 'Access Token', type: 'password' },
      { key: 'mercadopago_public_key', label: 'Public Key', type: 'password' },
    ],
  },
  {
    id: 'paytr', slug: 'paytr', name: 'PayTR', hasTestCredentials: true,
    fields: [
      { key: 'paytr_merchant_id', label: 'Merchant ID', type: 'text' },
      { key: 'paytr_merchant_key', label: 'Merchant Key', type: 'password' },
      { key: 'paytr_merchant_salt', label: 'Merchant Salt', type: 'password' },
    ],
  },
  {
    id: 'payfast', slug: 'payfast', name: 'PayFast', hasTestCredentials: true,
    fields: [
      { key: 'payfast_merchant_id', label: 'Merchant ID', type: 'text' },
      { key: 'payfast_merchant_key', label: 'Merchant Key', type: 'password' },
      { key: 'payfast_passphrase', label: 'Passphrase', type: 'password' },
    ],
  },
  {
    id: 'xendit', slug: 'xendit', name: 'Xendit', hasWebhook: true, hasTestCredentials: true,
    fields: [
      { key: 'xendit_secret_key', label: 'Secret Key', type: 'password' },
      { key: 'xendit_webhook_verification_token', label: 'Webhook Verification Token', type: 'password' },
    ],
  },
  {
    id: 'mollie', slug: 'mollie', name: 'Mollie', hasTestCredentials: true,
    fields: [
      { key: 'mollie_api_key', label: 'API Key', type: 'password', placeholder: 'live_...' },
    ],
  },
  {
    id: 'paystack', slug: 'paystack', name: 'PayStack', hasTestCredentials: true,
    fields: [
      { key: 'paystack_public_key', label: 'Public Key', type: 'password', placeholder: 'pk_live_...' },
      { key: 'paystack_secret_key', label: 'Secret Key', type: 'password', placeholder: 'sk_live_...' },
    ],
  },
  {
    id: 'alipay-china', slug: 'alipay-china', name: 'Alipay China', hasTestCredentials: true,
    fields: [
      { key: 'alipay-china_app_id', label: 'App ID', type: 'text' },
      { key: 'alipay-china_private_key', label: 'Private Key', type: 'textarea' },
      { key: 'alipay-china_public_key', label: 'Public Key', type: 'textarea' },
    ],
  },
  {
    id: 'yookassa', slug: 'yookassa', name: 'YooKassa', hasTestCredentials: true,
    fields: [
      { key: 'yookassa_shop_id', label: 'Shop ID', type: 'text' },
      { key: 'yookassa_secret_key', label: 'Secret Key', type: 'password' },
    ],
  },
  {
    id: 'paykickstart', slug: 'paykickstart', name: 'PayKickstart', hasTestCredentials: true,
    fields: [
      { key: 'paykickstart_api_key', label: 'API Key', type: 'password' },
    ],
  },
  {
    id: 'orange-bf', slug: 'orange-bf', name: 'Orange (Mobile Money)', hasTestCredentials: true,
    fields: [
      { key: 'orange-bf_client_id', label: 'Client ID', type: 'text' },
      { key: 'orange-bf_client_secret', label: 'Client Secret', type: 'password' },
    ],
  },
  {
    id: 'payu-latam', slug: 'payu-latam', name: 'PayU Latam', hasTestCredentials: true,
    fields: [
      { key: 'payu-latam_api_key', label: 'API Key', type: 'password' },
      { key: 'payu-latam_api_login', label: 'API Login', type: 'text' },
      { key: 'payu-latam_merchant_id', label: 'Merchant ID', type: 'text' },
      { key: 'payu-latam_account_id', label: 'Account ID', type: 'text' },
    ],
  },
  {
    id: '2checkout', slug: '2checkout', name: '2Checkout', hasTestCredentials: true,
    fields: [
      { key: '2checkout_seller_id', label: 'Seller ID', type: 'text' },
      { key: '2checkout_publishable_key', label: 'Publishable Key', type: 'password' },
      { key: '2checkout_private_key', label: 'Private Key', type: 'password' },
    ],
  },
  {
    id: 'dintero', slug: 'dintero', name: 'Dintero', hasTestCredentials: true,
    fields: [
      { key: 'dintero_account_id', label: 'Account ID', type: 'text' },
      { key: 'dintero_client_id', label: 'Client ID', type: 'text' },
      { key: 'dintero_client_secret', label: 'Client Secret', type: 'password' },
    ],
  },
  {
    id: 'fib', slug: 'fib', name: 'FIB', hasTestCredentials: true,
    fields: [
      { key: 'fib_client_id', label: 'Client ID', type: 'text' },
      { key: 'fib_client_secret', label: 'Client Secret', type: 'password' },
    ],
  },
  {
    id: 'postfinance', slug: 'postfinance', name: 'Post Finance', hasTestCredentials: true,
    fields: [
      { key: 'postfinance_psp_id', label: 'PSP ID', type: 'text' },
      { key: 'postfinance_api_username', label: 'API Username', type: 'text' },
      { key: 'postfinance_api_password', label: 'API Password', type: 'password' },
    ],
  },
  {
    id: 'flutterwave', slug: 'flutterwave', name: 'Flutter Wave', hasWebhook: true, hasTestCredentials: true,
    fields: [
      { key: 'flutterwave_public_key', label: 'Public Key', type: 'password' },
      { key: 'flutterwave_secret_key', label: 'Secret Key', type: 'password' },
      { key: 'flutterwave_encryption_key', label: 'Encryption Key', type: 'password' },
    ],
  },
  {
    id: 'offline-payments', slug: 'offline-payments', name: 'Offline Payments', hasTestCredentials: false, hasWebhook: false,
    fields: [
      { key: 'offline-payment_customer_instructions', label: 'Customer Instructions (Markdown)', type: 'textarea', placeholder: 'Explain how customers should make offline payments…' },
      { key: 'offline-payment_payment_proof', label: 'Require Payment Proof', type: 'select', options: [{ value: 'enabled', label: 'Enabled' }, { value: 'disabled', label: 'Disabled' }] },
    ],
  },
]

// ─── Processor Form ────────────────────────────────────────────────────────────

function ProcessorForm({ processor }: { processor: ProcessorDef }) {
  const enabledKey = `${processor.slug}_enabled`
  const displayNameKey = `${processor.slug}_display_name`
  const sortOrderKey = `${processor.slug}_sort_order`

  const allKeys = [
    enabledKey,
    displayNameKey,
    sortOrderKey,
    ...processor.fields.map((f) => f.key),
  ]

  const { data: configs, isLoading } = useSystemConfigs(allKeys)
  const saveMutation = useSaveSystemConfigs(allKeys)
  const [saved, setSaved] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    if (configs) setValues(configs)
  }, [configs])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const configs = allKeys.map((key) => ({ key, value: values[key] ?? '' }))
    await saveMutation.mutateAsync(configs)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleTestCredentials = async () => {
    setTestResult(null)
    try {
      const res = await apiClient.post<{ success: boolean; message?: string }>(
        `/payment-processors/${processor.slug}/test-credentials`
      )
      setTestResult(res.data.success ? '✓ Credentials are valid.' : `✗ ${res.data.message || 'Invalid credentials.'}`)
    } catch {
      setTestResult('✗ Failed to test credentials.')
    }
  }

  const handleRegisterWebhook = async () => {
    try {
      await apiClient.post(`/payment-processors/${processor.slug}/register-webhook`)
      alert('Webhook registered successfully.')
    } catch {
      alert('Failed to register webhook.')
    }
  }

  const set = (key: string, val: string) => setValues((prev) => ({ ...prev, [key]: val }))

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {saveMutation.error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">Failed to save settings.</div>
      )}
      {saved && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">Settings saved successfully.</div>
      )}
      {testResult && (
        <div className={`rounded-md p-4 text-sm ${testResult.startsWith('✓') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {testResult}
        </div>
      )}

      {/* Offline payments note */}
      {processor.id === 'offline-payments' && (
        <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
          After approving offline payments, review them in the{' '}
          <a href="/transactions" className="underline hover:text-blue-600">Transactions</a> section.
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        {/* Enabled toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="flex gap-4">
            {(['enabled', 'disabled'] as const).map((v) => (
              <label key={v} className="flex cursor-pointer items-center gap-2 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                <input
                  type="radio"
                  name={enabledKey}
                  value={v}
                  checked={(values[enabledKey] ?? 'disabled') === v}
                  onChange={(e) => set(enabledKey, e.target.value)}
                  className="text-blue-600"
                />
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Display Name</label>
          <input
            type="text"
            value={values[displayNameKey] ?? ''}
            onChange={(e) => set(displayNameKey, e.target.value)}
            placeholder={processor.name}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          />
        </div>

        {/* Processor-specific fields */}
        {processor.fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                rows={4}
                value={values[field.key] ?? ''}
                onChange={(e) => set(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none"
              />
            ) : field.type === 'select' ? (
              <select
                value={values[field.key] ?? (field.options?.[0]?.value ?? '')}
                onChange={(e) => set(field.key, e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={values[field.key] ?? ''}
                onChange={(e) => set(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
              />
            )}
          </div>
        ))}

        {/* Sort Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Sort Order</label>
          <input
            type="number"
            value={values[sortOrderKey] ?? '0'}
            onChange={(e) => set(sortOrderKey, e.target.value)}
            className="mt-1 block w-32 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saveMutation.isPending}
          className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {saveMutation.isPending ? 'Saving…' : 'Save'}
        </button>
        {processor.hasTestCredentials && (
          <button
            type="button"
            onClick={handleTestCredentials}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Test Credentials
          </button>
        )}
        {processor.hasWebhook && (
          <button
            type="button"
            onClick={handleRegisterWebhook}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Register Webhook
          </button>
        )}
      </div>
    </form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function PaymentProcessorsPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTabId = searchParams.get('tab-id') ?? 'stripe'
  const activeProcessor = (PROCESSORS.find((p) => p.id === activeTabId) ?? PROCESSORS[0]) as ProcessorDef

  const switchTab = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab-id', id)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment Processors</h1>
        <p className="mt-2 text-sm text-gray-600">Configure payment gateway credentials and settings.</p>
      </div>

      <div className="flex gap-6">
        {/* Tab sidebar */}
        <nav className="w-48 flex-shrink-0">
          <ul className="space-y-1">
            {PROCESSORS.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => switchTab(p.id)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                    activeProcessor.id === p.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">{activeProcessor.name}</h2>
          <ProcessorForm key={activeProcessor.id} processor={activeProcessor} />
        </div>
      </div>
    </div>
  )
}

export default function PaymentProcessorsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
      </div>
    }>
      <PaymentProcessorsPageInner />
    </Suspense>
  )
}
