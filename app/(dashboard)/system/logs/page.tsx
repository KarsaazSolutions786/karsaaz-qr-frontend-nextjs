'use client'

import { useState, useEffect, useRef } from 'react'
import { systemConfigsAPI } from '@/lib/api/endpoints/system-configs'

export default function SystemLogsPage() {
  const [logContent, setLogContent] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const showFeedback = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

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
      setLogContent('Failed to load logs.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const handleDownload = async () => {
    try {
      const blob = await systemConfigsAPI.downloadLogFile()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `system-logs-${new Date().toISOString().split('T')[0]}.log`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      showFeedback('Failed to download log file.')
    }
  }

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear the log file? This cannot be undone.')) return
    try {
      await systemConfigsAPI.clearLogFile()
      setLogContent('')
      setFileSize(0)
      showFeedback('Log file cleared successfully.')
    } catch {
      showFeedback('Failed to clear log file.')
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Logs</h1>
          <p className="mt-2 text-sm text-gray-600">
            View system activity and error logs
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
            {isLoading ? 'Loading…' : 'Refresh'}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!logContent}
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
          >
            Download
          </button>
          <button
            type="button"
            onClick={handleClear}
            disabled={!logContent}
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50"
          >
            Clear Logs
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow">
        {isLoading ? (
          <div className="flex min-h-96 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent" />
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            readOnly
            value={logContent || 'No logs available.'}
            className="h-[600px] w-full resize-none border-0 bg-gray-900 p-6 font-mono text-xs leading-relaxed text-green-400 focus:outline-none"
          />
        )}
      </div>
    </div>
  )
}
