'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { usePlan } from '@/lib/hooks/queries/usePlans'
import { useUpdatePlan } from '@/lib/hooks/mutations/usePlanMutations'
import { BalloonSelector } from '@/components/ui/balloon-selector'
import { BASE_PLAN_FEATURES } from '@/lib/constants/plan-features'
import { QR_TYPES } from '@/lib/constants/qr-types'
import { PlanCheckpoints, type Checkpoint } from '@/components/features/plans/PlanCheckpoints'
import { CheckoutLinkGenerator } from '@/components/features/plans/CheckoutLinkGenerator'
import {
  QrTypeLimitsEditor,
  type QrTypeLimit,
} from '@/components/features/plans/QrTypeLimitsEditor'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'
import { useAllDesignAssets } from '@/lib/hooks/queries/useDesignAssets'

const FREQUENCY_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'life-time', label: 'Life Time' },
]

const ADS_OPTIONS = [
  { value: 'enabled', label: 'Enabled' },
  { value: 'disabled', label: 'Disabled' },
]

const UNAVAILABLE_TYPES_OPTIONS = [
  { value: 'hidden', label: 'Hide unavailable types' },
  { value: 'show_upgrade_message', label: 'Show upgrade message' },
]

const qrTypeOptions = QR_TYPES.map(t => ({
  value: t.id,
  label: t.name,
}))

const inputClass =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm'

