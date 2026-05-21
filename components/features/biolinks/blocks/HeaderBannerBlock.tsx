'use client'

import { useTranslation } from '@/lib/i18n'
import type { HeaderBannerBlockData } from '@/types/entities/biolink'

interface HeaderBannerBlockProps {
  block: HeaderBannerBlockData
  isEditing?: boolean
  onUpdate?: (data: HeaderBannerBlockData['data']) => void
}

/**
 * Purpose: Executes HeaderBannerBlock functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function HeaderBannerBlock({ block, isEditing, onUpdate }: HeaderBannerBlockProps) {
  const {
    title,
    subtitle,
    backgroundImage,
    backgroundColor = '#1f2937',
    textColor = '#ffffff',
    height = 200,
    align = 'center',
    overlayOpacity = 0.4,
    buttonText,
    buttonUrl,
  } = block.data
  const { t } = useTranslation()

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Title')}</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Welcome to My Page"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Subtitle (optional)')}</label>
          <input
            type="text"
            value={subtitle || ''}
            onChange={(e) => onUpdate?.({ ...block.data, subtitle: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Background Image URL (optional)')}</label>
          <input
            type="url"
            value={backgroundImage || ''}
            onChange={(e) => onUpdate?.({ ...block.data, backgroundImage: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="https://example.com/banner.jpg"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Background Color')}</label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => onUpdate?.({ ...block.data, backgroundColor: e.target.value })}
              className="mt-1 block h-9 w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Text Color')}</label>
            <input
              type="color"
              value={textColor}
              onChange={(e) => onUpdate?.({ ...block.data, textColor: e.target.value })}
              className="mt-1 block h-9 w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Height (px)')}</label>
            <input
              type="number"
              value={height}
              min={100}
              max={500}
              onChange={(e) => onUpdate?.({ ...block.data, height: parseInt(e.target.value) || 200 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Alignment')}</label>
            <select
              value={align}
              onChange={(e) =>
                onUpdate?.({ ...block.data, align: e.target.value as 'left' | 'center' | 'right' })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="left">{t('Left')}</option>
              <option value="center">{t('Center')}</option>
              <option value="right">{t('Right')}</option>
            </select>
          </div>
        </div>
        {backgroundImage && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('Overlay Opacity')} ({Math.round(overlayOpacity * 100)}%)
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(overlayOpacity * 100)}
              onChange={(e) =>
                onUpdate?.({ ...block.data, overlayOpacity: parseInt(e.target.value) / 100 })
              }
              className="mt-1 block w-full"
            />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Button Text (optional)')}</label>
          <input
            type="text"
            value={buttonText || ''}
            onChange={(e) => onUpdate?.({ ...block.data, buttonText: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Learn More"
          />
        </div>
        {buttonText && (
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Button URL')}</label>
            <input
              type="url"
              value={buttonUrl || ''}
              onChange={(e) => onUpdate?.({ ...block.data, buttonUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        )}
      </div>
    )
  }

  const alignClasses = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  }

  return (
    <div
      className={`relative flex flex-col justify-center overflow-hidden rounded-lg ${alignClasses[align]} px-6`}
      style={{
        height: `${height}px`,
        backgroundColor,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 rounded-lg"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
        />
      )}
      <div className="relative z-10">
        <h2 className="text-3xl font-bold" style={{ color: textColor }}>
          {title || t('Banner Title')}
        </h2>
        {subtitle && (
          <p className="mt-2 text-lg" style={{ color: textColor, opacity: 0.9 }}>
            {subtitle}
          </p>
        )}
        {buttonText && (
          <a
            href={buttonUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-lg bg-white/20 px-6 py-2 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/30"
            style={{ color: textColor, border: `1px solid ${textColor}40` }}
          >
            {buttonText}
          </a>
        )}
      </div>
    </div>
  )
}
