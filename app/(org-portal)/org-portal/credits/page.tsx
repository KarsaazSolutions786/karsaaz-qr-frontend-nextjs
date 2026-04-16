'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { portalAxios } from '@/lib/context/OrgPortalAuthContext'

interface Transaction {
  amount: number
  type: 'credit' | 'debit'
  description: string
  balance_after: number
  created_at: string
}

interface CreditsData {
  balance: number
  lifetime_purchased: number
  lifetime_spent: number
  transactions: Transaction[]
}

export default function OrgPortalCreditsPage() {
  const [data, setData] = useState<CreditsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    portalAxios
      .get<{ data: CreditsData }>('/credits')
      .then(res => setData(res.data.data))
      .catch(() => setError('Failed to load credit data.'))
      .finally(() => setLoading(false))
  }, [])

  const fmt = (n: number) => n.toFixed(2)
  const fmtDate = (d: string) => new Date(d).toLocaleString()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        <AlertCircle className="h-4 w-4 shrink-0" /> {error || 'Something went wrong.'}
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tokens</h1>
        <p className="mt-1 text-sm text-gray-500">Your token balance and transaction history.</p>
      </div>

      {/* Balance summary */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-white p-5 shadow-sm text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Balance</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{fmt(data.balance)}</p>
          <p className="mt-0.5 text-xs text-gray-400">available tokens</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Purchased</p>
          <p className="mt-2 text-2xl font-bold text-green-600">{fmt(data.lifetime_purchased)}</p>
          <p className="mt-0.5 text-xs text-gray-400">lifetime</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-sm text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Spent</p>
          <p className="mt-2 text-2xl font-bold text-orange-600">{fmt(data.lifetime_spent)}</p>
          <p className="mt-0.5 text-xs text-gray-400">lifetime</p>
        </div>
      </div>

      {/* Low balance warning */}
      {data.balance < 50 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Your token balance is low. Contact your account manager to top up.
        </div>
      )}

      {/* Transactions */}
      <div className="rounded-xl border bg-white shadow-sm">
        <div className="border-b px-5 py-3">
          <h2 className="text-sm font-semibold text-gray-700">Transaction History</h2>
        </div>
        {data.transactions.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-400">No transactions yet.</p>
        ) : (
          <div className="divide-y">
            {data.transactions.map((tx, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    tx.type === 'credit' ? 'bg-green-100' : 'bg-orange-100'
                  }`}
                >
                  {tx.type === 'credit' ? (
                    <ArrowUpCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4 text-orange-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {tx.description || 'Transaction'}
                  </p>
                  <p className="text-xs text-gray-400">{fmtDate(tx.created_at)}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-orange-600'}`}
                  >
                    {tx.type === 'credit' ? '+' : '−'}
                    {fmt(Math.abs(tx.amount))}
                  </p>
                  <p className="text-xs text-gray-400">bal: {fmt(tx.balance_after)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
