'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { toast } from 'sonner'
import { Wallet, ArrowDownLeft, ArrowUpRight, CreditCard } from 'lucide-react'
import { creditPackageAPI, orgUsageAPI, type CreditPackage } from '@/lib/api/endpoints/organization'

export default function BillingPage() {
  const params = useSearchParams()
  const orgId = Number(params.get('org') ?? 0)
  const [credits, setCredits] = useState<any>(null)
  const [packages, setPackages] = useState<CreditPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<number | null>(null)

  useEffect(() => {
    if (!orgId) return
    Promise.all([orgUsageAPI.credits(orgId), creditPackageAPI.list(orgId)])
      .then(([credRes, pkgRes]) => {
        setCredits(credRes.data.data)
        setPackages(pkgRes.data.data ?? [])
      })
      .catch(() => toast.error('Failed to load billing data'))
      .finally(() => setLoading(false))
  }, [orgId])

  const handlePurchase = async (pkg: CreditPackage) => {
    setPurchasing(pkg.id)
    try {
      const res = await creditPackageAPI.purchase(orgId, pkg.id)
      const { checkout_url } = res.data.data
      // eslint-disable-next-line react-hooks/immutability
      window.location.href = checkout_url
    } catch {
      toast.error('Failed to initiate checkout')
      setPurchasing(null)
    }
  }

  if (!orgId) return <p className="text-gray-500">Select an organization first.</p>

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Credits</h1>
        <p className="mt-1 text-sm text-gray-500">
          Purchase API credits and view your transaction history.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Balance card */}
          <div className="mb-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 p-6 text-white shadow-lg">
            <div className="mb-4 flex items-center gap-2 text-indigo-200">
              <Wallet className="h-5 w-5" />
              <span className="text-sm font-medium">Credit Balance</span>
            </div>
            <div className="text-4xl font-bold">
              {(credits?.balance ?? 0).toLocaleString()}
              <span className="ml-2 text-xl font-normal text-indigo-200">credits</span>
            </div>
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <div className="flex items-center gap-1 text-indigo-200">
                  <ArrowUpRight className="h-3 w-3" /> Purchased
                </div>
                <div className="font-semibold">
                  {(credits?.lifetime_purchased ?? 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-indigo-200">
                  <ArrowDownLeft className="h-3 w-3" /> Spent
                </div>
                <div className="font-semibold">
                  {(credits?.lifetime_spent ?? 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Credit packages */}
          <div className="mb-8">
            <h2 className="mb-4 font-semibold text-gray-800">Purchase Credits</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {packages.map(pkg => (
                <div
                  key={pkg.id}
                  className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                    <div className="mt-1 flex items-end gap-1">
                      <span className="text-3xl font-bold text-gray-900">
                        {pkg.credits.toLocaleString()}
                      </span>
                      <span className="mb-1 text-sm text-gray-400">credits</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      ${Number(pkg.price_usd).toFixed(2)} one-time ·{' '}
                      <span className="text-indigo-600 font-medium">
                        ${((pkg.price_usd / pkg.credits) * 1000).toFixed(2)}/1k credits
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handlePurchase(pkg)}
                    disabled={purchasing === pkg.id}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <CreditCard className="h-4 w-4" />
                    {purchasing === pkg.id
                      ? 'Redirecting…'
                      : `Buy for $${Number(pkg.price_usd).toFixed(2)}`}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent transactions */}
          {credits?.recent_transactions?.length > 0 && (
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <div className="border-b px-5 py-3">
                <h2 className="font-semibold text-gray-800">Recent Transactions</h2>
              </div>
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  {credits.recent_transactions.map((tx: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="font-medium text-gray-900">{tx.description ?? tx.type}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(tx.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td
                        className={`px-5 py-3 text-right font-semibold ${
                          Number(tx.amount) > 0 ? 'text-green-600' : 'text-red-500'
                        }`}
                      >
                        {Number(tx.amount) > 0 ? '+' : ''}
                        {Number(tx.amount).toLocaleString()}
                      </td>
                      <td className="px-5 py-3 text-right text-xs text-gray-400">
                        bal: {Number(tx.balance_after).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}
