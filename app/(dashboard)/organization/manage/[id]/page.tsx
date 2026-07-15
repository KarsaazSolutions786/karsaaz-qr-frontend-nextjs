'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Building2,
  ShieldAlert,
  ShieldCheck,
  Wallet,
  KeyRound,
  History,
  Plus,
  ArrowLeft,
} from 'lucide-react'
import {
  adminOrganizationAPI,
  type AdminOrganizationDetail,
} from '@/lib/api/endpoints/organization'

/**
 * Purpose: Admin organization detail -- suspend/reactivate, mandatory-reason credit
 * adjustment, masked API-key metadata, audit-log viewer. Backed by
 * Admin\AdminOrganizationController (ORG-V2-7 / OV7.1), which had no frontend
 * surface until this page.
 * Owner/Author: Claude Code
 * Created/Updated: 2026-07-15
 */
export default function AdminOrganizationManagePage() {
  const params = useParams()
  const organizationId = Number(params.id)

  const [detail, setDetail] = useState<AdminOrganizationDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const [suspendReason, setSuspendReason] = useState('')
  const [showSuspendForm, setShowSuspendForm] = useState(false)
  const [suspending, setSuspending] = useState(false)

  const [creditAmount, setCreditAmount] = useState('')
  const [creditReason, setCreditReason] = useState('')
  const [adjustingCredits, setAdjustingCredits] = useState(false)

  const load = () => {
    setLoading(true)
    adminOrganizationAPI
      .show(organizationId)
      .then(res => setDetail(res.data.data))
      .catch(() => toast.error('Failed to load organization'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (organizationId) load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId])

  const handleSuspend = async () => {
    if (!suspendReason.trim()) return toast.error('A reason is required to suspend')
    setSuspending(true)
    try {
      await adminOrganizationAPI.suspend(organizationId, suspendReason.trim())
      toast.success('Organization suspended')
      setShowSuspendForm(false)
      setSuspendReason('')
      load()
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Failed to suspend organization')
    } finally {
      setSuspending(false)
    }
  }

  const handleReactivate = async () => {
    setSuspending(true)
    try {
      await adminOrganizationAPI.reactivate(organizationId)
      toast.success('Organization reactivated')
      load()
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Failed to reactivate organization')
    } finally {
      setSuspending(false)
    }
  }

  const handleAdjustCredits = async () => {
    const amount = parseFloat(creditAmount)
    if (!amount || amount === 0) return toast.error('Enter a non-zero amount')
    if (!creditReason.trim()) return toast.error('A reason is required to adjust credits')
    setAdjustingCredits(true)
    try {
      await adminOrganizationAPI.adjustCredits(organizationId, amount, creditReason.trim())
      toast.success('Credits adjusted')
      setCreditAmount('')
      setCreditReason('')
      load()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to adjust credits')
    } finally {
      setAdjustingCredits(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  if (!detail) {
    return <div className="p-8 text-sm text-gray-500">Organization not found.</div>
  }

  const { organization, api_keys, audit_logs } = detail
  const isSuspended = organization.status === 'suspended'

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/organization"
        className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Organizations
      </Link>

      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
            <Building2 className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
            <p className="text-sm text-gray-400">{organization.slug}</p>
          </div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            organization.status === 'active'
              ? 'bg-green-100 text-green-700'
              : isSuspended
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {organization.status}
        </span>
      </div>

      {isSuspended && organization.suspension_reason && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>Suspended:</strong> {organization.suspension_reason}
        </div>
      )}

      {/* Owner + plan + credits */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs font-semibold text-gray-500">Owner</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{organization.owner.name}</p>
          <p className="text-xs text-gray-400">{organization.owner.email}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs font-semibold text-gray-500">Plan</p>
          <p className="mt-1 text-sm font-medium text-gray-900">
            {organization.org_plan?.name ?? 'No plan assigned'}
          </p>
          <div className="mt-2 flex gap-2">
            <Link
              href={`/organization/plans?org=${organization.id}`}
              className="text-xs font-medium text-primary-600 hover:underline"
            >
              Change plan
            </Link>
            <Link
              href={`/organization/plans?org=${organization.id}&custom=1`}
              className="flex items-center gap-0.5 text-xs font-medium text-indigo-600 hover:underline"
            >
              <Plus className="h-3 w-3" /> Create custom plan
            </Link>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs font-semibold text-gray-500">Credit Balance</p>
          <p className="mt-1 text-lg font-bold text-gray-900">{organization.credits.balance}</p>
        </div>
      </div>

      {/* Suspend / Reactivate */}
      <div className="mb-6 rounded-xl border bg-white p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <ShieldAlert className="h-4 w-4 text-red-500" /> Status Control
        </h2>
        {isSuspended ? (
          <button
            onClick={handleReactivate}
            disabled={suspending}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            <ShieldCheck className="h-4 w-4" /> {suspending ? 'Reactivating…' : 'Reactivate'}
          </button>
        ) : showSuspendForm ? (
          <div className="space-y-3">
            <textarea
              value={suspendReason}
              onChange={e => setSuspendReason(e.target.value)}
              placeholder="Reason for suspension (required)"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSuspend}
                disabled={suspending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {suspending ? 'Suspending…' : 'Confirm Suspend'}
              </button>
              <button
                onClick={() => setShowSuspendForm(false)}
                className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowSuspendForm(true)}
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
          >
            Suspend Organization
          </button>
        )}
      </div>

      {/* Credit adjustment */}
      <div className="mb-6 rounded-xl border bg-white p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <Wallet className="h-4 w-4 text-primary-500" /> Adjust Credits
        </h2>
        <div className="grid gap-3 sm:grid-cols-[160px_1fr_auto]">
          <input
            type="number"
            step="0.01"
            value={creditAmount}
            onChange={e => setCreditAmount(e.target.value)}
            placeholder="Amount (± )"
            className="rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <input
            type="text"
            value={creditReason}
            onChange={e => setCreditReason(e.target.value)}
            placeholder="Reason (required)"
            className="rounded-lg border px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <button
            onClick={handleAdjustCredits}
            disabled={adjustingCredits}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            {adjustingCredits ? 'Applying…' : 'Apply'}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-gray-400">
          Use a negative amount to deduct. Every adjustment is audit-logged.
        </p>
      </div>

      {/* API keys (masked) */}
      <div className="mb-6 rounded-xl border bg-white p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <KeyRound className="h-4 w-4 text-green-500" /> API Keys
        </h2>
        {api_keys.length === 0 ? (
          <p className="text-sm text-gray-400">No API keys.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-gray-400">
                <th className="pb-2">Name</th>
                <th className="pb-2">Prefix</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Last Used</th>
              </tr>
            </thead>
            <tbody>
              {api_keys.map(key => (
                <tr key={key.id} className="border-t">
                  <td className="py-2 font-medium text-gray-900">{key.name}</td>
                  <td className="py-2 text-gray-500">{key.prefix}••••••••</td>
                  <td className="py-2">
                    {key.revoked_at ? (
                      <span className="text-red-600">Revoked</span>
                    ) : key.is_active ? (
                      <span className="text-green-600">Active</span>
                    ) : (
                      <span className="text-gray-400">Inactive</span>
                    )}
                  </td>
                  <td className="py-2 text-gray-500">{key.last_used_at ?? 'Never'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Audit log */}
      <div className="rounded-xl border bg-white p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <History className="h-4 w-4 text-gray-500" /> Audit Log
        </h2>
        {audit_logs.length === 0 ? (
          <p className="text-sm text-gray-400">No audit entries yet.</p>
        ) : (
          <ul className="space-y-2 text-xs">
            {audit_logs.map(entry => (
              <li key={entry.id} className="flex items-center justify-between border-t pt-2">
                <span className="font-medium text-gray-700">{entry.action}</span>
                <span className="text-gray-400">{entry.created_at}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
