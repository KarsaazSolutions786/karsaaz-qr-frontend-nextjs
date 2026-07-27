'use client'

import { useState, useEffect, useRef } from 'react'
import { systemConfigsAPI } from '@/lib/api/endpoints/system-configs'
import { envConfig } from '@/lib/config/env-config'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'
import { useConfirmation } from '@/components/ui/confirmation-modal'

/**
 * Purpose: Executes SystemLogsPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function SystemLogsPage() {
  const { confirm } = useConfirmation()
  const { t } = useTranslation()
  const [logContent, setLogContent] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  /**
   * Purpose: Executes showFeedback functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const showFeedback = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

  /**
   * Purpose: Executes fetchLogs functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const data = await systemConfigsAPI.getLogs()
      setLogContent(data.content || '')
      setFileSize(data.size || 0)
      // Auto-scroll to bottom
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight
        }
      }, 100)
    } catch {
      setLogContent(t('Failed to load logs.'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Purpose: Executes handleDownload functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDownload = async () => {
    try {
      const url = await systemConfigsAPI.downloadLogFile()
      // Backend returns a relative signed URL — resolve against API origin

      const baseOrigin =
        (typeof window !== 'undefined' && (window as any).BACKEND_URL) || envConfig.API_URL
      const fullUrl = url.startsWith('http') ? url : `${baseOrigin}${url}`
      window.open(fullUrl, '_blank')
    } catch {
      showFeedback(t('Failed to download log file.'))
    }
  }

  /**
   * Purpose: Executes handleClear functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleClear = async () => {
    if (
      !(await confirm({
        title: 'Are you sure?',
        message: t('Are you sure you want to clear the log file? This cannot be undone.'),
        type: 'danger',
      }))
    )
      return
    try {
      await systemConfigsAPI.clearLogFile()
      setLogContent('')
      setFileSize(0)
      showFeedback(t('Log file cleared successfully.'))
    } catch {
      showFeedback(t('Failed to clear log file.'))
    }
  }

  /**
   * Purpose: Executes formatSize functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('System Logs')}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('View system activity and error logs')}
            {fileSize > 0 && <span className="ml-2 text-gray-400">({formatSize(fileSize)})</span>}
          </p>
        </div>
        <div className="mt-4 flex items-center gap-3 sm:mt-0">
          {feedback && <span className="text-sm font-medium text-green-600">{feedback}</span>}
          <button
            type="button"
            onClick={fetchLogs}
            disabled={isLoading}
            className="inline-flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoading ? t('Loading...') : t('Refresh')}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!logContent}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
          >
            {t('Download')}
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!logContent}
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
          >
            {t('Clear Logs')}
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
        {isLoading ? (
          <div className="flex min-h-96 items-center justify-center">
            <LottieLoader size={80} />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            readOnly
            value={logContent || t('No logs available.')}
            className="h-[600px] w-full resize-none border-0 bg-gray-900 p-6 font-mono text-xs leading-relaxed text-green-400 focus:outline-none"
          />
        )}
      </div>
    </div>
  )
}
