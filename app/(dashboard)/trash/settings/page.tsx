'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Trash2, Info } from 'lucide-react'
import { useTrashSettings, useUpdateTrashSettings } from '@/lib/hooks/queries/useTrash'
import { useTranslation } from '@/lib/i18n'
import { toast } from 'sonner'

type AutoDeleteOption = 'never' | '7' | '15' | '30' | 'custom'

export default function TrashSettingsPage() {
  const { t } = useTranslation()
  const { data: settings, isLoading } = useTrashSettings()
  const updateSettings = useUpdateTrashSettings()

  const [selected, setSelected] = useState<AutoDeleteOption>('never')
  const [customDays, setCustomDays] = useState<string>('')
  const [isDirty, setIsDirty] = useState(false)

  // Derive option from server value (no effect needed)
  const serverSelected: AutoDeleteOption = (() => {
    const days = settings?.trash_auto_delete_days
    if (!days) return 'never'
    if (days === 7) return '7'
    if (days === 15) return '15'
    if (days === 30) return '30'
    return 'custom'
  })()
  const serverCustomDays =
    settings?.trash_auto_delete_days && ![7, 15, 30].includes(settings.trash_auto_delete_days)
      ? String(settings.trash_auto_delete_days)
      : ''

  const effectiveSelected = isDirty ? selected : serverSelected
  const effectiveCustomDays = isDirty ? customDays : serverCustomDays

  const handleOptionChange = (option: AutoDeleteOption) => {
    setSelected(option)
    setIsDirty(true)
  }

  const handleSave = async () => {
    let days: number | null = null
    if (effectiveSelected === 'never') days = null
    else if (effectiveSelected === '7') days = 7
    else if (effectiveSelected === '15') days = 15
    else if (effectiveSelected === '30') days = 30
    else if (effectiveSelected === 'custom') {
      const n = parseInt(effectiveCustomDays, 10)
      if (!n || n < 1 || n > 365) {
        toast.error(t('Custom days must be between 1 and 365'))
        return
      }
      days = n
    }

    await updateSettings.mutateAsync({ trash_auto_delete_days: days })
    setIsDirty(false)
    toast.success(t('Trash settings saved'))
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/trash"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('Back to Trash')}
        </Link>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Trash2 className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('Trash Settings')}</h1>
          <p className="text-sm text-gray-600 mt-0.5">
            {t('Configure automatic deletion of trashed QR codes')}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {/* Trash count info */}
          {settings && (
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
              <Info className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                {t('You currently have')} <strong>{settings.trash_count}</strong>{' '}
                {t('item(s) in trash')}.
                {settings.trash_limit > 0 && (
                  <>
                    {' '}
                    {t('Limit')}: <strong>{settings.trash_limit}</strong>.
                  </>
                )}
              </p>
            </div>
          )}

          {/* Auto-delete section */}
          <div className="px-6 py-6">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-5 h-5 text-gray-700" />
              <h2 className="text-base font-semibold text-gray-900">{t('Auto-Delete Schedule')}</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              {t(
                'Trashed QR codes will be permanently deleted automatically after the selected period.'
              )}
            </p>

            <div className="space-y-3">
              {/* Never */}
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="auto-delete"
                  value="never"
                  checked={effectiveSelected === 'never'}
                  onChange={() => handleOptionChange('never')}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('Never (manual only)')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('Items stay in trash until you manually delete them.')}
                  </p>
                </div>
              </label>

              {/* 7 days */}
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="auto-delete"
                  value="7"
                  checked={effectiveSelected === '7'}
                  onChange={() => handleOptionChange('7')}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('7 days')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('Items are permanently deleted 7 days after being moved to trash.')}
                  </p>
                </div>
              </label>

              {/* 15 days */}
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="auto-delete"
                  value="15"
                  checked={effectiveSelected === '15'}
                  onChange={() => handleOptionChange('15')}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('15 days')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('Items are permanently deleted 15 days after being moved to trash.')}
                  </p>
                </div>
              </label>

              {/* 30 days */}
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="auto-delete"
                  value="30"
                  checked={effectiveSelected === '30'}
                  onChange={() => handleOptionChange('30')}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{t('30 days')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('Items are permanently deleted 30 days after being moved to trash.')}
                  </p>
                </div>
              </label>

              {/* Custom */}
              <label className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                <input
                  type="radio"
                  name="auto-delete"
                  value="custom"
                  checked={effectiveSelected === 'custom'}
                  onChange={() => handleOptionChange('custom')}
                  className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{t('Custom')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('Enter a specific number of days (1–365).')}
                  </p>
                  {effectiveSelected === 'custom' && (
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={365}
                        value={effectiveCustomDays}
                        onChange={e => {
                          setCustomDays(e.target.value)
                          setIsDirty(true)
                        }}
                        className="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 14"
                      />
                      <span className="text-sm text-gray-600">{t('days')}</span>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Save button */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {t('Changes apply to all future auto-deletion cycles.')}
            </p>
            <button
              onClick={handleSave}
              disabled={!isDirty || updateSettings.isPending}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateSettings.isPending ? t('Saving...') : t('Save Settings')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
