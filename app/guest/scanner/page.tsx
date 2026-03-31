'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useGuest } from '@/lib/hooks/useGuest'
import { guestAPI, type GuestScan } from '@/lib/api/endpoints/guest'
import { GuestLimitsBanner } from '@/components/guest/GuestLimitsBanner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'

export default function GuestScannerPage() {
  const { t } = useTranslation()
  const { guestConfig, sessionLimits, isGuestLoading, isGuest } = useGuest()

  const [scannedData, setScannedData] = useState('')
  const [scannedType, setScannedType] = useState('text')
  const [isRecording, setIsRecording] = useState(false)
  const [scanHistory, setScanHistory] = useState<GuestScan[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)

  // Load scan history
  useEffect(() => {
    if (!isGuest || !guestConfig?.allow_scan_history) return

    const loadHistory = async () => {
      setIsLoadingHistory(true)
      try {
        const scans = await guestAPI.listScans()
        setScanHistory(Array.isArray(scans) ? scans : [])
      } catch {
        // Non-critical
      } finally {
        setIsLoadingHistory(false)
      }
    }
    loadHistory()
  }, [isGuest, guestConfig?.allow_scan_history])

  const handleRecordScan = async () => {
    if (!scannedData.trim()) {
      toast.error(t('Please enter the scanned data'))
      return
    }

    setIsRecording(true)
    try {
      const scan = await guestAPI.recordScan({
        scanned_data: scannedData.trim(),
        scanned_type: scannedType,
      })
      setScanHistory(prev => [scan, ...prev])
      setScannedData('')
      toast.success(t('Scan recorded'))
    } catch (err: any) {
      const message = err?.response?.data?.message || t('Failed to record scan')
      toast.error(message)
    } finally {
      setIsRecording(false)
    }
  }

  if (isGuestLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  if (!guestConfig?.allow_scanner) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <div className="mb-4 text-5xl">📷</div>
        <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
          {t('Scanner Not Available')}
        </h1>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          {t('The QR scanner is not available for guest users.')}
        </p>
        <Link href="/guest" className="text-blue-600 hover:underline">{t('Go Back')}</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      {isGuest && sessionLimits && <GuestLimitsBanner limits={sessionLimits} />}

      <div className="mb-6">
        <Link href="/guest" className="mb-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400">
          ← {t('Back')}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          📷 {t('QR Code Scanner')}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t('Paste QR code content below to record it.')}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-4">
          <Label htmlFor="scanned-data">{t('QR Code Content')}</Label>
          <Input
            id="scanned-data"
            value={scannedData}
            onChange={e => setScannedData(e.target.value)}
            placeholder={t('Paste scanned QR code content...')}
            className="mt-1"
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="scan-type">{t('Content Type')}</Label>
          <select
            id="scan-type"
            value={scannedType}
            onChange={e => setScannedType(e.target.value)}
            className="mt-1 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="text">{t('Text')}</option>
            <option value="url">{t('URL')}</option>
            <option value="wifi">{t('WiFi')}</option>
            <option value="vcard">{t('Contact')}</option>
            <option value="email">{t('Email')}</option>
            <option value="phone">{t('Phone')}</option>
          </select>
        </div>

        <Button onClick={handleRecordScan} disabled={isRecording}>
          {isRecording ? <Loader size="sm" className="mr-2" /> : null}
          {t('Record Scan')}
        </Button>

        {sessionLimits && (
          <p className="mt-3 text-xs text-gray-400">
            {t('Scans remaining')}: {sessionLimits.scans.remaining}/{sessionLimits.scans.max}
          </p>
        )}
      </div>

      {/* Scan history */}
      {guestConfig.allow_scan_history && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            {t('Scan History')}
          </h2>

          {isLoadingHistory ? (
            <div className="flex justify-center py-4">
              <Loader size="md" />
            </div>
          ) : scanHistory.length === 0 ? (
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t('No scans recorded yet.')}
            </p>
          ) : (
            <div className="space-y-3">
              {scanHistory.map(scan => (
                <div
                  key={scan.id}
                  className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {scan.scanned_data}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {scan.scanned_type} · {new Date(scan.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
