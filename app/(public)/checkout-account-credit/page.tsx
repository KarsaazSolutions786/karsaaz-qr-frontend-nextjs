'use client'

import { PayPalAccountCredit } from '@/components/features/payment/PayPalAccountCredit'

export default function CheckoutAccountCreditPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-bold text-gray-900">Add Account Credit</h1>
        <PayPalAccountCredit />
      </div>
    </div>
  )
}