/**
 * Purpose: Executes EditPlanPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function EditPlanPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const planId = Number(id)
  const { data: plan, isLoading } = usePlan(planId)
  const updateMutation = useUpdatePlan()
  const [saved, setSaved] = useState(false)
  const { data: designAssets = [] } = useAllDesignAssets()

  const featureOptions = useMemo(() => {
    const shapeOptions = designAssets
      .filter(a => a.type === 'outline_style' && a.is_active !== false)
      .map(a => ({ value: `shape.${a.slug}`, label: `Shape: ${a.label}` }))

    const stickerOptions = designAssets
      .filter(a => a.type === 'advanced_shape' && a.is_active !== false)
      .map(a => ({ value: `advancedShape.${a.slug}`, label: `Sticker: ${a.label}` }))

    return [
      ...BASE_PLAN_FEATURES.map(f => ({ value: f.value, label: f.name })),
      ...shapeOptions,
      ...stickerOptions,
    ]
  }, [designAssets])

  const [form, setForm] = useState({
    name: '',
    price: 0,
    frequency: 'monthly',
    sortOrder: 0,
    isHidden: false,
    isTrial: false,
    trialDays: 7,
    numberOfDynamicQrcodes: -1,
    numberOfScans: -1,
    numberOfCustomDomains: -1,
    fileSizeLimit: -1,
    storageQuotaMb: 500,
    numberOfUsers: -1,
    numberOfRestaurantMenuItems: -1,
    numberOfProductCatalogueItems: -1,
    numberOfAiGenerations: -1,
    numberOfBulkCreatedQrcodes: -1,
    showAds: 'disabled',
    adsTimeout: 15,
    adsCode: '',
    qrTypes: [] as string[],
    unavailableTypesBehaviour: 'show_upgrade_message',
    features: [] as string[],
    checkpoints: [] as Checkpoint[],
    qrTypeLimits: [] as QrTypeLimit[],
    hasApiAccess: false,
    apiMonthlyRequests: 1000,
    apiRateLimitPerMinute: 60,
  })

  useEffect(() => {
    if (plan) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync form state from async plan query
      setForm({
        name: plan.name ?? '',
        price: plan.price ?? 0,
        frequency: plan.frequency ?? 'monthly',
        sortOrder: plan.sortOrder ?? 0,
        isHidden: plan.isHidden ?? false,
        isTrial: plan.isTrial ?? false,
        trialDays: plan.trialDays ?? 7,
        numberOfDynamicQrcodes: plan.numberOfDynamicQrcodes ?? -1,
        numberOfScans: plan.numberOfScans ?? -1,
        numberOfCustomDomains: plan.numberOfCustomDomains ?? -1,
        fileSizeLimit: plan.fileSizeLimit ?? -1,
        storageQuotaMb: plan.storageQuotaBytes
          ? Math.round(plan.storageQuotaBytes / (1024 * 1024))
          : 500,
        numberOfUsers: plan.numberOfUsers ?? -1,
        numberOfRestaurantMenuItems: plan.numberOfRestaurantMenuItems ?? -1,
        numberOfProductCatalogueItems: plan.numberOfProductCatalogueItems ?? -1,
        numberOfAiGenerations: plan.numberOfAiGenerations ?? -1,
        numberOfBulkCreatedQrcodes: plan.numberOfBulkCreatedQrcodes ?? -1,
        showAds: plan.showAds ? 'enabled' : 'disabled',
        adsTimeout: plan.adsTimeout ?? 15,
        adsCode: plan.adsCode ?? '',
        qrTypes: plan.qrTypes ?? [],
        unavailableTypesBehaviour: plan.unavailableTypesBehaviour ?? 'show_upgrade_message',
        features: plan.features ?? [],
        checkpoints: plan.checkpoints ?? [],
        qrTypeLimits: plan.qrTypeLimits ?? [],
        hasApiAccess: plan.hasApiAccess ?? false,
        apiMonthlyRequests: plan.apiMonthlyRequests ?? 1000,
        apiRateLimitPerMinute: plan.apiRateLimitPerMinute ?? 60,
      })
    }
  }, [plan])

  /**
   * Purpose: Sets .
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  const set = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }))

  /**
   * Purpose: Executes handleSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateMutation.mutateAsync({
        id: planId,
        data: {
          name: form.name,
          price: Number(form.price),
          frequency: form.frequency as 'monthly' | 'yearly' | 'life-time',
          sortOrder: Number(form.sortOrder),
          isHidden: form.isHidden,
          isTrial: form.isTrial,
          trialDays: form.isTrial ? Number(form.trialDays) : undefined,
          numberOfDynamicQrcodes: Number(form.numberOfDynamicQrcodes),
          numberOfScans: Number(form.numberOfScans),
          numberOfCustomDomains: Number(form.numberOfCustomDomains),
          fileSizeLimit: Number(form.fileSizeLimit),
          storageQuotaBytes:
            Number(form.storageQuotaMb) === -1 ? -1 : Number(form.storageQuotaMb) * 1024 * 1024,
          numberOfUsers: Number(form.numberOfUsers),
          numberOfRestaurantMenuItems: Number(form.numberOfRestaurantMenuItems),
          numberOfProductCatalogueItems: Number(form.numberOfProductCatalogueItems),
          numberOfAiGenerations: Number(form.numberOfAiGenerations),
          numberOfBulkCreatedQrcodes: Number(form.numberOfBulkCreatedQrcodes),
          showAds: form.showAds === 'enabled',
          adsTimeout: Number(form.adsTimeout),
          adsCode: form.adsCode,
          qrTypes: form.qrTypes,
          unavailableTypesBehaviour: form.unavailableTypesBehaviour as
            | 'hidden'
            | 'show_upgrade_message',
          features: form.features,
          checkpoints: form.checkpoints,
          qrTypeLimits: form.qrTypeLimits,
          hasApiAccess: form.hasApiAccess,
          apiMonthlyRequests: Number(form.apiMonthlyRequests),
          apiRateLimitPerMinute: Number(form.apiRateLimitPerMinute),
        },
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // Error shown by mutation state and API interceptor
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <LottieLoader size={80} />
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-red-600">{t('Plan not found.')}</p>
        <Link href="/plans" className="mt-2 text-sm text-blue-600 hover:text-blue-800">
          {t('← Back to Plans')}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/plans" className="text-sm text-blue-600 hover:text-blue-800">
          {t('← Back to Plans')}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{t('Edit Plan')}</h1>
      </div>

      {/* Checkout Link Generator */}
      <div className="mb-6">
        <CheckoutLinkGenerator planId={planId} planName={form.name || plan.name} />
      </div>

      {updateMutation.error && (
        <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {t('Failed to update plan. Please try again.')}
        </div>
      )}
      {saved && (
        <div className="mb-6 rounded-md bg-green-50 p-4 text-sm text-green-700">
          {t('Plan saved successfully.')}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Basic Details */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('Basic Details')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Name')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">{t('Frequency')}</label>
              <div className="mt-1">
                <BalloonSelector
                  options={FREQUENCY_OPTIONS}
                  value={form.frequency}
                  onChange={v => set('frequency', v)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('Price')}{' '}
                  <span className="text-xs text-gray-400">({t('Type 0 for free')})</span>
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('Sort Order')}</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={e => set('sortOrder', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex items-start gap-6">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isHidden}
                  onChange={e => set('isHidden', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                {t('Hidden')}
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isTrial}
                  onChange={e => set('isTrial', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600"
                />
                {t('Is Trial')}
              </label>
            </div>

            {form.isTrial && (
              <div className="sm:max-w-xs">
                <label className="block text-sm font-medium text-gray-700">{t('Trial Days')}</label>
                <input
                  type="number"
                  min={1}
                  value={form.trialDays}
                  onChange={e => set('trialDays', e.target.value)}
                  className={inputClass}
                />
              </div>
            )}
          </div>
        </section>

        {/* 2. Plan Configuration */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('Plan Configuration')}</h2>
          <p className="mb-4 text-sm text-gray-500">{t('Use -1 for unlimited.')}</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Number of Dynamic QR Codes')}
              </label>
              <input
                type="number"
                min={-1}
                value={form.numberOfDynamicQrcodes}
                onChange={e => set('numberOfDynamicQrcodes', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Number of Scans')}
              </label>
              <input
                type="number"
                min={-1}
                value={form.numberOfScans}
                onChange={e => set('numberOfScans', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Number of Custom Domains')}
              </label>
              <input
                type="number"
                min={-1}
                step={1}
                value={form.numberOfCustomDomains}
                onChange={e => set('numberOfCustomDomains', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('File Size Limit (MB)')}
              </label>
              <input
                type="number"
                min={-1}
                step={1}
                value={form.fileSizeLimit}
                onChange={e => set('fileSizeLimit', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Storage Quota (MB)')}
              </label>
              <input
                type="number"
                min={-1}
                step={50}
                value={form.storageQuotaMb}
                onChange={e => set('storageQuotaMb', e.target.value)}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('-1 for unlimited. Total storage per user.')}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Number of Users')}
              </label>
              <input
                type="number"
                min={-1}
                step={1}
                value={form.numberOfUsers}
                onChange={e => set('numberOfUsers', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Number of Menu Items (Restaurant Menu)')}
              </label>
              <input
                type="number"
                min={-1}
                step={1}
                value={form.numberOfRestaurantMenuItems}
                onChange={e => set('numberOfRestaurantMenuItems', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Number of Products (Product Catalogue)')}
              </label>
              <input
                type="number"
                min={-1}
                step={1}
                value={form.numberOfProductCatalogueItems}
                onChange={e => set('numberOfProductCatalogueItems', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Number of AI Generations')}
              </label>
              <input
                type="number"
                min={-1}
                value={form.numberOfAiGenerations}
                onChange={e => set('numberOfAiGenerations', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Number of Bulk Created QR Codes')}
              </label>
              <input
                type="number"
                min={-1}
                value={form.numberOfBulkCreatedQrcodes}
                onChange={e => set('numberOfBulkCreatedQrcodes', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* 3. Ads Settings */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('Ads Settings')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('Show Ads. Default (Disabled)')}
              </label>
              <p className="mb-2 text-xs text-gray-500">
                {t('Show ads before redirecting to the QR code.')}
              </p>
              <BalloonSelector
                options={ADS_OPTIONS}
                value={form.showAds}
                onChange={v => set('showAds', v)}
              />
            </div>

            {form.showAds === 'enabled' && (
              <>
                <div className="sm:max-w-xs">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('Ads Timeout. Default (15)')}
                  </label>
                  <p className="mb-1 text-xs text-gray-500">
                    {t('Timeout before showing the final QR code in seconds.')}
                  </p>
                  <input
                    type="number"
                    min={0}
                    value={form.adsTimeout}
                    onChange={e => set('adsTimeout', e.target.value)}
                    className={inputClass}
                    placeholder="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('Ads Code. (HTML)')}
                  </label>
                  <p className="mb-1 text-xs text-gray-500">
                    {t('Add the ads code in HTML below.')}
                  </p>
                  <textarea
                    rows={6}
                    value={form.adsCode}
                    onChange={e => set('adsCode', e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs shadow-sm focus:border-blue-500 focus:outline-none"
                    placeholder="<script>...</script>"
                  />
                </div>
              </>
            )}
          </div>
        </section>

        {/* 4. Available QR Code Types */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('Available Types')}</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('QR Code Types')}
              </label>
              <BalloonSelector
                options={qrTypeOptions}
                value={form.qrTypes}
                onChange={v => set('qrTypes', v)}
                multiple
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Unavailable types behaviour. (Default is showing upgrade message)')}
              </label>
              <BalloonSelector
                options={UNAVAILABLE_TYPES_OPTIONS}
                value={form.unavailableTypesBehaviour}
                onChange={v => set('unavailableTypesBehaviour', v)}
              />
            </div>
          </div>
        </section>

        {/* 5. Dynamic Type Limits */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('QR Type Limits')}</h2>
          <QrTypeLimitsEditor
            limits={form.qrTypeLimits}
            onChange={qrTypeLimits => set('qrTypeLimits', qrTypeLimits)}
          />
        </section>

        {/* 6. Other Features */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('Other Features')}</h2>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('Features')}</label>
          <BalloonSelector
            options={featureOptions}
            value={form.features}
            onChange={v => set('features', v)}
            multiple
          />
        </section>

        {/* 7. Plan Checkpoints */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('Plan Checkpoints')}</h2>
          <p className="mb-4 text-sm text-gray-500">
            {t('Displayed on the pricing page as plan milestones.')}
          </p>
          <PlanCheckpoints
            checkpoints={form.checkpoints}
            onChange={checkpoints => set('checkpoints', checkpoints)}
          />
        </section>

        {/* 8. API Access Settings */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-gray-900">{t('API Access')}</h2>
          <p className="mb-4 text-sm text-gray-500">
            {t(
              'Users on this plan can generate personal API keys to access QR features programmatically. Use -1 for unlimited monthly requests.'
            )}
          </p>
          <div className="space-y-4">
            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={form.hasApiAccess}
                onChange={e => set('hasApiAccess', e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              {t('Enable API Access for this plan')}
            </label>

            {form.hasApiAccess && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('Monthly API Requests')}
                  </label>
                  <input
                    type="number"
                    min={-1}
                    step={100}
                    value={form.apiMonthlyRequests}
                    onChange={e => set('apiMonthlyRequests', e.target.value)}
                    className={inputClass}
                  />
                  <p className="mt-1 text-xs text-gray-500">{t('-1 for unlimited.')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('Rate Limit (req / minute)')}
                  </label>
                  <input
                    type="number"
                    min={1}
                    step={10}
                    value={form.apiRateLimitPerMinute}
                    onChange={e => set('apiRateLimitPerMinute', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/plans"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('Cancel')}
          </Link>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updateMutation.isPending ? t('Saving…') : t('Save Plan')}
          </button>
        </div>
      </form>
    </div>
  )
}
