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
import { Loader2 } from 'lucide-react'

interface ConfigTranslatorModalProps {
  isOpen: boolean
  onClose: () => void
  configKey: string
  /** Optional path for config translation (used by P1 for nested keys) */
  path?: string
  currentValue: string
  onSave?: () => void
}

interface ConfigLine {
  key: string
  value: string
  locale: string
}

/**
 * Purpose: Executes ConfigTranslatorModal functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function ConfigTranslatorModal({
  isOpen,
  onClose,
  configKey,
  path,
  currentValue,
  onSave,
}: ConfigTranslatorModalProps) {
  const { t, languages } = useTranslation()
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [existingLines, setExistingLines] = useState<ConfigLine[]>([])
  const [loading, setLoading] = useState(false)

  const nonDefaultLanguages = languages.filter((l) => !l.is_default)

  const fetchExistingLines = useCallback(async () => {
    if (!isOpen || !configKey) return
    setLoading(true)
    try {
      const params = new URLSearchParams({ configKey })
      if (path) params.set('path', path)
      const { data } = await apiClient.get<ConfigLine[]>(
        `/translations/config-lines?${params.toString()}`
      )
      setExistingLines(Array.isArray(data) ? data : [])
    } catch {
      setExistingLines([])
    } finally {
      setLoading(false)
    }
  }, [isOpen, configKey, path])

  useEffect(() => {
    fetchExistingLines()
  }, [fetchExistingLines])

  // Pre-fill all locale translations when existing lines load
  useEffect(() => {
    const map: Record<string, string> = {}
    for (const line of existingLines) {
      try {
        map[line.locale] = JSON.parse(line.value)
      } catch {
        map[line.locale] = line.value
      }
    }
    setTranslations(map)
  }, [existingLines])

  /**
   * Purpose: Executes handleLocaleChange functionality.
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  const handleLocaleChange = (locale: string, text: string) => {
    setTranslations((prev) => ({ ...prev, [locale]: text }))
  }

  /**
   * Purpose: Executes handleSaveAll functionality.
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  const handleSaveAll = async () => {
    const entries = Object.entries(translations).filter(
      ([, text]) => text.trim().length > 0
    )
    if (entries.length === 0) return

    setSaving(true)
    try {
      const promises = entries.map(([locale, text]) =>
        apiClient.post('/translations/config-lines', {
          configKey,
          ...(path ? { path } : {}),
          text,
          locale,
        })
      )
      await Promise.all(promises)
      toast.success(t('Translations saved successfully'))
      onSave?.()
      onClose()
    } catch {
      toast.error(t('Failed to save translations'))
    } finally {
      setSaving(false)
    }
  }

  const hasAnyTranslation = Object.values(translations).some(
    (text) => text.trim().length > 0
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('Translate Config')}</DialogTitle>
          <DialogDescription>
            {t('Provide translations for this config value in all available languages')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current value (read-only) */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {t('Current Value')} <span className="text-xs text-gray-400">({t('Default')})</span>
            </label>
            <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
              {currentValue || '\u2014'}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : nonDefaultLanguages.length < 1 ? (
            <p className="text-sm text-gray-500">
              {t('No additional languages are enabled. Go to Translations to enable more languages.')}
            </p>
          ) : (
            <div className="space-y-4">
              {nonDefaultLanguages.map((lang) => (
                <div key={lang.id}>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    {lang.display_name || lang.name}
                    <span className="ml-1 text-xs text-gray-400">({lang.locale})</span>
                  </label>
                  <Textarea
                    value={translations[lang.locale] || ''}
                    onChange={(e) => handleLocaleChange(lang.locale, e.target.value)}
                    placeholder={`${t('Enter translation in')} ${lang.display_name || lang.name}...`}
                    rows={2}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            {t('Cancel')}
          </Button>
          <Button
            onClick={handleSaveAll}
            disabled={saving || !hasAnyTranslation}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('Saving...')}
              </>
            ) : (
              t('Save All')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
