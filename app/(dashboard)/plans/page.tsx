'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePlans } from '@/lib/hooks/queries/usePlans'
import { useOrgPlans } from '@/lib/hooks/queries/useOrgPlans'
import { useDeletePlan, useDuplicatePlan } from '@/lib/hooks/mutations/usePlanMutations'
import { orgPlanAPI } from '@/lib/api/endpoints/organization'
import type { SubscriptionPlan } from '@/types/entities/plan'
import type { OrgPlan } from '@/lib/api/endpoints/organization'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'

/**
 * Purpose: Executes PlansPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function PlansPage() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = usePlans({ page, search: search || undefined })
  const { data: orgPlansData, isLoading: orgPlansLoading, refetch: refetchOrgPlans } = useOrgPlans()
  const deleteMutation = useDeletePlan()
  const duplicateMutation = useDuplicatePlan()

  /**
   * Purpose: Executes handleDelete functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDelete = async (id: number, name: string) => {
    if (confirm(t('Are you sure you want to delete "{{name}}"?').replace('{{name}}', name))) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch {
        // Error toast is shown by the API interceptor
      }
    }
  }

  const handleDeleteOrgPlan = async (plan: OrgPlan) => {
    if (confirm(`Are you sure you want to delete organization plan "${plan.name}"?`)) {
      try {
        await orgPlanAPI.delete(plan.id)
        refetchOrgPlans()
      } catch {
        // Error toast is shown by the API interceptor
      }
    }
  }

  /**
   * Purpose: Executes handleDuplicate functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDuplicate = async (id: number) => {
    try {
      await duplicateMutation.mutateAsync(id)
    } catch {
      // Error toast is shown by the API interceptor
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Subscription Plans')}</h1>
          <p className="mt-2 text-sm text-gray-600">{t('Manage subscription plans and pricing')}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/plans/new"
            className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
          >
            {t('Create Plan')}
          </Link>
        </div>
      </div>

      {/* Warning banner matching original */}
      <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-start gap-3">
          <span className="text-yellow-600 text-lg">⚠️</span>
          <p className="text-sm text-yellow-800">
            {t(
              'If a trial or free plan exists, new users will be onboarded onto it automatically. Make sure that the trial/free plan has the right configuration before publishing.'
            )}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-6">
          <input
            type="search"
            placeholder={t('Search plans...')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:max-w-md"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <LottieLoader size={80} />
            <p className="mt-2 text-sm text-gray-600">{t('Loading plans...')}</p>
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <div className="mb-4 mt-8 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase">
                {t('INDIVIDUAL PLANS')}
              </h2>
            </div>
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      {t('Name')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('Price')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('Frequency')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('Allowed QRs')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('Scans')}
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t('Trial')}
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4">
                      <span className="sr-only">{t('Actions')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {data.data.map((plan: SubscriptionPlan) => (
                    <tr key={plan.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3">
                        <div className="font-medium text-gray-900">{plan.name}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        ${plan.price}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className="inline-flex rounded-full bg-purple-100 px-2 text-xs font-semibold leading-5 text-purple-800">
                          {plan.frequency}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {plan.numberOfDynamicQrcodes === -1
                          ? t('Unlimited')
                          : plan.numberOfDynamicQrcodes}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {plan.numberOfScans === -1 ? t('Unlimited') : plan.numberOfScans}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            plan.isTrial
                              ? 'bg-primary-100 text-primary-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {plan.isTrial ? t('YES') : t('NO')}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <Link
                          href={`/plans/${plan.id}`}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          {t('Edit')}
                        </Link>
                        <button
                          onClick={() => handleDuplicate(plan.id)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                          disabled={duplicateMutation.isPending}
                        >
                          {t('Duplicate')}
                        </button>
                        <button
                          onClick={() => handleDelete(plan.id, plan.name)}
                          className="text-red-600 hover:text-red-900"
                          disabled={deleteMutation.isPending}
                        >
                          {t('Delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.pagination && data.pagination.lastPage > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t('Previous')}
                </button>
                <span className="text-sm text-gray-600">
                  {t('Page')} {page} {t('of')} {data.pagination.lastPage}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= data.pagination.lastPage}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t('Next')}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('No plans')}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('Get started by creating a new subscription plan.')}
            </p>
            <div className="mt-6">
              <Link
                href="/plans/new"
                className="inline-flex items-center rounded-md bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-105 transition-all"
              >
                {t('Create Plan')}
              </Link>
            </div>
          </div>
        )}

        {/* ORGANISATION PLANS SECTION */}
        <div className="mt-16 mb-6 flex items-center justify-between border-t pt-8">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight uppercase">
            {t('ORGANISATION PLANS')}
          </h2>
          <Link
            href="/organization/plans"
            className="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-900"
          >
            {t('Manage Org Plans')} &rarr;
          </Link>
        </div>

        {orgPlansLoading ? (
          <div className="text-center py-12">
            <LottieLoader size={80} />
            <p className="mt-2 text-sm text-gray-600">{t('Loading org plans...')}</p>
          </div>
        ) : orgPlansData &&
          orgPlansData.data &&
          orgPlansData.data.data &&
          orgPlansData.data.data.length > 0 ? (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                    {t('Name')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('Price')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('API Calls/mo')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('QR Creates/mo')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('Rate Limit')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('Default Plan')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('Max Seats')}
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    {t('Status')}
                  </th>
                  <th className="relative py-3.5 pl-3 pr-4">
                    <span className="sr-only">{t('Actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orgPlansData.data.data.map((plan: OrgPlan) => (
                  <tr key={plan.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3">
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {plan.name}
                        {plan.is_popular && (
                          <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                            Popular
                          </span>
                        )}
                        {plan.is_custom && (
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      ${plan.price}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {plan.monthly_api_calls === -1 ? t('Unlimited') : plan.monthly_api_calls}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {plan.monthly_qr_creates === -1 ? t('Unlimited') : plan.monthly_qr_creates}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {plan.rate_limit_per_minute}/min
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {plan.default_subscription_plan_id
                        ? data?.data?.find(
                            (sp: SubscriptionPlan) => sp.id === plan.default_subscription_plan_id
                          )?.name || `ID: ${plan.default_subscription_plan_id}`
                        : t('None')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {plan.max_seats === -1 ? t('Unlimited') : plan.max_seats}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          plan.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {plan.is_active ? t('Active') : t('Inactive')}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                      <Link
                        href={`/organization/plans`}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        {t('Edit')}
                      </Link>
                      <button
                        onClick={() => handleDeleteOrgPlan(plan)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t('Delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 rounded-lg border border-dashed bg-white">
            <h3 className="mt-2 text-sm font-medium text-gray-900">{t('No organization plans')}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {t('Get started by creating a new organization plan.')}
            </p>
            <div className="mt-6">
              <Link
                href="/organization/plans"
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                {t('Manage Org Plans')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
