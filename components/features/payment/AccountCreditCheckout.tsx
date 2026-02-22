'use client'

interface AccountCreditCheckoutProps {
  balance: number
  onConfirm: (amount: number) => void
  isLoading?: boolean
}

export default function AccountCreditCheckout({
  balance,
  onConfirm,
  isLoading = false,
}: AccountCreditCheckoutProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const amount = parseFloat(formData.get('amount') as string)
    if (!isNaN(amount) && amount > 0 && amount <= balance) {
      onConfirm(amount)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Pay with Account Credit</h2>

      <div className="mb-6 rounded-md bg-gray-50 p-4">
        <p className="text-sm text-gray-600">Available Balance</p>
        <p className="text-2xl font-bold text-gray-900">
          ${balance.toFixed(2)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="credit-amount" className="block text-sm font-medium text-gray-700">
            Amount to Charge
          </label>
          <input
            id="credit-amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            max={balance}
            required
            placeholder="0.00"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || balance <= 0}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Confirm Payment'}
        </button>
      </form>
    </div>
  )
}
