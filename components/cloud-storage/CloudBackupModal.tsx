'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import { Loader2, AlertCircle, Upload } from 'lucide-react'
import type { CloudConnection } from '@/lib/api/endpoints/cloud-storage'

// Provider display names
const PROVIDER_NAMES: Record<string, string> = {
  google_drive: 'Google Drive',
  dropbox: 'Dropbox',
  onedrive: 'OneDrive',
  mega: 'MEGA',
}

export interface BackupConfig {
  connectionId: string
  format: 'json' | 'zip'
  includeDesigns: boolean
  includeAnalytics: boolean
  includeImages: boolean
}

interface CloudBackupModalProps {
  open: boolean
  onClose: () => void
  connections: CloudConnection[]
  onStart: (config: BackupConfig) => void
  isStarting: boolean
  /** Number of selected QR codes, or undefined for "all" */
  qrCodeCount?: number
}

function getConnectionStatus(connection: CloudConnection): 'connected' | 'expired' | 'inactive' {
  if ((connection as { status?: string }).status) {
    const legacyStatus = (connection as { status: string }).status
    return legacyStatus === 'error' ? 'inactive' : legacyStatus as 'connected' | 'expired' | 'inactive'
  }
  if (!connection.is_active) return 'inactive'
  if (connection.is_token_expired) return 'expired'
  return 'connected'
}

export function CloudBackupModal({
  open,
  onClose,
  connections,
  onStart,
  isStarting,
  qrCodeCount,
}: CloudBackupModalProps) {
  const { t } = useTranslation()

  const activeConnections = connections.filter(
    (c) => getConnectionStatus(c) === 'connected'
  )

  const [selectedConnection, setSelectedConnection] = useState(
    activeConnections[0]?.id ? String(activeConnections[0].id) : ''
  )
  const [format, setFormat] = useState<'json' | 'zip'>('json')
  const [includeDesigns, setIncludeDesigns] = useState(true)
  const [includeAnalytics, setIncludeAnalytics] = useState(true)
  const [includeImages, setIncludeImages] = useState(false)

  const handleSubmit = () => {
    if (!selectedConnection) return
    onStart({
      connectionId: selectedConnection,
      format,
      includeDesigns,
      includeAnalytics,
      includeImages,
    })
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !isStarting && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            {t('Backup to Cloud')}
          </DialogTitle>
          <DialogDescription>
            {qrCodeCount
              ? t('Backup {{count}} selected QR codes to cloud storage').replace(
                  '{{count}}',
                  String(qrCodeCount)
                )
              : t('Backup all QR codes to cloud storage')}
          </DialogDescription>
        </DialogHeader>

        {activeConnections.length === 0 ? (
          <div className="py-4">
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  {t('No active cloud connections')}
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  {t('Please connect a cloud provider first.')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* Info badge */}
            <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
              {qrCodeCount
                ? `${t('Backing up')} ${qrCodeCount} ${t('selected QR codes')}`
                : t('Backing up all QR codes')}
            </div>

            {/* Connection selector */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {t('Cloud Provider')}
              </label>
              <select
                value={selectedConnection}
                onChange={(e) => setSelectedConnection(e.target.value)}
                disabled={isStarting}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              >
                {activeConnections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {PROVIDER_NAMES[c.provider] || c.provider}
                    {(c.account_email || c.email) && ` \u2014 ${c.account_email || c.email}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Export format */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {t('Export Format')}
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'json' | 'zip')}
                disabled={isStarting}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              >
                <option value="json">JSON ({t('data only')})</option>
                <option value="zip">ZIP ({t('bundled archive')})</option>
              </select>
            </div>

            {/* Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeDesigns}
                  onChange={(e) => setIncludeDesigns(e.target.checked)}
                  disabled={isStarting}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {t('Include QR code designs')}
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeAnalytics}
                  onChange={(e) => setIncludeAnalytics(e.target.checked)}
                  disabled={isStarting}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  {t('Include analytics data')}
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  disabled={isStarting}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm text-gray-700">
                    {t('Include QR code images (SVG + PNG)')}
                  </span>
                  <p className="text-xs text-gray-500">
                    {t('Increases backup size significantly')}
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isStarting}>
            {t('Cancel')}
          </Button>
          {activeConnections.length > 0 && (
            <Button
              onClick={handleSubmit}
              disabled={isStarting || !selectedConnection}
            >
              {isStarting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('Starting...')}
                </>
              ) : (
                t('Start Backup')
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
