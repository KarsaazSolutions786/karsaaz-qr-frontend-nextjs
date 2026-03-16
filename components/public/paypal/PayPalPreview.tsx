'use client'

import React, { useState } from 'react'
import {
  CreditCard,
  DollarSign,
  Package,
  Heart,
  ShoppingCart,
  ExternalLink,
  Shield,
  Loader2,
} from 'lucide-react'
import PreviewHeader from '@/components/public/shared/PreviewHeader'
import PreviewFooter from '@/components/public/shared/PreviewFooter'
import QRCodeBadge from '@/components/public/shared/QRCodeBadge'
import { useTranslation } from '@/lib/i18n'

interface PayPalData {
  email: string
  type: '_xclick' | '_donations' | '_cart'
  item_name?: string
  item_id?: string
  amount?: number
  currency?: string
  shipping?: number
  tax?: number
  theme?: {
    primaryColor?: string
    backgroundColor?: string
  }
}

interface PayPalPreviewProps {
  data: PayPalData
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '\u20ac',
  GBP: '\u00a3',
  AUD: 'A$',
  CAD: 'C$',
  INR: '\u20b9',
  JPY: '\u00a5',
  BRL: 'R$',
}

const TYPE_CONFIG = {
  _xclick: {
    label: 'Buy Now',
    description: 'Purchase this item securely via PayPal',
    icon: ShoppingCart,
    buttonText: 'Pay with PayPal',
    gradient: 'from-blue-600 to-blue-700',
  },
  _donations: {
    label: 'Donation',
    description: 'Make a donation securely via PayPal',
    icon: Heart,
    buttonText: 'Donate via PayPal',
    gradient: 'from-pink-500 to-rose-600',
  },
  _cart: {
    label: 'Add to Cart',
    description: 'Add this item to your PayPal cart',
    icon: Package,
    buttonText: 'Add to PayPal Cart',
    gradient: 'from-emerald-500 to-teal-600',
  },
}

export default function PayPalPreview({ data }: PayPalPreviewProps) {
  const { t } = useTranslation()
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const currency = data.currency || 'USD'
  const currencySymbol = CURRENCY_SYMBOLS[currency] || currency
  const typeConfig = TYPE_CONFIG[data.type] || TYPE_CONFIG._xclick
  const TypeIcon = typeConfig.icon
  const primaryColor = data.theme?.primaryColor || '#0070ba'

  const subtotal = data.amount || 0
  const shippingCost = data.shipping || 0
  const taxRate = data.tax || 0
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + shippingCost + taxAmount

  const formatAmount = (amount: number) => {
    return `${currencySymbol}${amount.toFixed(2)}`
  }

  const buildPayPalUrl = () => {
    const params = new URLSearchParams()
    params.append('cmd', data.type)
    params.append('business', data.email)
    params.append('currency_code', currency)

    if (data.item_name) params.append('item_name', data.item_name)
    if (data.item_id) params.append('item_number', data.item_id)
    if (data.amount) params.append('amount', data.amount.toString())
    if (data.shipping) params.append('shipping', data.shipping.toString())
    if (data.tax) params.append('tax_rate', data.tax.toString())

    return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`
  }

  const handlePayPalClick = () => {
    if (subtotal > 0) {
      setShowConfirm(true)
    } else {
      proceedToPayPal()
    }
  }

  const proceedToPayPal = () => {
    setIsProcessing(true)
    const url = buildPayPalUrl()
    window.location.href = url
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      <PreviewHeader
        title={data.item_name || t('PayPal Payment')}
        subtitle={t(typeConfig.label)}
      />

      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          {/* Payment Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Card Header */}
            <div
              className={`bg-gradient-to-r ${typeConfig.gradient} px-8 py-8 text-center text-white relative`}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-6 w-24 h-24 rounded-full border-2 border-white" />
                <div className="absolute bottom-2 left-6 w-16 h-16 rounded-full border-2 border-white" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <TypeIcon className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold mb-1">
                  {data.item_name || t(typeConfig.label)}
                </h1>
                <p className="text-white/80 text-sm">{t(typeConfig.description)}</p>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Payment Details */}
              <div className="space-y-4">
                {data.item_name && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{t('Item')}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {data.item_name}
                    </span>
                  </div>
                )}

                {data.item_id && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">{t('Item ID')}</span>
                    <span className="text-sm font-mono text-gray-500">
                      {data.item_id}
                    </span>
                  </div>
                )}

                {subtotal > 0 && (
                  <>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-sm text-gray-600">
                        {data.type === '_donations' ? t('Donation Amount') : t('Subtotal')}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatAmount(subtotal)}
                      </span>
                    </div>

                    {shippingCost > 0 && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600">{t('Shipping')}</span>
                        <span className="text-sm text-gray-900">
                          {formatAmount(shippingCost)}
                        </span>
                      </div>
                    )}

                    {taxRate > 0 && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Tax ({taxRate}%)
                        </span>
                        <span className="text-sm text-gray-900">
                          {formatAmount(taxAmount)}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Total */}
              {total > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-900">{t('Total')}</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatAmount(total)}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {currency}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirmation Dialog */}
              {showConfirm && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-sm text-blue-800 mb-3">
                    You are about to be redirected to PayPal to complete your{' '}
                    {data.type === '_donations' ? 'donation' : 'payment'} of{' '}
                    <strong>{formatAmount(total)}</strong>.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={proceedToPayPal}
                      disabled={isProcessing}
                      className="flex-1 py-2.5 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t('Redirecting...')}
                        </>
                      ) : (
                        t('Continue to PayPal')
                      )}
                    </button>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {t('Cancel')}
                    </button>
                  </div>
                </div>
              )}

              {/* PayPal Button */}
              {!showConfirm && (
                <button
                  onClick={handlePayPalClick}
                  disabled={isProcessing}
                  className="w-full py-4 px-6 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('Processing...')}
                    </>
                  ) : (
                    <>
                      {/* PayPal Logo */}
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z" />
                      </svg>
                      {t(typeConfig.buttonText)}
                    </>
                  )}
                </button>
              )}

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Shield className="w-4 h-4" />
                <span>{t('Secured by PayPal Buyer Protection')}</span>
              </div>

              {/* Payment Method Icons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <div className="flex items-center gap-1 text-gray-300">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Visa</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs">Mastercard</span>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-xs">PayPal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Link Fallback */}
          <div className="mt-4 text-center">
            <a
              href={buildPayPalUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {t('Open PayPal directly')}
            </a>
          </div>
        </div>
      </main>

      <PreviewFooter />
      <QRCodeBadge variant="branded" position="bottom-right" />
    </div>
  )
}
