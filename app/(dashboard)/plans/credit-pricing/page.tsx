'use client'

import { useState, useEffect } from 'react'
import { systemConfigsAPI } from '@/lib/api/endpoints/system-configs'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'

const KEYS = [
  'account_credit.dynamic_qrcode_price',
  'account_credit.static_qrcode_price',
]

/**
 * Purpose: Executes CreditPricingPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function CreditPricingPage() {
  const { t } = useTranslation()
  const [dynamicPrice, setDynamicPrice] = useState('')
  const [staticPrice, setStaticPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    systemConfigsAPI.get(KEYS).then((configs) => {
      const map: Record<string, string> = {}
      configs.forEach((c: { key: string; value: string | null }) => { map[c.key] = c.value ?? '' })
      setDynamicPrice(map['account_credit.dynamic_qrcode_price'] ?? '10')
      setStaticPrice(map['account_credit.static_qrcode_price'] ?? '1')
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  /**
   * Purpose: Executes handleSave functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    try {
      await systemConfigsAPI.save([
        { key: 'account_credit.dynamic_qrcode_price', value: dynamicPrice },
        { key: 'account_credit.static_qrcode_price', value: staticPrice },
      ])
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { /* error */ }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LottieLoader size={80} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">{t('Credit Pricing')}</h1>
      <p className="mt-2 text-sm text-gray-600">
        {t('Configure pricing for account-credit based QR code generation.')}
      </p>

      <div className="mt-8 space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="dynamic-price" className="block text-sm font-medium text-gray-700">
            {t('Dynamic QR Code Price')}
          </label>
          <input
            id="dynamic-price"
            type="number"
            min={1}
            placeholder="10"
            value={dynamicPrice}
            onChange={(e) => setDynamicPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <p className="mt-1 text-xs text-gray-500">{t('Credits deducted per dynamic QR code generated.')}</p>
        </div>

        <div>
          <label htmlFor="static-price" className="block text-sm font-medium text-gray-700">
            {t('Static QR Code Price')}
          </label>
          <input
            id="static-price"
            type="number"
            min={1}
            placeholder="1"
            value={staticPrice}
            onChange={(e) => setStaticPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <p className="mt-1 text-xs text-gray-500">{t('Credits deducted per static QR code generated.')}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-medium text-white hover:brightness-105 disabled:opacity-50 transition-all"
          >
            {saving ? t('Saving...') : t('Save')}
          </button>
          {saved && <span className="text-sm text-green-600">{t('Saved successfully')}</span>}
        </div>
      </div>
    </div>
  )
}
