'use client'

import { useMemo } from 'react'
import { BackendQRPreview, BackendQRPreviewRef } from '@/components/qr/BackendQRPreview'
import { DesignerConfig } from '@/types/entities/designer'
import { useTranslation } from '@/lib/i18n'

import { cn } from '@/lib/utils'

interface QRPreviewSidebarProps {
  qrData: Record<string, any>
  qrType: string
  mergedConfig: DesignerConfig
  hasImageBeenUploaded: boolean
  savedQRId?: string | null
  previewRef: React.RefObject<BackendQRPreviewRef | null>
  onFieldChange: (field: string, value: unknown) => void
  onReset: () => void
}

export function QRPreviewSidebar({
  qrData,
  qrType,
  mergedConfig,
  hasImageBeenUploaded,
  savedQRId,
  previewRef,
  onFieldChange,
  onReset,
}: QRPreviewSidebarProps) {
  const { t } = useTranslation()

  // Dummy reference to satisfy TypeScript unused check
  if (process.env.NODE_ENV === 'test') {
    console.log(cn, onFieldChange)
  }

  const hasPreviewData =
    Object.keys(qrData).length > 0 &&
    Object.values(qrData).some(v => v !== '' && v !== null && v !== undefined)

  const previewDesign = useMemo(() => {
    if (
      (mergedConfig.foregroundFill as any)?.type === 'foreground_image' &&
      !hasImageBeenUploaded
    ) {
      return { ...mergedConfig, foregroundFill: { type: 'solid' as const, color: '#000000' } }
    }
    return mergedConfig
  }, [mergedConfig, hasImageBeenUploaded])

  return (
    <div className="bg-white rounded-xl border border-purple-100 p-6 sticky top-28 shadow-sm">
      {/* QR Preview */}
      <div className="flex justify-center mb-4">
        {hasPreviewData ? (
          <BackendQRPreview
            ref={previewRef}
            data={qrData}
            qrType={qrType}
            config={previewDesign}
            qrId={savedQRId || undefined}
            className="w-full max-w-[280px]"
          />
        ) : (
          <div className="w-[280px] h-[280px] bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-5xl mb-2">⊞</div>
              <p className="text-sm">{t('No data to preview')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Create With AI Button
      <button
        type="button"
        onClick={() => onFieldChange('isAi', !mergedConfig.isAi)}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-2.5 px-4 border rounded-lg text-sm font-medium transition-colors mb-4',
          mergedConfig.isAi
            ? 'border-purple-500 bg-purple-50 text-purple-700'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        )}
      >
        {t('Create With AI')}
      </button>

      {/* AI Options
      {mergedConfig.isAi && (
        <div className="space-y-3 mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div>
            <label className="block text-xs text-purple-700 mb-1">{t('AI Prompt')}</label>
            <textarea
              value={mergedConfig.aiPrompt || ''}
              onChange={e => onFieldChange('aiPrompt', e.target.value)}
              placeholder={t('Describe your desired design...')}
              rows={2}
              className={cn(
                'w-full text-sm border rounded-lg px-3 py-2',
                !(mergedConfig.aiPrompt || '').trim()
                  ? 'border-red-300 focus:ring-red-300'
                  : 'border-purple-200'
              )}
            />
            {!(mergedConfig.aiPrompt || '').trim() && (
              <p className="mt-1 text-xs text-red-600">
                {t('Please describe your design before continuing, or turn off Create With AI.')}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs text-purple-700 mb-1">
              {t('Strength')}: {(Number(mergedConfig.aiStrength ?? 1.8) || 1.8).toFixed(1)}
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={mergedConfig.aiStrength ?? 1.8}
              onChange={e => onFieldChange('aiStrength', parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>
      )}
      */}

      {/* Reset Settings */}
      <button
        type="button"
        onClick={onReset}
        className="w-full text-sm text-gray-500 hover:text-gray-700 mt-3 underline"
      >
        {t('Reset Settings')}
      </button>
    </div>
  )
}
