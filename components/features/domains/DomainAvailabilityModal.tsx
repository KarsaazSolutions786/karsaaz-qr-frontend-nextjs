'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import apiClient from '@/lib/api/client'

interface DomainAvailabilityModalProps {
  open: boolean
  onClose: () => void
  onConfirm?: (domain: string) => void
}

type CheckStatus = 'idle' | 'checking' | 'available' | 'taken' | 'error'

export function DomainAvailabilityModal({
  open,
  onClose,
  onConfirm,
}: DomainAvailabilityModalProps) {
  const [domain, setDomain] = useState('')
  const [status, setStatus] = useState<CheckStatus>('idle')
  const [message, setMessage] = useState('')

  const handleCheck = async () => {
    if (!domain.trim()) return
    setStatus('checking')
    setMessage('')

    try {
      const res = await apiClient.post<{ available: boolean; message?: string }>(
        '/domains/check-availability',
        { domain: domain.trim() }
      )
      if (res.data.available) {
        setStatus('available')
        setMessage(res.data.message ?? 'This domain is available!')
      } else {
        setStatus('taken')
        setMessage(res.data.message ?? 'This domain is already taken.')
      }
    } catch {
      setStatus('error')
      setMessage('Failed to check domain availability.')
    }
  }

  const handleConfirm = () => {
    onConfirm?.(domain.trim())
    handleClose()
  }

  const handleClose = () => {
    setDomain('')
    setStatus('idle')
    setMessage('')
    onClose()
  }

  const statusColors: Record<CheckStatus, string> = {
    idle: '',
    checking: 'text-gray-500',
    available: 'text-green-600',
    taken: 'text-red-600',
    error: 'text-red-600',
  }

  const statusIcons: Record<CheckStatus, string> = {
    idle: '',
    checking: '⏳',
    available: '✓',
    taken: '✗',
    error: '⚠',
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Check Domain Availability</DialogTitle>
          <DialogDescription>
            Enter a domain to check if it&apos;s available for use.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value)
                setStatus('idle')
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
              placeholder="e.g., qr.example.com"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
            />
            <button
              type="button"
              onClick={handleCheck}
              disabled={!domain.trim() || status === 'checking'}
              className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 disabled:opacity-50"
            >
              {status === 'checking' ? 'Checking…' : 'Check'}
            </button>
          </div>

          {message && (
            <div className={`flex items-center gap-2 text-sm ${statusColors[status]}`}>
              <span>{statusIcons[status]}</span>
              <span>{message}</span>
            </div>
          )}

          {status === 'available' && onConfirm && (
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700"
            >
              Add This Domain
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
