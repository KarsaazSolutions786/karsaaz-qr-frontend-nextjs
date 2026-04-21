'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { portalAxios } from '@/lib/context/OrgPortalAuthContext'
import { toast } from 'sonner'

interface CreditPackage {
  id: number
  name: string
  credits: number
  price_usd: number
}

function CreditPackagesSection() {
  const [packages, setPackages] = useState<CreditPackage[]>([])
  const [buying, setBuying] = useState<number | null>(null)

  useEffect(() => {
    portalAxios
      .get<{ data: CreditPackage[] }>('/credits/packages')
      .then(r => setPackages(r.data.data))
      .catch(() => {})
  }, [])

  const buy = async (pkgId: number) => {
    setBuying(pkgId)
    try {
      const res = await portalAxios.post<{ checkout_url: string }>('/credits/purchase', {
        package_id: pkgId,
      })
      window.location.assign(res.data.checkout_url)
    } catch {
      toast.error('Failed to start checkout. Please try again.')
      setBuying(null)
    }
  }

  if (packages.length === 0) return null

  return (
    <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 font-semibold text-gray-800">Buy Credits</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {packages.map(pkg => (
          <div
            key={pkg.id}
            className="rounded-xl border p-4 text-center transition-colors hover:border-indigo-400"
          >
            <div className="text-lg font-extrabold text-indigo-600">
              {pkg.credits.toLocaleString()}
            </div>
            <div className="mb-3 text-xs text-gray-500">credits</div>
            <div className="text-base font-bold text-gray-900">${pkg.price_usd}</div>
            <div className="mb-3 text-[10px] text-gray-400">{pkg.name}</div>
            <button
              onClick={() => buy(pkg.id)}
              disabled={buying === pkg.id}
              className="w-full rounded-lg bg-indigo-600 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {buying === pkg.id ? '…' : 'Buy'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function AlertSettingsSection() {
  const [threshold, setThreshold] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await portalAxios.patch('/settings/credit-alerts', {
        credit_alert_threshold: parseFloat(threshold),
        credit_alert_email: email,
      })
      setSaved(true)
      toast.success('Alert settings saved.')
      setTimeout(() => setSaved(false), 3000)
    } catch {
      toast.error('Failed to save alert settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mb-6 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-1 font-semibold text-gray-800">Low Balance Alert</h2>
      <p className="mb-4 text-sm text-gray-500">
        Receive an email when your credit balance drops below a threshold.
      </p>
      <form onSubmit={save} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Alert Threshold (credits)
          </label>
          <input
            type="number"
            value={threshold}
            onChange={e => setThreshold(e.target.value)}
            placeholder="e.g. 100"
            min="0"
            step="any"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
            required
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-gray-600">Alert Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="billing@company.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {saved ? 'Saved ✓' : saving ? 'Saving…' : 'Save Alert'}
        </button>
      </form>
    </div>
  )
}

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
          Your token balance is low. Purchase a credit package below to top up.
        </div>
      )}

      <CreditPackagesSection />
      <AlertSettingsSection />

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
