'use client'

import { useTranslation } from '@/lib/i18n'
import type { MapBlockData } from '@/types/entities/biolink'

interface MapBlockProps {
  block: MapBlockData
  isEditing?: boolean
  onUpdate?: (data: MapBlockData['data']) => void
}

/**
 * Purpose: Executes buildMapEmbedUrl functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function buildMapEmbedUrl(data: MapBlockData['data']): string {
  const { provider = 'openstreetmap', lat, lng, zoom = 14, address } = data

  if (provider === 'google' && address) {
    return `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent(address)}`
  }

  if (lat != null && lng != null) {
    if (provider === 'google') {
      return `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`
    }
    // OpenStreetMap
    const bbox = calculateBBox(lat, lng, zoom)
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`
  }

  if (address) {
    return `https://www.openstreetmap.org/export/embed.html?bbox=&layer=mapnik`
  }

  return ''
}

/**
 * Purpose: Executes calculateBBox functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function calculateBBox(lat: number, lng: number, zoom: number): string {
  const delta = 0.01 * Math.pow(2, 15 - zoom)
  return `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`
}

/**
 * Purpose: Executes MapBlock functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export default function MapBlock({ block, isEditing, onUpdate }: MapBlockProps) {
  const {
    lat,
    lng,
    zoom = 14,
    address,
    title,
    height = 300,
    provider = 'openstreetmap',
  } = block.data
  const { t } = useTranslation()

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Title (optional)')}</label>
          <input
            type="text"
            value={title || ''}
            onChange={(e) => onUpdate?.({ ...block.data, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Our Location"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Address')}</label>
          <input
            type="text"
            value={address || ''}
            onChange={(e) => onUpdate?.({ ...block.data, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="123 Main St, City, Country"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Latitude')}</label>
            <input
              type="number"
              step="any"
              value={lat ?? ''}
              onChange={(e) =>
                onUpdate?.({ ...block.data, lat: e.target.value ? parseFloat(e.target.value) : undefined })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="40.7128"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Longitude')}</label>
            <input
              type="number"
              step="any"
              value={lng ?? ''}
              onChange={(e) =>
                onUpdate?.({ ...block.data, lng: e.target.value ? parseFloat(e.target.value) : undefined })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="-74.0060"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Zoom Level')}</label>
            <input
              type="number"
              value={zoom}
              min={1}
              max={20}
              onChange={(e) => onUpdate?.({ ...block.data, zoom: parseInt(e.target.value) || 14 })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('Map Provider')}</label>
            <select
              value={provider}
              onChange={(e) =>
                onUpdate?.({
                  ...block.data,
                  provider: e.target.value as 'google' | 'openstreetmap',
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="openstreetmap">{t('OpenStreetMap')}</option>
              <option value="google">{t('Google Maps')}</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t('Height (px)')}</label>
          <input
            type="number"
            value={height}
            min={150}
            max={600}
            onChange={(e) => onUpdate?.({ ...block.data, height: parseInt(e.target.value) || 300 })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    )
  }

  const hasLocation = (lat != null && lng != null) || address
  if (!hasLocation) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <p className="text-sm text-gray-500">{t('No location set')}</p>
      </div>
    )
  }

  const embedUrl = buildMapEmbedUrl(block.data)
  const directionsUrl =
    lat != null && lng != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
      : address
        ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
        : '#'

  return (
    <div className="space-y-2">
      {title && <h3 className="text-center text-lg font-semibold text-gray-900">{title}</h3>}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <iframe
          src={embedUrl}
          className="w-full border-0"
          style={{ height: `${height}px` }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title || t('Map')}
        />
      </div>
      {address && (
        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2">
          <p className="text-sm text-gray-700">{address}</p>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {t('Get Directions')}
          </a>
        </div>
      )}
    </div>
  )
}
