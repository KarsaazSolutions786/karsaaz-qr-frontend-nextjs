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
import { useLeadForms } from '@/lib/hooks/queries/useLeadForms'
import {
  Search,
  FileText,
  CheckCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

// ── Inline selector (dropdown-style) ──────────────────────────────────────

interface LeadFormSelectorProps {
  value?: number | null
  onChange: (formId: number | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

/**
 * Purpose: Executes LeadFormSelector functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function LeadFormSelector({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
}: LeadFormSelectorProps) {
  const { t } = useTranslation()
  const [modalOpen, setModalOpen] = useState(false)
  const { data, isLoading } = useLeadForms({ page: 1 })

  const forms = data?.data ?? []
  const selectedForm = forms.find((f) => f.id === value)

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        disabled={disabled || isLoading}
        className="flex w-full items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FileText className="h-4 w-4 flex-shrink-0 text-gray-400" />
        <span className={`flex-1 truncate ${selectedForm ? 'text-gray-900' : 'text-gray-500'}`}>
          {isLoading
            ? t('Loading...')
            : selectedForm
              ? selectedForm.qrcode_name || `Lead Form #${selectedForm.id}`
              : placeholder || t('Select a lead form...')}
        </span>
        {selectedForm && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange(null)
            }}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            title={t('Clear selection')}
          >
            &times;
          </button>
        )}
      </button>

      <LeadFormSelectorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSelect={(formId) => {
          onChange(formId)
          setModalOpen(false)
        }}
        selectedId={value ?? null}
      />
    </div>
  )
}

// ── Modal picker ──────────────────────────────────────────────────────────

interface LeadFormSelectorModalProps {
  open: boolean
  onClose: () => void
  onSelect: (formId: number) => void
  selectedId: number | null
}

/**
 * Purpose: Executes LeadFormSelectorModal functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function LeadFormSelectorModal({
  open,
  onClose,
  onSelect,
  selectedId,
}: LeadFormSelectorModalProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const { data, isLoading } = useLeadForms({ page })

  const forms = data?.data ?? []
  const pagination = data?.pagination

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return forms
    const query = searchQuery.toLowerCase()
    return forms.filter((form) => {
      const name = (form.qrcode_name || `Lead Form #${form.id}`).toLowerCase()
      return name.includes(query)
    })
  }, [forms, searchQuery])

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            {t('Select Lead Form')}
          </DialogTitle>
          <DialogDescription>
            {t('Choose a lead form to associate with this QR code')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search lead forms...')}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Form list */}
          <div className="max-h-72 overflow-y-auto rounded-md border border-gray-200">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                {searchQuery
                  ? t('No lead forms match your search')
                  : t('No lead forms available')}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filtered.map((form) => {
                  const isSelected = form.id === selectedId
                  const title =
                    form.qrcode_name || `Lead Form #${form.id}`

                  return (
                    <button
                      key={form.id}
                      type="button"
                      onClick={() => onSelect(form.id)}
                      className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors ${
                        isSelected
                          ? 'bg-blue-50 text-blue-900'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${
                          isSelected
                            ? 'bg-blue-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        <FileText
                          className={`h-4 w-4 ${
                            isSelected
                              ? 'text-blue-600'
                              : 'text-gray-500'
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {form.responseCount ?? 0}{' '}
                          {t('responses')} &middot;{' '}
                          {new Date(form.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-blue-600" />
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.lastPage > 1 && (
            <div className="flex items-center justify-between pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                {t('Prev')}
              </Button>
              <span className="text-xs text-gray-500">
                {page} / {pagination.lastPage}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= pagination.lastPage}
              >
                {t('Next')}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('Cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
