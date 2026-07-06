'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'
import { queryKeys } from '@/lib/query/keys'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CheckStatus = 'ok' | 'fail' | 'warning' | 'critical' | 'degraded' | 'unknown'

interface BaseCheck {
  status: CheckStatus
  message?: string
}

interface DatabaseCheck extends BaseCheck {
  driver: string
}

interface CacheCheck extends BaseCheck {
  driver: string
}

interface RedisCheck extends BaseCheck {
  used_memory?: string
  max_memory?: string
  connected_clients?: string
}

interface QueueCheck extends BaseCheck {
  driver: string
  note?: string
  failed_jobs?: number
}

interface DiskCheck extends BaseCheck {
  free_percent?: number
  free_bytes?: number
  total_bytes?: number
}

interface MemoryCheck extends BaseCheck {
  usage_bytes?: number
  peak_bytes?: number
  limit?: string
  usage_percent?: number
}

interface HealthChecks {
  database: DatabaseCheck
  cache: CacheCheck
  redis: RedisCheck
  queue: QueueCheck
  disk: DiskCheck
  memory: MemoryCheck
}

type OverallStatus = 'healthy' | 'degraded' | 'unhealthy'

interface HealthResponse {
  status: OverallStatus
  timestamp: string
  version: string
  checks: HealthChecks
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Purpose: Executes formatBytes functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Purpose: Executes formatTimestamp functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso)
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'medium',
    })
  } catch {
    return iso
  }
}

/**
 * Purpose: * Map any check status to a display category for consistent coloring.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */

function normalizeStatus(s: CheckStatus): 'ok' | 'degraded' | 'down' {
  switch (s) {
    case 'ok':
      return 'ok'
    case 'warning':
    case 'degraded':
    case 'unknown':
      return 'degraded'
    case 'fail':
    case 'critical':
      return 'down'
    default:
      return 'degraded'
  }
}

