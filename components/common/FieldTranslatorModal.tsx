'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from '@/lib/i18n'
import apiClient from '@/lib/api/client'
import { toast } from 'sonner'

interface FieldTranslatorModalProps {
  isOpen: boolean
  onClose: () => void
  fieldName: string
  modelType: string
  modelId: number | string
  currentValue: string
  onSave?: () => void
}

interface TranslationLine {
  key: string
  value: string
  locale: string
}

export function FieldTranslatorModal({
  isOpen,
  onClose,
  fieldName,
  modelType,
  modelId,
  currentValue,
  onSave,
}: FieldTranslatorModalProps) {
  const { t, languages } = useTranslation()
  const [selectedLocale, setSelectedLocale] = useState('')
  const [translationText, setTranslationText] = useState('')
  const [saving, setSaving] = useState(false)
  const [existingLines, setExistingLines] = useState<TranslationLine[]>([])
  const [loading, setLoading] = useState(false)

  const nonDefaultLanguages = languages.filter((l) => !l.is_default)

  const fetchExistingLines = useCallback(async () => {
    if (!isOpen || !modelId || !fieldName) return
    setLoading(true)
    try {
      const params = new URLSearchParams({
        modelClass: modelType,
        modelId: String(modelId),
        field: fieldName,
      })
      const { data } = await apiClient.get<TranslationLine[]>(
        `/translations/lines?${params.toString()}`
      )
      setExistingLines(Array.isArray(data) ? data : [])
    } catch {
      setExistingLines([])
    } finally {
      setLoading(false)
    }
  }, [isOpen, modelType, modelId, fieldName])

  useEffect(() => {
    fetchExistingLines()
  }, [fetchExistingLines])

  // Pre-fill translation text when locale changes
  useEffect(() => {
    if (!selectedLocale) {
      setTranslationText('')
      return
    }
    const existing = existingLines.find((l) => l.locale === selectedLocale)
    if (existing) {
      try {
        setTranslationText(JSON.parse(existing.value))
      } catch {
        setTranslationText(existing.value)
      }
    } else {
      setTranslationText('')
    }
  }, [selectedLocale, existingLines])

  const handleSave = async () => {
    if (!selectedLocale || !translationText.trim()) return
    setSaving(true)
    try {
      await apiClient.post('/translations/lines', {
        modelClass: modelType,
        modelId: String(modelId),
        field: fieldName,
        text: translationText,
        locale: selectedLocale,
      })
      toast.success(t('Translation saved successfully'))
      onSave?.()
      onClose()
    } catch {
      toast.error(t('Failed to save translation'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('Translate Field')}</DialogTitle>
          <DialogDescription>
            {t('Provide translations for this field')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current value (read-only) */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {t('Current Value')}
            </label>
            <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
              {currentValue || '—'}
            </div>
          </div>

          {nonDefaultLanguages.length < 1 ? (
            <p className="text-sm text-gray-500">
              {t('No additional languages are enabled.')}
            </p>
          ) : (
            <>
              {/* Language selector */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  {t('Language')}
                </label>
                <select
                  value={selectedLocale}
                  onChange={(e) => setSelectedLocale(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">{t('Select language')}</option>
                  {nonDefaultLanguages.map((lang) => (
                    <option key={lang.id} value={lang.locale}>
                      {lang.display_name || lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Translation input */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  {t('Translation')}
                </label>
                <Textarea
                  value={translationText}
                  onChange={(e) => setTranslationText(e.target.value)}
                  placeholder={t('Enter translation...')}
                  rows={3}
                  disabled={!selectedLocale || loading}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !selectedLocale || !translationText.trim()}
          >
            {saving ? t('Saving...') : t('Save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
