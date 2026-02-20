'use client'

import { useState, useCallback } from 'react'
import {
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Database,
  ArrowUpDown,
  Trash2,
  RefreshCw,
  ExternalLink,
  Loader2,
  HardDrive,
  Cloud,
  AlertCircle,
} from 'lucide-react'
import { useCloudConnections, useBackupJobs, useBackupJob, useCloudStorageMutations, useOAuthPopup } from '@/lib/hooks/queries/useCloudStorage'
import type { CloudProvider, CloudConnection, BackupJob, BackupJobStatusLegacy } from '@/lib/api/endpoints/cloud-storage'

// ─── Helper Functions ───────────────────────────────────────────────────

/**
 * Get normalized connection status from backend fields
 * Per CLOUD_STORAGE_DOCUMENTATION.md Section 9
 */
function getConnectionStatus(connection: CloudConnection): 'connected' | 'expired' | 'inactive' {
  // Support legacy status field
  if (connection.status) {
    return connection.status === 'error' ? 'inactive' : connection.status
  }
  // Use backend fields
  if (!connection.is_active) return 'inactive'
  if (connection.is_token_expired) return 'expired'
  return 'connected'
}

/**
 * Get connection email (handles both field names)
 */
function getConnectionEmail(connection: CloudConnection): string | undefined {
  return connection.account_email || connection.email
}

/**
 * Check if backup job is in progress
 */
function isJobInProgress(status: BackupJobStatusLegacy): boolean {
  return status === 'pending' || status === 'processing' || status === 'in_progress'
}

// ─── Provider Metadata ──────────────────────────────────────────────────

interface ProviderInfo {
  id: CloudProvider
  name: string
  description: string
  icon: React.ReactNode
  isOAuth: boolean
}

const PROVIDERS: ProviderInfo[] = [
  {
    id: 'google_drive',
    name: 'Google Drive',
    description: 'Connect your Google Drive to back up QR codes and data.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066DA"/>
        <path d="M43.65 25l-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 001.2 4.5h27.5z" fill="#00AC47"/>
        <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.85z" fill="#EA4335"/>
        <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.45-4.5 1.2z" fill="#00832D"/>
        <path d="M59.85 53H27.5l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.3c1.6 0 3.15-.45 4.5-1.2z" fill="#2684FC"/>
        <path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.2 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#FFBA00"/>
      </svg>
    ),
    isOAuth: true,
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    description: 'Connect your Dropbox account for cloud backups.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 43 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0L0 8.2l8.6 6.9 12.5-8.2zM0 22l12.5 8.2 8.6-6.9L8.6 15zM21.1 23.3l8.6 6.9L42.2 22l-8.6-6.9zM42.2 8.2L29.7 0l-8.6 6.9 12.5 8.2zM21.2 25.1l-8.6 6.9-3.9-2.6v2.9l12.5 7.5 12.5-7.5v-2.9l-3.9 2.6z" fill="#0061FF"/>
      </svg>
    ),
    isOAuth: true,
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    description: 'Connect your Microsoft OneDrive for backups.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.146 4.884a5.135 5.135 0 014.673-.657 6.27 6.27 0 012.418 1.43A7.503 7.503 0 0124 12.75a7.502 7.502 0 01-4.5 6.875H8.25a8.248 8.248 0 01-5.915-2.487A8.248 8.248 0 01.5 12a8.248 8.248 0 014.846-7.498 5.14 5.14 0 014.8.382z" fill="#0364B8"/>
      </svg>
    ),
    isOAuth: true,
  },
  {
    id: 'mega',
    name: 'MEGA',
    description: 'Connect your MEGA account using email and password.',
    icon: (
      <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-xs">M</span>
      </div>
    ),
    isOAuth: false,
  },
]

// ─── Backup Modal ────────────────────────────────────────────────────────

/**
 * Backup Modal per CLOUD_STORAGE_DOCUMENTATION.md Section 10
 * Options:
 * - include_designs: QR code design data (default: true)
 * - include_analytics: Scan statistics (default: true)
 * - include_images: SVG + PNG images (default: false, increases backup size)
 */