/**
 * Purpose: Executes statusDotColor functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
function statusDotColor(s: 'ok' | 'degraded' | 'down') {
  switch (s) {
    case 'ok':
      return 'bg-green-400'
    case 'degraded':
      return 'bg-yellow-400'
    case 'down':
      return 'bg-red-400'
  }
}

/**
 * Purpose: Executes statusBadgeClasses functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
function statusBadgeClasses(s: 'ok' | 'degraded' | 'down') {
  switch (s) {
    case 'ok':
      return 'text-green-700 bg-green-50 border-green-200'
    case 'degraded':
      return 'text-yellow-700 bg-yellow-50 border-yellow-200'
    case 'down':
      return 'text-red-700 bg-red-50 border-red-200'
  }
}

/**
 * Purpose: Executes statusLabel functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
function statusLabel(s: CheckStatus): string {
  // These are wrapped with t() at render time
  const map: Record<CheckStatus, string> = {
    ok: 'Operational',
    warning: 'Warning',
    degraded: 'Degraded',
    critical: 'Critical',
    fail: 'Down',
    unknown: 'Unknown',
  }
  return map[s] ?? s
}

/**
 * Purpose: Executes overallBadgeClasses functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
function overallBadgeClasses(s: OverallStatus) {
  switch (s) {
    case 'healthy':
      return 'text-green-800 bg-green-100'
    case 'degraded':
      return 'text-yellow-800 bg-yellow-100'
    case 'unhealthy':
      return 'text-red-800 bg-red-100'
  }
}

/**
 * Purpose: Executes overallDotColor functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
function overallDotColor(s: OverallStatus) {
  switch (s) {
    case 'healthy':
      return 'bg-green-400'
    case 'degraded':
      return 'bg-yellow-400'
    case 'unhealthy':
      return 'bg-red-400'
  }
}

/**
 * Purpose: Executes overallLabel functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
function overallLabel(s: OverallStatus) {
  // These are wrapped with t() at render time
  switch (s) {
    case 'healthy':
      return 'All Systems Operational'
    case 'degraded':
      return 'Some Systems Degraded'
    case 'unhealthy':
      return 'System Unhealthy'
  }
}

// ---------------------------------------------------------------------------
// Service display config
// ---------------------------------------------------------------------------

interface ServiceDisplayConfig {
  key: keyof HealthChecks
  label: string
  icon: string
  renderMetrics: (check: any) => { label: string; value: string }[]
}

const SERVICE_CONFIGS: ServiceDisplayConfig[] = [
  {
    key: 'database',
    label: 'Database',
    icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
    renderMetrics: (check: DatabaseCheck) => [{ label: 'Driver', value: check.driver ?? '-' }],
  },
  {
    key: 'cache',
    label: 'Cache',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    renderMetrics: (check: CacheCheck) => [{ label: 'Driver', value: check.driver ?? '-' }],
  },
  {
    key: 'redis',
    label: 'Redis',
    icon: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
    renderMetrics: (check: RedisCheck) => {
      const metrics: { label: string; value: string }[] = []
      if (check.used_memory) metrics.push({ label: 'Used Memory', value: check.used_memory })
      if (check.max_memory) metrics.push({ label: 'Max Memory', value: check.max_memory })
      if (check.connected_clients)
        metrics.push({ label: 'Clients', value: check.connected_clients })
      return metrics
    },
  },
  {
    key: 'queue',
    label: 'Queue',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    renderMetrics: (check: QueueCheck) => {
      const metrics: { label: string; value: string }[] = [
        { label: 'Driver', value: check.driver ?? '-' },
      ]
      if (check.note) metrics.push({ label: 'Note', value: check.note })
      if (check.failed_jobs !== undefined)
        metrics.push({ label: 'Failed Jobs', value: String(check.failed_jobs) })
      return metrics
    },
  },
  {
    key: 'disk',
    label: 'Disk',
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
    renderMetrics: (check: DiskCheck) => {
      const metrics: { label: string; value: string }[] = []
      if (check.free_percent !== undefined)
        metrics.push({ label: 'Free', value: `${check.free_percent}%` })
      if (check.free_bytes !== undefined)
        metrics.push({ label: 'Free Space', value: formatBytes(check.free_bytes) })
      if (check.total_bytes !== undefined)
        metrics.push({ label: 'Total', value: formatBytes(check.total_bytes) })
      return metrics
    },
  },
  {
    key: 'memory',
    label: 'Memory',
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
    renderMetrics: (check: MemoryCheck) => {
      const metrics: { label: string; value: string }[] = []
      if (check.usage_percent !== undefined)
        metrics.push({ label: 'Usage', value: `${check.usage_percent}%` })
      if (check.usage_bytes !== undefined)
        metrics.push({ label: 'Used', value: formatBytes(check.usage_bytes) })
      if (check.peak_bytes !== undefined)
        metrics.push({ label: 'Peak', value: formatBytes(check.peak_bytes) })
      if (check.limit) metrics.push({ label: 'Limit', value: check.limit })
      return metrics
    },
  },
]

// ---------------------------------------------------------------------------
// Fetch function
// ---------------------------------------------------------------------------

/**
 * Purpose: Executes fetchHealth functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
async function fetchHealth(): Promise<HealthResponse> {
  const { data } = await apiClient.get<HealthResponse>('/health')
  return data
}

// ---------------------------------------------------------------------------
// Run Migrations button + output panel
// ---------------------------------------------------------------------------

/**
 * Purpose: Executes RunMigrationsButton functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: April 2026
 */
