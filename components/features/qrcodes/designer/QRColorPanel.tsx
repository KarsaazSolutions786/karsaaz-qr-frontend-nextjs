'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { LottieLoader } from '@/components/ui/lottie-loader'
import { qrcodesAPI } from '@/lib/api/endpoints/qrcodes'
import { DesignerConfig } from '@/types/entities/designer'
import { useTranslation } from '@/lib/i18n'
import { ColorPickerWithPresets } from './ColorPickerWithPresets'
import { SectionCard } from './SectionCard'

interface QRColorPanelProps {
  value: DesignerConfig
  onFieldChange: (field: string, value: unknown) => void
  savedQRId?: string | null
  isFreePlan: boolean
  onPremiumBlock: () => void
  onImageUploaded: () => void
}

export function QRColorPanel({
  value,
  onFieldChange,
  savedQRId,
  isFreePlan,
  onPremiumBlock,
  onImageUploaded,
}: QRColorPanelProps) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(true)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const fillType =
    (value.foregroundFill as any)?.type === 'gradient'
      ? 'gradient'
      : (value.foregroundFill as any)?.type === 'foreground_image'
        ? 'image'
        : 'solid'

  return (
    <SectionCard
      title={t('QR Color')}
      sectionKey="qrColor"
      expanded={expanded}
      onToggle={() => setExpanded(e => !e)}
    >
      {/* Fill Type */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{t('Fill Type')}</span>
        <select
          value={fillType}
          onChange={e => {
            if (e.target.value !== 'solid' && isFreePlan) {
              onPremiumBlock()
              return
            }
            if (e.target.value === 'solid') {
              onFieldChange('foregroundFill', { type: 'solid', color: '#000000' })
            } else if (e.target.value === 'gradient') {
              onFieldChange('foregroundFill', {
                type: 'gradient',
                gradientType: 'linear',
                startColor: '#000000',
                endColor: '#333333',
                rotation: 45,
              })
            } else {
              onFieldChange('foregroundFill', { type: 'foreground_image', imageUrl: '' })
            }
          }}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-purple-300 focus:border-purple-400 cursor-pointer"
        >
          <option value="solid">{t('Solid Color')}</option>
          <option value="gradient">{t('Gradient')}</option>
          <option value="image">{t('Image Fill')}</option>
        </select>
      </div>

      {/* Solid Color */}
      {fillType === 'solid' && (
        <ColorPickerWithPresets
          label={t('Fill Color')}
          value={(value.foregroundFill as any)?.color || '#000000'}
          onChange={c => onFieldChange('foregroundFill', { type: 'solid', color: c })}
        />
      )}

      {/* Gradient Controls */}
      {fillType === 'gradient' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{t('Gradient Type')}</span>
            <select
              value={(value.foregroundFill as any).gradientType || 'linear'}
              onChange={e =>
                onFieldChange('foregroundFill', {
                  ...(value.foregroundFill as any),
                  gradientType: e.target.value,
                })
              }
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
            >
              <option value="linear">{t('Linear')}</option>
              <option value="radial">{t('Radial')}</option>
            </select>
          </div>
          <ColorPickerWithPresets
            label={t('Start Color')}
            value={(value.foregroundFill as any).startColor || '#000000'}
            onChange={c =>
              onFieldChange('foregroundFill', { ...(value.foregroundFill as any), startColor: c })
            }
          />
          <ColorPickerWithPresets
            label={t('End Color')}
            value={(value.foregroundFill as any).endColor || '#333333'}
            onChange={c =>
              onFieldChange('foregroundFill', { ...(value.foregroundFill as any), endColor: c })
            }
          />
          {(value.foregroundFill as any).gradientType === 'linear' && (
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                {t('Angle')}: {(value.foregroundFill as any).rotation || 45}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                value={(value.foregroundFill as any).rotation || 45}
                onChange={e =>
                  onFieldChange('foregroundFill', {
                    ...(value.foregroundFill as any),
                    rotation: parseInt(e.target.value),
                  })
                }
                className="w-full accent-purple-500"
              />
            </div>
          )}
        </div>
      )}

      {/* Image Fill */}
      {fillType === 'image' && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">{t('Foreground Image')}</label>
          {!savedQRId ? (
            <div className="border-2 border-dashed border-yellow-300 rounded-lg p-4 bg-yellow-50">
              <div className="flex items-start gap-3">
                <div className="text-yellow-600 text-xl">⚠️</div>
                <div>
                  <p className="text-sm font-medium text-yellow-800">{t('Save QR Code First')}</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    {t(
                      'Image fill requires the QR code to be saved first. Click "Next" to save, then you can upload a foreground image.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div
                className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center cursor-pointer transition hover:border-purple-500 hover:bg-purple-50/30"
                onClick={() => document.getElementById('foreground-image-input')?.click()}
              >
                <input
                  id="foreground-image-input"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={async e => {
                    const file = e.target.files?.[0]
                    if (file && savedQRId) {
                      const reader = new FileReader()
                      reader.onload = ev => {
                        onFieldChange('foregroundFill', {
                          type: 'foreground_image',
                          imageUrl: ev.target?.result as string,
                        })
                      }
                      reader.readAsDataURL(file)
                      try {
                        setIsUploadingImage(true)
                        await qrcodesAPI.uploadForegroundImage(savedQRId, file)
                        onImageUploaded()
                      } catch (err) {
                        if (process.env.NODE_ENV === 'development')
                          console.error('[ForegroundImage] Upload failed:', err)
                      } finally {
                        setIsUploadingImage(false)
                      }
                    }
                  }}
                />
                {(value.foregroundFill as any).imageUrl ? (
                  <div className="flex items-center justify-center gap-3">
                    {isUploadingImage ? (
                      <LottieLoader size={80} />
                    ) : (
                      <img
                        src={(value.foregroundFill as any).imageUrl}
                        alt="Foreground preview"
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {isUploadingImage ? t('Uploading...') : t('Image selected')}
                      </p>
                      <p className="text-xs text-gray-500">{t('Click to replace')}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 font-medium">{t('Drop your file here')}</p>
                    <p className="text-xs text-gray-400 my-2">{t('or')}</p>
                    <span className="inline-block px-4 py-1.5 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors">
                      {t('Browse Files')}
                    </span>
                  </>
                )}
              </div>
              {(value.foregroundFill as any).imageUrl && (
                <button
                  type="button"
                  onClick={async () => {
                    onFieldChange('foregroundFill', { type: 'foreground_image', imageUrl: '' })
                    if (savedQRId) {
                      try {
                        await qrcodesAPI.deleteForegroundImage(savedQRId)
                      } catch {
                        /* ignore */
                      }
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  {t('Remove image')}
                </button>
              )}
              <p className="text-xs text-gray-500">
                {t('The image will be used as a pattern fill for the QR code modules.')}
              </p>
            </>
          )}
        </div>
      )}

      {/* Eye Colors */}
      <ColorPickerWithPresets
        label={t('Eye External Color')}
        value={value.eyeExternalColor || '#000000'}
        onChange={c => onFieldChange('eyeExternalColor', c)}
      />
      <ColorPickerWithPresets
        label={t('Eye Internal Color')}
        value={value.eyeInternalColor || '#000000'}
        onChange={c => onFieldChange('eyeInternalColor', c)}
      />

      {/* Background Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{t('Background')}</span>
        <Switch
          checked={value.background?.type !== 'transparent'}
          onCheckedChange={checked =>
            onFieldChange(
              'background',
              checked ? { type: 'solid', color: '#FFFFFF' } : { type: 'transparent' }
            )
          }
        />
      </div>

      {/* Background Color */}
      {value.background?.type !== 'transparent' && (
        <ColorPickerWithPresets
          label={t('Background Color')}
          value={value.background?.color || '#FFFFFF'}
          onChange={c => onFieldChange('background', { type: 'solid', color: c })}
        />
      )}
    </SectionCard>
  )
}
