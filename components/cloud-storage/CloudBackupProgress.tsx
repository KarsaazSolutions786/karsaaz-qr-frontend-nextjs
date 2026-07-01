'use client'

import { useTranslation } from '@/lib/i18n'
import type { BackupJob } from '@/lib/api/endpoints/cloud-storage'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

interface CloudBackupProgressProps {
  job: BackupJob
  onCancel?: () => void
  isCancelling?: boolean
  /** Auto-dismiss callback after completion delay */
  onDismiss?: () => void
}

/**
 * Purpose: Checks if jobinprogress.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function isJobInProgress(status: string): boolean {
  return status === 'pending' || status === 'processing' || status === 'in_progress'
}

function isJobStale(job: BackupJob): boolean {
  if (job.is_stale) return true
  if (!isJobInProgress(job.status)) return false
  const ref = job.started_at || job.created_at
  if (!ref) return false
  const ageMin = (Date.now() - new Date(ref).getTime()) / 60000
  return ageMin >= 30 && (job.processed_qr_codes ?? 0) === 0
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
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

/**
 * Purpose: Executes CloudBackupProgress functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function CloudBackupProgress({
  job,
  onCancel,
  isCancelling = false,
  onDismiss,
}: CloudBackupProgressProps) {
  const { t } = useTranslation()
  const progressPercent = job.progress ?? job.progress_percentage ?? 0
  const stale = isJobStale(job)
  const inProgress = isJobInProgress(job.status) && !stale

  const statusLabels: Record<string, string> = {
    pending: t('Preparing backup...'),
    processing: t('Backing up...'),
    in_progress: t('Backing up...'),
    completed: t('Backup completed'),
    failed: t('Backup failed'),
    cancelled: t('Backup cancelled'),
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {inProgress && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
          {job.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
          {(job.status === 'failed' || job.status === 'cancelled') && (
            <XCircle
              className={`h-5 w-5 ${job.status === 'failed' ? 'text-red-600' : 'text-amber-600'}`}
            />
          )}
          <span className="font-medium text-gray-900">
            {statusLabels[job.status] || job.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {inProgress && onCancel && (
            <button
              onClick={onCancel}
              disabled={isCancelling}
              className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {isCancelling ? t('Cancelling...') : t('Cancel')}
            </button>
          )}
          {!inProgress && onDismiss && (
            <button onClick={onDismiss} className="text-sm text-gray-500 hover:text-gray-700">
              {t('Dismiss')}
            </button>
          )}
        </div>
      </div>

      {stale && (
        <p className="mt-2 text-sm text-amber-700">
          {job.stale_message ||
            t(
              'Backup is still waiting for the server worker. Please try again later or contact support.'
            )}
        </p>
      )}

      {/* Progress bar */}
      {inProgress && (
        <>
          <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            {progressPercent.toFixed(0)}%
            {job.processed_qr_codes != null && job.total_qr_codes != null && (
              <span className="ml-2">
                ({job.processed_qr_codes}/{job.total_qr_codes} {t('QR codes')})
              </span>
            )}
          </p>
        </>
      )}

      {/* Completed info */}
      {job.status === 'completed' && (
        <p className="text-sm text-gray-600">
          {t('File size:')} {formatSize(job.file_size || job.size_bytes)}
        </p>
      )}

      {/* Error message */}
      {job.status === 'failed' && job.error_message && (
        <p className="mt-2 text-sm text-red-600">{job.error_message}</p>
      )}
    </div>
  )
}
