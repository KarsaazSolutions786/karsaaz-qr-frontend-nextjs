'use client'

import { useState, useEffect } from 'react'
import {
  getStripeSubscription,
  pauseSubscription,
  resumeSubscription,
  type StripeSubscription,
} from '@/lib/api/endpoints/stripe'
import { RefreshCw, Pause, Play, AlertCircle } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  canceled: 'bg-red-100 text-red-700',
  incomplete: 'bg-orange-100 text-orange-700',
  trialing: 'bg-blue-100 text-blue-700',
  past_due: 'bg-red-100 text-red-700',
}

export function StripeSubscriptionManagement() {
  const [subscription, setSubscription] = useState<StripeSubscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showPauseModal, setShowPauseModal] = useState(false)
  const [showResumeModal, setShowResumeModal] = useState(false)

  useEffect(() => {
    loadSubscription()
  }, [])

  async function loadSubscription() {
    setLoading(true)
    try {
      const { data } = await getStripeSubscription()
      setSubscription(data)
    } catch {
      setSubscription(null)
    } finally {
      setLoading(false)
    }
  }

  async function handlePause() {
    setActionLoading(true)
    try {
      await pauseSubscription()
      await loadSubscription()
      setShowPauseModal(false)
    } catch {
      // Failed
    } finally {
      setActionLoading(false)
    }
  }

  async function handleResume() {
    setActionLoading(true)
    try {
      await resumeSubscription()
      await loadSubscription()
      setShowResumeModal(false)
    } catch {
      // Failed
    } finally {
      setActionLoading(false)
    }
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  }

  function formatAmount(amount?: number, interval?: string) {
    if (!amount) return '—'
    return `$${(amount / 100).toFixed(2)}/${interval || 'month'}`
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-purple-600" />
          Loading subscription...
        </div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
        <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No Active Subscription</h3>
        <p className="text-sm text-gray-500">You don&apos;t have an active Stripe subscription.</p>
      </div>
    )
  }

  const statusColor = STATUS_COLORS[subscription.status] || 'bg-gray-100 text-gray-700'
  const canPause = subscription.status === 'active'
  const canResume = subscription.status === 'paused'

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Subscription Management</h3>
          <button
            onClick={loadSubscription}
            className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Subscription Card */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <h4 className="text-xl font-bold text-gray-900">{subscription.plan_name || 'Subscription'}</h4>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColor}`}>
              {subscription.status}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Amount</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {formatAmount(subscription.amount, subscription.interval)}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Current Period</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">
                {formatDate(subscription.current_period_start)} – {formatDate(subscription.current_period_end)}
              </p>
            </div>
            {subscription.trial_end && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Trial End</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {formatDate(subscription.trial_end)}
                </p>
              </div>
            )}
            {subscription.resume_at && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Resume At</p>
                <p className="text-sm font-semibold text-gray-900 mt-0.5">
                  {formatDate(subscription.resume_at)}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {canPause && (
              <button
                onClick={() => setShowPauseModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg text-sm font-medium hover:bg-yellow-100 transition-colors"
              >
                <Pause className="w-4 h-4" />
                Pause Subscription
              </button>
            )}
            {canResume && (
              <button
                onClick={() => setShowResumeModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
              >
                <Play className="w-4 h-4" />
                Resume Subscription
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pause Modal */}
      {showPauseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Pause Subscription</h3>
            <p className="text-sm text-gray-600 mb-4">
              Pausing your subscription will stop billing. You can resume at any time.
              Your access will be maintained until the current period ends.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPauseModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePause}
                disabled={actionLoading}
                className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? 'Pausing...' : 'Confirm Pause'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Resume Subscription</h3>
            <p className="text-sm text-gray-600 mb-4">
              Resuming will restart your billing immediately. Your subscription
              benefits will be fully restored.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResumeModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResume}
                disabled={actionLoading}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {actionLoading ? 'Resuming...' : 'Confirm Resume'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
