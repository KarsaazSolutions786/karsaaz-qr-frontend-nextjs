'use client'

import { useState } from 'react'
import { useValidatePromoCode } from '@/lib/hooks/mutations/useValidatePromoCode'

interface PromoCodeInputProps {
  planId: string
  onPromoApplied: (code: string, discountedPrice: number) => void
  onPromoRemoved: () => void
}

export function PromoCodeInput({
  planId,
  onPromoApplied,
  onPromoRemoved,
}: PromoCodeInputProps) {
  const [code, setCode] = useState('')
  const [appliedCode, setAppliedCode] = useState<string>()
  const [error, setError] = useState<string>()
  
  const validatePromo = useValidatePromoCode()

  const handleApply = async () => {
    if (!code) return

    setError(undefined)

    try {
      const result = await validatePromo.mutateAsync({
        code: code.toUpperCase(),
        planId,
      })

      if (result.valid && result.discountedPrice) {
        setAppliedCode(code.toUpperCase())
        onPromoApplied(code.toUpperCase(), result.discountedPrice)
        setCode('')
      } else {
        setError('Invalid or expired promo code')
      }
    } catch (err) {
      setError('Invalid or expired promo code')
    }
  }

  const handleRemove = () => {
    setAppliedCode(undefined)
    setError(undefined)
    onPromoRemoved()
  }

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-green-800">
            Promo code applied: <strong>{appliedCode}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="text-sm font-medium text-green-700 hover:text-green-800"
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div>
      <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700">
        Promo Code (Optional)
      </label>
      <div className="mt-1 flex gap-2">
        <input
          type="text"
          id="promo-code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          className="block flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={!code || validatePromo.isPending}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {validatePromo.isPending ? 'Checking...' : 'Apply'}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