function BackupModal({
  connections,
  onClose,
  onStart,
  isStarting,
  qrCodeCount,
}: {
  connections: CloudConnection[]
  onClose: () => void
  onStart: (config: {
    connectionId: string
    format: string
    includeDesigns: boolean
    includeAnalytics: boolean
    includeImages: boolean
  }) => void
  isStarting: boolean
  qrCodeCount?: number // If provided, shows "Backing up N selected QR codes"
}) {
  // Filter to only active, non-expired connections
  const activeConnections = connections.filter(c => {
    const status = getConnectionStatus(c)
    return status === 'connected'
  })

  const [selectedConnection, setSelectedConnection] = useState(activeConnections[0]?.id || '')
  const [format, setFormat] = useState<'json' | 'zip'>('json') // Per docs: default json
  const [includeDesigns, setIncludeDesigns] = useState(true)
  const [includeAnalytics, setIncludeAnalytics] = useState(true)
  const [includeImages, setIncludeImages] = useState(false) // Per docs: default false

  if (activeConnections.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
          <div className="flex items-start gap-3 text-amber-700 bg-amber-50 p-4 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">No active cloud connections</p>
              <p className="text-sm mt-1">Please connect a cloud provider first.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Start Backup</h3>

        {/* Info about what's being backed up */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          {qrCodeCount
            ? `Backing up ${qrCodeCount} selected QR code${qrCodeCount > 1 ? 's' : ''}`
            : 'Backing up all QR codes'}
        </div>

        {/* Connection selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cloud Provider</label>
          <select
            value={selectedConnection}
            onChange={(e) => setSelectedConnection(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {activeConnections.map((c) => (
              <option key={c.id} value={c.id}>
                {PROVIDERS.find(p => p.id === c.provider)?.name || c.provider} — {getConnectionEmail(c) || c.name || 'Connected'}
              </option>
            ))}
          </select>
        </div>

        {/* Format */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'json' | 'zip')}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="json">JSON (data only)</option>
            <option value="zip">ZIP Archive (bundled)</option>
          </select>
        </div>

        {/* Options */}
        <div className="mb-6 space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeDesigns}
              onChange={(e) => setIncludeDesigns(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include QR code designs</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeAnalytics}
              onChange={(e) => setIncludeAnalytics(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include analytics data</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeImages}
              onChange={(e) => setIncludeImages(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm text-gray-700">Include QR code images (SVG + PNG)</span>
              <p className="text-xs text-gray-500">Increases backup size significantly</p>
            </div>
          </label>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isStarting}
          >
            Cancel
          </button>
          <button
            onClick={() => onStart({
              connectionId: selectedConnection,
              format,
              includeDesigns,
              includeAnalytics,
              includeImages,
            })}
            disabled={isStarting || !selectedConnection}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting && <Loader2 className="w-4 h-4 animate-spin" />}
            Start Backup
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MEGA Connect Modal ──────────────────────────────────────────────────

function MegaConnectModal({
  onClose,
  onConnect,
  isConnecting,
}: {
  onClose: () => void
  onConnect: (email: string, password: string) => void
  isConnecting: boolean
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect MEGA Account</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your MEGA password"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isConnecting}
          >
            Cancel
          </button>
          <button
            onClick={() => onConnect(email, password)}
            disabled={isConnecting || !email || !password}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting && <Loader2 className="w-4 h-4 animate-spin" />}
            Connect
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Backup Progress Component ───────────────────────────────────────────

/**
 * Real-time backup progress tracker per CLOUD_STORAGE_DOCUMENTATION.md Section 11
 * - Polls every 2s while pending/processing
 * - Shows progress bar with percentage
 * - Displays "{processed}/{total} QR codes"
 * - Shows file size on completion
 */
function BackupProgress({
  job,
  onCancel,
  isCancelling,
}: {
  job: BackupJob
  onCancel: () => void
  isCancelling: boolean
}) {
  // Get progress percentage from various backend field names
  const progressPercent = job.progress ?? job.progress_percentage ?? 0
  const isInProgress = isJobInProgress(job.status)
  
  // Format file size
  const formatSize = (bytes?: number) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isInProgress && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
          {job.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
          {job.status === 'failed' && <XCircle className="w-5 h-5 text-red-600" />}
          {job.status === 'cancelled' && <XCircle className="w-5 h-5 text-amber-600" />}
          <span className="font-medium text-gray-900">
            {job.status === 'pending' && 'Preparing backup...'}
            {job.status === 'processing' && 'Backing up...'}
            {job.status === 'in_progress' && 'Backing up...'}
            {job.status === 'completed' && 'Backup completed'}
            {job.status === 'failed' && 'Backup failed'}
            {job.status === 'cancelled' && 'Backup cancelled'}
          </span>
        </div>
        {isInProgress && (
          <button
            onClick={onCancel}
            disabled={isCancelling}
            className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel'}
          </button>
        )}
      </div>

      {/* Progress bar for in-progress jobs */}
      {isInProgress && (
        <>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {progressPercent.toFixed(0)}%
            {job.processed_qr_codes != null && job.total_qr_codes != null && (
              <span className="ml-2">
                ({job.processed_qr_codes}/{job.total_qr_codes} QR codes)
              </span>
            )}
          </p>
        </>
      )}

      {/* Completed info */}
      {job.status === 'completed' && (
        <p className="text-sm text-gray-600">
          File size: {formatSize(job.file_size || job.size_bytes)}
        </p>
      )}

      {/* Error message */}
      {job.status === 'failed' && job.error_message && (
        <p className="text-sm text-red-600 mt-2">{job.error_message}</p>
      )}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────

export default function CloudStoragePage() {
  const [activeTab, setActiveTab] = useState<'connections' | 'history'>('connections')
  const [showBackupModal, setShowBackupModal] = useState(false)
  const [showMegaModal, setShowMegaModal] = useState(false)
  const [pollingJobId, setPollingJobId] = useState<string | null>(null)

  // Real data from API
  const { data: connections, isLoading: connectionsLoading, refetch: refetchConnections } = useCloudConnections()
  const { data: backupJobs, isLoading: backupsLoading } = useBackupJobs()
  const { data: pollingJob } = useBackupJob(pollingJobId)

  // OAuth popup hook for proper message handling
  const { openPopup: openOAuthPopup, isProcessing: isOAuthProcessing } = useOAuthPopup(() => {
    refetchConnections()
  })

  const {
    deleteConnection,
    testConnection,
    connectMega,
    createBackup,
    cancelBackupJob,
    deleteBackupJob,
    refreshToken,
  } = useCloudStorageMutations()

  const connectedProviders = connections || []
  const backups = backupJobs || []

  // Get provider info
  const getProviderInfo = (provider: CloudProvider) =>
    PROVIDERS.find(p => p.id === provider)

  // Handle connect button click (use new OAuth popup hook)
  const handleConnect = useCallback(async (provider: ProviderInfo) => {
    if (provider.isOAuth) {
      try {
        await openOAuthPopup(provider.id as Exclude<CloudProvider, 'mega'>)
      } catch (error) {
        console.error('OAuth popup error:', error)
        // Show error to user
      }
    } else {
      // MEGA — show credentials modal
      setShowMegaModal(true)
    }
  }, [openOAuthPopup])

  // Handle MEGA connect
  const handleMegaConnect = useCallback((email: string, password: string) => {
    connectMega.mutate({ email, password }, {
      onSuccess: () => setShowMegaModal(false),
    })
  }, [connectMega])

  // Handle start backup (updated for new modal props)
  const handleStartBackup = useCallback((config: {
    connectionId: string
    format: string
    includeDesigns: boolean
    includeAnalytics: boolean
    includeImages: boolean
  }) => {
    createBackup.mutate({
      connection_id: config.connectionId,
      format: config.format as 'json' | 'zip',
      include_designs: config.includeDesigns,
      include_analytics: config.includeAnalytics,
      include_images: config.includeImages,
    }, {
      onSuccess: (job) => {
        setShowBackupModal(false)
        setPollingJobId(job.id)
      },
    })
  }, [createBackup])

  // Format file size
  const formatSize = (bytes?: number) => {
    if (!bytes) return '—'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }

  // Clear polling job when it completes
  if (pollingJob && !isJobInProgress(pollingJob.status)) {
    // Job finished, stop polling after a short delay
    setTimeout(() => setPollingJobId(null), 3000)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Cloud className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cloud Storage</h1>
              <p className="mt-1 text-sm text-gray-600">
                {activeTab === 'connections' ? 'Connect cloud storage providers for backups' : 'View backup history and manage backups'}
              </p>
            </div>
          </div>
        </div>
        {activeTab === 'history' && connectedProviders.length > 0 && (
          <button
            onClick={() => setShowBackupModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            <Upload className="w-4 h-4" />
            Start Backup Now
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('connections')}
            className={`pb-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'connections'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Connections
            {connectedProviders.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {connectedProviders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Backup History
            {backups.length > 0 && (
              <span className="ml-2 bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {backups.length}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* ── Connections Tab ── */}
      {activeTab === 'connections' && (
        <div className="mt-8 space-y-4">
          {/* Active backup progress banner */}
          {pollingJob && isJobInProgress(pollingJob.status) && (
            <BackupProgress
              job={pollingJob}
              onCancel={() => cancelBackupJob.mutate(pollingJob.id)}
              isCancelling={cancelBackupJob.isPending}
            />
          )}

          {connectionsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-lg border border-gray-200 p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-64" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            PROVIDERS.map((provider) => {
              const connection = connectedProviders.find(c => c.provider === provider.id)
              // Use helper function to get normalized status
              const connectionStatus = connection ? getConnectionStatus(connection) : null
              const isConnected = connectionStatus === 'connected'
              const isExpired = connectionStatus === 'expired'
              const isInactive = connectionStatus === 'inactive'
              const email = connection ? getConnectionEmail(connection) : undefined

              return (
                <div
                  key={provider.id}
                  className={`overflow-hidden rounded-lg border bg-white shadow-sm ${
                    isConnected ? 'border-green-300 ring-1 ring-green-200' :
                    isExpired ? 'border-yellow-300 ring-1 ring-yellow-200' :
                    isInactive ? 'border-red-300 ring-1 ring-red-200' :
                    'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between p-5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">{provider.icon}</div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{provider.name}</h3>
                        <p className="text-sm text-gray-500">{provider.description}</p>
                        {connection && (
                          <p className="text-xs text-gray-400 mt-1">
                            {email && `${email} · `}
                            {connection.connected_at && `Connected ${new Date(connection.connected_at).toLocaleDateString()}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {isConnected && (
                        <>
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            <CheckCircle className="w-3 h-3" />
                            Connected
                          </span>
                          <button
                            onClick={() => testConnection.mutate(connection!.id)}
                            disabled={testConnection.isPending}
                            className="text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-50"
                            title="Test connection"
                          >
                            {testConnection.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RefreshCw className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Disconnect ${provider.name}?`)) {
                                deleteConnection.mutate(connection!.id)
                              }
                            }}
                            disabled={deleteConnection.isPending}
                            className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {isExpired && (
                        <>
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                            <Clock className="w-3 h-3" />
                            Token Expired
                          </span>
                          {provider.isOAuth && (
                            <button
                              onClick={() => refreshToken.mutate(provider.id as Exclude<CloudProvider, 'mega'>)}
                              disabled={refreshToken.isPending}
                              className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Refresh
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Disconnect ${provider.name}?`)) {
                                deleteConnection.mutate(connection!.id)
                              }
                            }}
                            className="text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {isInactive && (
                        <>
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                          <button
                            onClick={() => {
                              if (confirm(`Remove ${provider.name} connection?`)) {
                                deleteConnection.mutate(connection!.id)
                              }
                            }}
                            className="text-sm font-medium text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {!connection && (
                        <button
                          onClick={() => handleConnect(provider)}
                          disabled={isOAuthProcessing || connectMega.isPending}
                          className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          {(isOAuthProcessing || connectMega.isPending) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ExternalLink className="w-4 h-4" />
                          )}
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}

          {/* No providers connected message */}
          {!connectionsLoading && connectedProviders.length === 0 && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <HardDrive className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    No cloud storage connected
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Connect a cloud storage provider above to start backing up your QR codes and data.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Backup History Tab ── */}
      {activeTab === 'history' && (
        <div className="mt-8">
          {/* Active polling job banner */}
          {pollingJob && isJobInProgress(pollingJob.status) && (
            <BackupProgress
              job={pollingJob}
              onCancel={() => cancelBackupJob.mutate(pollingJob.id)}
              isCancelling={cancelBackupJob.isPending}
            />
          )}

          {/* Backup List */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {backupsLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-64" />
                    </div>
                  </div>
                ))}
              </div>
            ) : backups.length === 0 ? (
              <div className="p-12 text-center">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No backup history yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  {connectedProviders.length > 0
                    ? 'Click "Start Backup Now" to create your first backup'
                    : 'Connect a cloud storage provider first, then start a backup'
                  }
                </p>
                {connectedProviders.length > 0 && (
                  <button
                    onClick={() => setShowBackupModal(true)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    Start Backup Now
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {backups.map((backup) => {
                  const providerInfo = getProviderInfo(backup.provider)
                  const backupInProgress = isJobInProgress(backup.status)
                  
                  return (
                    <div key={backup.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          {/* Status Icon */}
                          <div className="mt-1">
                            {backup.status === 'completed' && (
                              <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              </div>
                            )}
                            {backup.status === 'failed' && (
                              <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="w-5 h-5 text-red-600" />
                              </div>
                            )}
                            {backup.status === 'cancelled' && (
                              <div className="p-2 bg-amber-100 rounded-lg">
                                <XCircle className="w-5 h-5 text-amber-600" />
                              </div>
                            )}
                            {backupInProgress && (
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                              </div>
                            )}
                          </div>

                          {/* Backup Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  backup.status === 'completed'
                                    ? 'bg-green-100 text-green-700'
                                    : backup.status === 'failed'
                                    ? 'bg-red-100 text-red-700'
                                    : backup.status === 'cancelled'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-blue-100 text-blue-700'
                                }`}
                              >
                                {backup.status === 'completed' && 'Completed'}
                                {backup.status === 'failed' && 'Failed'}
                                {backup.status === 'cancelled' && 'Cancelled'}
                                {backup.status === 'pending' && 'Pending'}
                                {backup.status === 'processing' && 'Processing'}
                                {backup.status === 'in_progress' && 'In Progress'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {providerInfo?.name || backup.provider}
                              </span>
                              {backup.format && (
                                <span className="text-xs text-gray-400 uppercase">{backup.format}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(backup.created_at).toLocaleString()}
                              </span>
                              {(backup.total_qr_codes != null || backup.files_count != null) && (
                                <span className="flex items-center gap-1">
                                  <Database className="w-3.5 h-3.5" />
                                  {backup.total_qr_codes ?? backup.files_count} QR codes
                                </span>
                              )}
                              {(backup.size_bytes != null || backup.file_size != null) && (
                                <span className="flex items-center gap-1">
                                  <ArrowUpDown className="w-3.5 h-3.5" />
                                  {formatSize(backup.size_bytes ?? backup.file_size ?? 0)}
                                </span>
                              )}
                              {backup.completed_at && backup.started_at && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {Math.round((new Date(backup.completed_at).getTime() - new Date(backup.started_at).getTime()) / 1000)}s
                                </span>
                              )}
                            </div>
                            {backup.error_message && (
                              <p className="text-sm text-red-600 mt-1">{backup.error_message}</p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => {
                              if (confirm('Delete this backup record?')) {
                                deleteBackupJob.mutate(backup.id)
                              }
                            }}
                            disabled={deleteBackupJob.isPending}
                            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {showBackupModal && connectedProviders.length > 0 && (
        <BackupModal
          connections={connectedProviders}
          onClose={() => setShowBackupModal(false)}
          onStart={handleStartBackup}
          isStarting={createBackup.isPending}
        />
      )}

      {showMegaModal && (
        <MegaConnectModal
          onClose={() => setShowMegaModal(false)}
          onConnect={handleMegaConnect}
          isConnecting={connectMega.isPending}
        />
      )}
    </div>
  )
}
