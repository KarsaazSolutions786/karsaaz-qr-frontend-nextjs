'use client'

import { useTranslation } from '@/lib/i18n'
import type { BackupJob } from '@/lib/api/endpoints/cloud-storage'
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Database,
  ArrowUpDown,
  Loader2,
  Trash2,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Provider display names
const PROVIDER_NAMES: Record<string, string> = {
  google_drive: 'Google Drive',
  dropbox: 'Dropbox',
  onedrive: 'OneDrive',
  mega: 'MEGA',
}

/**
 * Purpose: Executes formatSize functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function formatSize(bytes?: number): string {
  if (!bytes) return '\u2014'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

/**
 * Purpose: Checks if jobinprogress.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function isJobInProgress(status: string): boolean {
  return status === 'pending' || status === 'processing' || status === 'in_progress'
}

interface CloudBackupHistoryProps {
  backups: BackupJob[]
  isLoading: boolean
  onDelete: (id: string) => void
  isDeleting: boolean
  onRefresh?: () => void
  showStartBackup?: boolean
  onStartBackup?: () => void
}

/**
 * Purpose: Executes CloudBackupHistory functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function CloudBackupHistory({
  backups,
  isLoading,
  onDelete,
  isDeleting,
  onRefresh,
  showStartBackup = false,
  onStartBackup,
}: CloudBackupHistoryProps) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex animate-pulse items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-gray-200" />
            <div className="flex-1">
              <div className="mb-2 h-4 w-24 rounded bg-gray-200" />
              <div className="h-3 w-64 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (backups.length === 0) {
    return (
      <div className="p-12 text-center">
        <Database className="mx-auto mb-3 h-12 w-12 text-gray-400" />
        <p className="font-medium text-gray-600">{t('No backup history yet')}</p>
        <p className="mt-1 text-sm text-gray-500">
          {showStartBackup
            ? t('Click "Start Backup" to create your first backup')
            : t('Connect a cloud storage provider first, then start a backup')}
        </p>
        {showStartBackup && onStartBackup && (
          <Button className="mt-4" onClick={onStartBackup}>
            {t('Start Backup')}
          </Button>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Header with refresh */}
      {onRefresh && (
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-700">
            {backups.length} {t('backups')}
          </h3>
          <button
            onClick={onRefresh}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t('Refresh')}
          </button>
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {backups.map((backup) => {
          const inProgress = isJobInProgress(backup.status)

          return (
            <div
              key={backup.id}
              className="p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Status Icon */}
                  <div className="mt-1">
                    {backup.status === 'completed' && (
                      <div className="rounded-lg bg-green-100 p-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    )}
                    {backup.status === 'failed' && (
                      <div className="rounded-lg bg-red-100 p-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                      </div>
                    )}
                    {backup.status === 'cancelled' && (
                      <div className="rounded-lg bg-amber-100 p-2">
                        <XCircle className="h-5 w-5 text-amber-600" />
                      </div>
                    )}
                    {inProgress && (
                      <div className="rounded-lg bg-blue-100 p-2">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                          backup.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : backup.status === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : backup.status === 'cancelled'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {backup.status.charAt(0).toUpperCase() +
                          backup.status.slice(1).replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {PROVIDER_NAMES[backup.provider] || backup.provider}
                      </span>
                      {backup.format && (
                        <span className="text-xs uppercase text-gray-400">
                          {backup.format}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(backup.created_at).toLocaleString()}
                      </span>
                      {(backup.total_qr_codes != null ||
                        backup.files_count != null) && (
                        <span className="flex items-center gap-1">
                          <Database className="h-3.5 w-3.5" />
                          {backup.total_qr_codes ?? backup.files_count}{' '}
                          {t('QR codes')}
                        </span>
                      )}
                      {(backup.size_bytes != null ||
                        backup.file_size != null) && (
                        <span className="flex items-center gap-1">
                          <ArrowUpDown className="h-3.5 w-3.5" />
                          {formatSize(
                            backup.size_bytes ?? backup.file_size ?? 0
                          )}
                        </span>
                      )}
                      {backup.completed_at && backup.started_at && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {Math.round(
                            (new Date(backup.completed_at).getTime() -
                              new Date(backup.started_at).getTime()) /
                              1000
                          )}
                          s
                        </span>
                      )}
                    </div>
                    {backup.error_message && (
                      <p className="mt-1 text-sm text-red-600">
                        {backup.error_message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="ml-4 flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm(t('Delete this backup record?'))) {
                        onDelete(backup.id)
                      }
                    }}
                    disabled={isDeleting}
                    className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
