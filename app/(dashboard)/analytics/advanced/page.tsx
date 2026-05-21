'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { advancedAnalyticsAPI } from '@/lib/api/endpoints/analytics'
import type { FunnelData, ABTestData } from '@/lib/api/endpoints/analytics'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import ConversionFunnel from '@/components/analytics/ConversionFunnel'
import ABTestResults from '@/components/analytics/ABTestResults'
import { useTranslation } from '@/lib/i18n'

/**
 * Purpose: Executes AdvancedAnalyticsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
export default function AdvancedAnalyticsPage() {
  const { t } = useTranslation()

  const PERIOD_OPTIONS = [
    { label: t('7 days'), value: '7d' },
    { label: t('30 days'), value: '30d' },
    { label: t('90 days'), value: '90d' },
  ] as const

  const STATUS_OPTIONS = [
    { label: t('All'), value: 'all' },
    { label: t('Running'), value: 'running' },
    { label: t('Completed'), value: 'completed' },
  ] as const
  const [activeTab, setActiveTab] = useState('funnels')
  const [period, setPeriod] = useState('30d')
  const [testStatus, setTestStatus] = useState('all')

  const {
    data: funnels,
    isLoading: funnelsLoading,
  } = useQuery<FunnelData[]>({
    queryKey: ['analytics', 'funnels', period],
    queryFn: () => advancedAnalyticsAPI.getFunnels({ period }),
    staleTime: 60 * 1000,
  })

  const {
    data: abTests,
    isLoading: testsLoading,
  } = useQuery<ABTestData[]>({
    queryKey: ['analytics', 'ab-tests', testStatus],
    queryFn: () =>
      advancedAnalyticsAPI.getABTests(
        testStatus !== 'all' ? { status: testStatus } : undefined
      ),
    staleTime: 60 * 1000,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('Advanced Analytics')}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t('Conversion funnels and A/B test insights')}
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="funnels">{t('Conversion Funnels')}</TabsTrigger>
          <TabsTrigger value="abtests">{t('A/B Tests')}</TabsTrigger>
        </TabsList>

        {/* ── Funnels Tab ── */}
        <TabsContent value="funnels">
          {/* Period selector */}
          <div className="mb-4 flex gap-2">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  period === opt.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {funnelsLoading ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-40 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : funnels && funnels.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {funnels.map((funnel) => (
                <Card key={funnel.id}>
                  <CardContent className="p-6">
                    <ConversionFunnel data={funnel} />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                  {t('No funnels found')}
                </p>
                <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                  {t('Funnels will appear here once conversion tracking is configured.')}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── A/B Tests Tab ── */}
        <TabsContent value="abtests">
          {/* Status filter */}
          <div className="mb-4 flex gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTestStatus(opt.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  testStatus === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {testsLoading ? (
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="h-32 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : abTests && abTests.length > 0 ? (
            <div className="space-y-6">
              {abTests.map((test) => (
                <Card key={test.id}>
                  <CardContent className="p-6">
                    <ABTestResults data={test} />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                  {t('No A/B tests found')}
                </p>
                <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                  {t('A/B tests will appear here once experiments are created.')}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