function RunMigrationsButton() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [output, setOutput] = useState<string>('')
  const [confirm, setConfirm] = useState(false)

  /**
   * Purpose: Executes run functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: April 2026
   */
  async function run() {
    setConfirm(false)
    setStatus('running')
    setOutput('')
    try {
      const { data } = await apiClient.post<{ success: boolean; output: string }>(
        '/system/run-migrations'
      )
      setOutput(data.output)
      setStatus(data.success ? 'done' : 'error')
    } catch (err: any) {
      setOutput(err?.response?.data?.message ?? err?.message ?? 'Unknown error')
      setStatus('error')
    }
  }

  return (
    <div>
      {!confirm ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirm(true)}
          disabled={status === 'running'}
          className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950"
        >
          {status === 'running' ? (
            <>
              <LottieLoader size={80} />
              {t('Running…')}
            </>
          ) : (
            <>
              {/* database / migrate icon */}
              <svg
                className="mr-1.5 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                />
              </svg>
              {t('Run Migrations')}
            </>
          )}
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
            {t('Run migrate --force?')}
          </span>
          <Button
            size="sm"
            className="h-7 bg-orange-600 hover:bg-orange-700 text-white text-xs px-3"
            onClick={run}
          >
            {t('Yes, Run')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs px-3"
            onClick={() => setConfirm(false)}
          >
            {t('Cancel')}
          </Button>
        </div>
      )}

      {/* Output panel */}
      {output && (
        <div
          className={`mt-3 rounded-md border px-4 py-3 text-xs font-mono whitespace-pre-wrap ${
            status === 'done'
              ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300'
              : 'border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300'
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1 font-sans font-semibold not-mono">
            {status === 'done' ? (
              <span className="text-green-600">✓ {t('Migration complete')}</span>
            ) : (
              <span className="text-red-600">✗ {t('Migration failed')}</span>
            )}
          </div>
          {output}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

/**
 * Purpose: Executes SkeletonCard functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function SkeletonCard() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Purpose: Executes SystemStatusPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function SystemStatusPage() {
  const { t } = useTranslation()
  const {
    data: health,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.systemHealth.status(),
    queryFn: fetchHealth,
    refetchInterval: 30_000,
    retry: 2,
  })

  // ---- Loading state ----
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-8 w-48 animate-pulse rounded-full bg-gray-200" />
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  // ---- Error state ----
  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('System Status')}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t('Monitor system health and performance')}
          </p>
        </div>
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <svg
              className="h-12 w-12 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('Unable to Reach Server')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {(error as Error)?.message || t('Could not connect to the health endpoint.')}
            </p>
            <Button onClick={() => refetch()} className="mt-6" variant="outline">
              {t('Try Again')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!health) return null

  const overall = health.status

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ---- Header ---- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('System Status')}
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {t('Monitor system health and performance')}
          </p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${overallBadgeClasses(overall)}`}
            >
              <span className={`mr-1.5 h-2 w-2 rounded-full ${overallDotColor(overall)}`} />
              {t(overallLabel(overall))}
            </span>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
              {isFetching ? (
                <>
                  <LottieLoader size={80} />
                  {t('Refreshing...')}
                </>
              ) : (
                <>
                  <svg
                    className="mr-1.5 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M20.016 4.372v4.992"
                    />
                  </svg>
                  {t('Refresh')}
                </>
              )}
            </Button>
          </div>
          <RunMigrationsButton />
        </div>
      </div>

      {/* ---- Meta bar ---- */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
        {health.version && (
          <span className="inline-flex items-center gap-1">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            {t('Version')} {health.version}
          </span>
        )}
        {health.timestamp && (
          <span className="inline-flex items-center gap-1">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {t('Last checked:')} {formatTimestamp(health.timestamp)}
          </span>
        )}
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {t('Auto-refreshes every 30s')}
        </span>
      </div>

      {/* ---- Service cards grid ---- */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICE_CONFIGS.map(svc => {
          const check = health.checks[svc.key]
          if (!check) return null

          const norm = normalizeStatus(check.status)
          const metrics = svc.renderMetrics(check)

          return (
            <Card key={svc.key} className="relative overflow-hidden">
              {/* Colored top border */}
              <div
                className={`absolute left-0 right-0 top-0 h-1 ${
                  norm === 'ok'
                    ? 'bg-[radial-gradient(circle,_#E889FF_0%,_#B36AC5_100%)]'
                    : norm === 'degraded'
                      ? 'bg-yellow-400'
                      : 'bg-red-400'
                }`}
              />

              <CardHeader className="pb-3 pt-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        norm === 'ok'
                          ? 'bg-green-50 text-green-600'
                          : norm === 'degraded'
                            ? 'bg-yellow-50 text-yellow-600'
                            : 'bg-red-50 text-red-600'
                      }`}
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={svc.icon} />
                      </svg>
                    </div>
                    <CardTitle className="text-base">{t(svc.label)}</CardTitle>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadgeClasses(norm)}`}
                  >
                    <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${statusDotColor(norm)}`} />
                    {t(statusLabel(check.status))}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                {check.message && (
                  <p className="mb-3 text-xs text-red-600 dark:text-red-400">{check.message}</p>
                )}
                {metrics.length > 0 ? (
                  <dl className="space-y-1.5">
                    {metrics.map(m => (
                      <div key={m.label} className="flex items-center justify-between text-sm">
                        <dt className="text-gray-500 dark:text-gray-400">{t(m.label)}</dt>
                        <dd className="font-medium text-gray-900 dark:text-gray-100">{m.value}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="text-sm text-gray-400">{t('No metrics available')}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
