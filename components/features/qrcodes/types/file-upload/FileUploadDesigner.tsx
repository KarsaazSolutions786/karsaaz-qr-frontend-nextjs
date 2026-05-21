'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export interface FileUploadDesignSettings extends DesignSettings {
  // File Upload-specific settings (minimal as it's a direct file link)
  showFileName?: boolean
  showFileSize?: boolean
  showFileType?: boolean
  downloadButtonText?: string
  downloadButtonColor?: string
  downloadButtonTextColor?: string
  showPreview?: boolean
  previewSize?: 'small' | 'medium' | 'large'
  iconStyle?: 'default' | 'minimal' | 'colorful'
}

interface FileUploadDesignerProps {
  design: FileUploadDesignSettings
  onChange: (design: FileUploadDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'file', label: 'File Display', icon: '📄' },
]

/**
 * Purpose: Executes FileUploadDesigner functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function FileUploadDesigner({ design, onChange }: FileUploadDesignerProps) {
  const { t } = useTranslation()
  /**
   * Purpose: Updates the configuration or state.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const updateDesign = (updates: Partial<FileUploadDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  /**
   * Purpose: Executes renderFileOptionsContent functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const renderFileOptionsContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">{t('File Display Options')}</h4>

      {/* Display Options */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showFileName"
            checked={design.showFileName ?? true}
            onChange={e => updateDesign({ showFileName: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showFileName" className="text-sm text-gray-700">
            {t('Show File Name')}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showFileSize"
            checked={design.showFileSize ?? true}
            onChange={e => updateDesign({ showFileSize: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showFileSize" className="text-sm text-gray-700">
            {t('Show File Size')}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showFileType"
            checked={design.showFileType ?? true}
            onChange={e => updateDesign({ showFileType: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showFileType" className="text-sm text-gray-700">
            {t('Show File Type')}
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showPreview"
            checked={design.showPreview ?? true}
            onChange={e => updateDesign({ showPreview: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showPreview" className="text-sm text-gray-700">
            {t('Show Preview (for images/PDFs)')}
          </label>
        </div>
      </div>

      {/* Preview Size */}
      {design.showPreview && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('Preview Size')}</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'small', label: t('Small') },
              { value: 'medium', label: t('Medium') },
              { value: 'large', label: t('Large') },
            ].map(option => (
              <button
                key={option.value}
                onClick={() =>
                  updateDesign({
                    previewSize: option.value as FileUploadDesignSettings['previewSize'],
                  })
                }
                className={cn(
                  'px-3 py-2 border rounded-lg text-sm',
                  design.previewSize === option.value
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Icon Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Icon Style')}</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'default', label: t('Default') },
            { value: 'minimal', label: t('Minimal') },
            { value: 'colorful', label: t('Colorful') },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({ iconStyle: option.value as FileUploadDesignSettings['iconStyle'] })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.iconStyle === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Download Button */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-gray-700">{t('Download Button')}</h5>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Button Text')}</label>
          <input
            type="text"
            value={design.downloadButtonText || t('Download File')}
            onChange={e => updateDesign({ downloadButtonText: e.target.value })}
            placeholder={t('Download File')}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Button Color')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.downloadButtonColor || '#3b82f6'}
              onChange={e => updateDesign({ downloadButtonColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.downloadButtonColor || '#3b82f6'}
              onChange={e => updateDesign({ downloadButtonColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('Button Text Color')}</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.downloadButtonTextColor || '#ffffff'}
              onChange={e => updateDesign({ downloadButtonTextColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.downloadButtonTextColor || '#ffffff'}
              onChange={e => updateDesign({ downloadButtonTextColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <BaseDesigner design={design} onChange={onChange} tabs={tabs}>
      {renderFileOptionsContent()}
    </BaseDesigner>
  )
}

export default FileUploadDesigner
