'use client'

import { useState } from 'react'
import {
  createPayPalChargeLink,
} from '@/lib/api/endpoints/paypal'

const PRESET_AMOUNTS = [5, 10, 20, 30, 40, 50]
const MIN_AMOUNT = 5

export function PayPalAccountCredit() {
  const [amount, setAmount] = useState(10)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const effectiveAmount = customAmount ? Number(customAmount) : amount

  async function handlePurchase() {
    if (effectiveAmount < MIN_AMOUNT) {
      setError(`Minimum amount is $${MIN_AMOUNT}`)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data } = await createPayPalChargeLink(effectiveAmount)
      if (data?.link) {
        window.location.href = data.link
      } else {
        setError('Failed to generate PayPal link.')
      }
    } catch {
      setError('Failed to create payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Add Account Credit via PayPal</h3>

      {/* Preset amounts */}
      <div className="flex flex-wrap gap-2">
        {PRESET_AMOUNTS.map((a) => (
          <button
            key={a}
            onClick={() => { setAmount(a); setCustomAmount('') }}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              effectiveAmount === a && !customAmount
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ${a}
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">or</span>
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-sm">$</span>
          <input
            type="number"
            min={MIN_AMOUNT}
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="block w-full rounded-lg border border-gray-200 pl-7 pr-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handlePurchase}
        disabled={loading || effectiveAmount < MIN_AMOUNT}
        className="w-full rounded-lg bg-yellow-400 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-yellow-500 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Redirecting to PayPal...' : `Pay $${effectiveAmount} with PayPal`}
      </button>
    </div>
  )
}
