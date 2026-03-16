'use client'

import React, { useState, useMemo } from 'react'
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
import { UserCheck, Search, Loader2, AlertTriangle } from 'lucide-react'
import { useUsers } from '@/lib/hooks/queries/useUsers'
import apiClient from '@/lib/api/client'
import { toast } from 'sonner'

interface BulkChangeOwnerModalProps {
  open: boolean
  onClose: () => void
  selectedIds: string[]
  onComplete: () => void
}

export function BulkChangeOwnerModal({
  open,
  onClose,
  selectedIds,
  onComplete,
}: BulkChangeOwnerModalProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedCount, setProcessedCount] = useState(0)

  const { data: usersData, isLoading: usersLoading } = useUsers({
    search: searchQuery || undefined,
    per_page: 20,
  })

  const users = usersData?.data ?? []

  const selectedUser = useMemo(() => {
    if (!selectedUserId) return null
    return users.find((u) => String(u.id) === selectedUserId) ?? null
  }, [selectedUserId, users])

  const handleSubmit = async () => {
    if (!selectedUserId || selectedIds.length === 0) return

    setIsProcessing(true)
    setProcessedCount(0)

    let successCount = 0
    let failCount = 0

    for (const id of selectedIds) {
      try {
        await apiClient.post(`/qrcodes/${id}/change-user`, {
          user_id: selectedUserId,
        })
        successCount++
      } catch {
        failCount++
      }
      setProcessedCount((prev) => prev + 1)
    }

    setIsProcessing(false)

    if (failCount > 0) {
      toast.error(
        t('Reassigned {{success}} QR codes. {{fail}} failed.')
          .replace('{{success}}', String(successCount))
          .replace('{{fail}}', String(failCount))
      )
    } else {
      toast.success(
        t('Successfully reassigned {{count}} QR codes').replace(
          '{{count}}',
          String(successCount)
        )
      )
    }

    onComplete()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            {t('Change Owner')}
          </DialogTitle>
          <DialogDescription>
            {t('Reassign {{count}} selected QR codes to a different user').replace(
              '{{count}}',
              String(selectedIds.length)
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Warning */}
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
            <p className="text-sm text-amber-800">
              {t(
                'The selected QR codes will be transferred to the chosen user. Analytics data will be preserved.'
              )}
            </p>
          </div>

          {/* User search */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {t('Search User')}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('Search by name or email...')}
                disabled={isProcessing}
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>

          {/* User list */}
          <div className="max-h-48 overflow-y-auto rounded-md border border-gray-200">
            {usersLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : users.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">
                {searchQuery
                  ? t('No users found matching your search')
                  : t('No users available')}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {users.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUserId(String(user.id))}
                    disabled={isProcessing}
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      String(user.id) === selectedUserId
                        ? 'bg-blue-50 text-blue-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">
                      {(user.name || user.email || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {user.name || t('No name')}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>
                    {String(user.id) === selectedUserId && (
                      <div className="flex-shrink-0">
                        <UserCheck className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected user info */}
          {selectedUser && (
            <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2">
              <p className="text-sm text-blue-800">
                {t('Transfer to:')} <span className="font-medium">{selectedUser.name || selectedUser.email}</span>
              </p>
            </div>
          )}

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${(processedCount / selectedIds.length) * 100}%`,
                  }}
                />
              </div>
              <p className="text-center text-sm text-gray-600">
                {processedCount} / {selectedIds.length} {t('processed')}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedUserId || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('Processing...')}
              </>
            ) : (
              t('Change Owner')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
