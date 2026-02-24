'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { cn } from '@/lib/utils'

export interface AppDownloadDesignSettings extends DesignSettings {
  // App Download-specific settings
  showAppStoreButtons?: boolean
  appStoreBadgeStyle?: 'black' | 'white' | 'custom'
  showAppDescription?: boolean
  showAppScreenshots?: boolean
  screenshotLayout?: 'carousel' | 'grid' | 'stack'
  showAppRating?: boolean
  showAppSize?: boolean
  showAppVersion?: boolean
  downloadButtonColor?: string
  downloadButtonTextColor?: string
  downloadButtonText?: string
  appIconStyle?: 'rounded' | 'square' | 'circle'
  desktopCustomization?: 'redirect' | 'qrcode' | 'message'
}

interface AppDownloadDesignerProps {
  design: AppDownloadDesignSettings
  onChange: (design: AppDownloadDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'app', label: 'App Options', icon: '📱' },
  { id: 'advanced', label: 'Advanced', icon: '⚙️' },
]

export function AppDownloadDesigner({ design, onChange }: AppDownloadDesignerProps) {
  const updateDesign = (updates: Partial<AppDownloadDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  const renderAppOptionsContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">App Display Options</h4>

      {/* App Store Badge Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          App Store Badge Style
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'black', label: 'Black' },
            { value: 'white', label: 'White' },
            { value: 'custom', label: 'Custom' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  appStoreBadgeStyle:
                    option.value as AppDownloadDesignSettings['appStoreBadgeStyle'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.appStoreBadgeStyle === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* App Icon Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">App Icon Style</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'rounded', label: 'Rounded' },
            { value: 'square', label: 'Square' },
            { value: 'circle', label: 'Circle' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  appIconStyle: option.value as AppDownloadDesignSettings['appIconStyle'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.appIconStyle === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Screenshot Layout */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Screenshot Layout</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'carousel', label: 'Carousel' },
            { value: 'grid', label: 'Grid' },
            { value: 'stack', label: 'Stack' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  screenshotLayout: option.value as AppDownloadDesignSettings['screenshotLayout'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.screenshotLayout === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Display Options */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700">Display Options</h5>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showAppStoreButtons"
            checked={design.showAppStoreButtons ?? true}
            onChange={e => updateDesign({ showAppStoreButtons: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showAppStoreButtons" className="text-sm text-gray-700">
            Show App Store Buttons
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showAppDescription"
            checked={design.showAppDescription ?? true}
            onChange={e => updateDesign({ showAppDescription: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showAppDescription" className="text-sm text-gray-700">
            Show App Description
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showAppScreenshots"
            checked={design.showAppScreenshots ?? true}
            onChange={e => updateDesign({ showAppScreenshots: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showAppScreenshots" className="text-sm text-gray-700">
            Show App Screenshots
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showAppRating"
            checked={design.showAppRating ?? true}
            onChange={e => updateDesign({ showAppRating: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showAppRating" className="text-sm text-gray-700">
            Show App Rating
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showAppSize"
            checked={design.showAppSize ?? false}
            onChange={e => updateDesign({ showAppSize: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showAppSize" className="text-sm text-gray-700">
            Show App Size
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showAppVersion"
            checked={design.showAppVersion ?? false}
            onChange={e => updateDesign({ showAppVersion: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showAppVersion" className="text-sm text-gray-700">
            Show App Version
          </label>
        </div>
      </div>

      {/* Download Button */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-gray-700">Download Button</h5>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
          <input
            type="text"
            value={design.downloadButtonText || 'Download Now'}
            onChange={e => updateDesign({ downloadButtonText: e.target.value })}
            placeholder="Download Now"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Color</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
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

  const renderAdvancedContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Advanced Settings</h4>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Desktop Behavior</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'redirect', label: 'Redirect to App Store' },
            { value: 'qrcode', label: 'Show QR Code' },
            { value: 'message', label: 'Show Message' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  desktopCustomization:
                    option.value as AppDownloadDesignSettings['desktopCustomization'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.desktopCustomization === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <BaseDesigner design={design} onChange={onChange} tabs={tabs}>
      {renderAppOptionsContent()}
      {renderAdvancedContent()}
    </BaseDesigner>
  )
}

export default AppDownloadDesigner
