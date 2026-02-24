'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { cn } from '@/lib/utils'

export interface BusinessProfileDesignSettings extends DesignSettings {
  // Business Profile-specific settings
  profileLayout?: 'classic' | 'modern' | 'minimal' | 'card'
  showLogo?: boolean
  logoPosition?: 'left' | 'center' | 'right'
  logoSize?: 'small' | 'medium' | 'large'
  showContactInfo?: boolean
  contactDisplayStyle?: 'icons' | 'details' | 'both'
  showSocialLinks?: boolean
  socialIconsStyle?: 'filled' | 'outline' | 'minimal'
  showOpeningHours?: boolean
  showMap?: boolean
  mapStyle?: 'standard' | 'satellite' | 'dark'
  showPortfolio?: boolean
  portfolioLayout?: 'grid' | 'carousel' | 'masonry'
  portfolioSectionTitle?: string
  showReviewSites?: boolean
  showLeadForm?: boolean
  leadFormPosition?: 'inline' | 'popup' | 'bottom'
  cardBackgroundColor?: string
  cardBorderRadius?: number
  accentColor?: string
}

interface BusinessProfileDesignerProps {
  design: BusinessProfileDesignSettings
  onChange: (design: BusinessProfileDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'profile', label: 'Profile', icon: '🏢' },
  { id: 'sections', label: 'Sections', icon: '📋' },
]

export function BusinessProfileDesigner({ design, onChange }: BusinessProfileDesignerProps) {
  const updateDesign = (updates: Partial<BusinessProfileDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  const renderProfileOptionsContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Profile Layout</h4>

      {/* Profile Layout Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Layout Style</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'classic', label: 'Classic' },
            { value: 'modern', label: 'Modern' },
            { value: 'minimal', label: 'Minimal' },
            { value: 'card', label: 'Card' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  profileLayout: option.value as BusinessProfileDesignSettings['profileLayout'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.profileLayout === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logo Settings */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showLogo"
            checked={design.showLogo ?? true}
            onChange={e => updateDesign({ showLogo: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showLogo" className="text-sm text-gray-700">
            Show Logo
          </label>
        </div>

        {design.showLogo && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo Position</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() =>
                      updateDesign({
                        logoPosition: option.value as BusinessProfileDesignSettings['logoPosition'],
                      })
                    }
                    className={cn(
                      'px-3 py-2 border rounded-lg text-sm',
                      design.logoPosition === option.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo Size</label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() =>
                      updateDesign({
                        logoSize: option.value as BusinessProfileDesignSettings['logoSize'],
                      })
                    }
                    className={cn(
                      'px-3 py-2 border rounded-lg text-sm',
                      design.logoSize === option.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Contact Display */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showContactInfo"
            checked={design.showContactInfo ?? true}
            onChange={e => updateDesign({ showContactInfo: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showContactInfo" className="text-sm text-gray-700">
            Show Contact Information
          </label>
        </div>

        {design.showContactInfo && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Display Style
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'icons', label: 'Icons Only' },
                { value: 'details', label: 'Details Only' },
                { value: 'both', label: 'Icons & Details' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateDesign({
                      contactDisplayStyle:
                        option.value as BusinessProfileDesignSettings['contactDisplayStyle'],
                    })
                  }
                  className={cn(
                    'px-3 py-2 border rounded-lg text-sm',
                    design.contactDisplayStyle === option.value
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
      </div>

      {/* Additional Colors */}
      <div className="space-y-4">
        <h5 className="text-sm font-medium text-gray-700">Card Styling</h5>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Background</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.cardBackgroundColor || '#ffffff'}
              onChange={e => updateDesign({ cardBackgroundColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.cardBackgroundColor || '#ffffff'}
              onChange={e => updateDesign({ cardBackgroundColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.accentColor || '#3b82f6'}
              onChange={e => updateDesign({ accentColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.accentColor || '#3b82f6'}
              onChange={e => updateDesign({ accentColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderSectionsContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Page Sections</h4>

      {/* Social Links */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showSocialLinks"
            checked={design.showSocialLinks ?? true}
            onChange={e => updateDesign({ showSocialLinks: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showSocialLinks" className="text-sm text-gray-700">
            Show Social Links
          </label>
        </div>

        {design.showSocialLinks && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Social Icons Style
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'filled', label: 'Filled' },
                { value: 'outline', label: 'Outline' },
                { value: 'minimal', label: 'Minimal' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateDesign({
                      socialIconsStyle:
                        option.value as BusinessProfileDesignSettings['socialIconsStyle'],
                    })
                  }
                  className={cn(
                    'px-3 py-2 border rounded-lg text-sm',
                    design.socialIconsStyle === option.value
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
      </div>

      {/* Opening Hours */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showOpeningHours"
          checked={design.showOpeningHours ?? true}
          onChange={e => updateDesign({ showOpeningHours: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="showOpeningHours" className="text-sm text-gray-700">
          Show Opening Hours
        </label>
      </div>

      {/* Map */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showMap"
            checked={design.showMap ?? true}
            onChange={e => updateDesign({ showMap: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showMap" className="text-sm text-gray-700">
            Show Map
          </label>
        </div>

        {design.showMap && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Map Style</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'standard', label: 'Standard' },
                { value: 'satellite', label: 'Satellite' },
                { value: 'dark', label: 'Dark' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateDesign({
                      mapStyle: option.value as BusinessProfileDesignSettings['mapStyle'],
                    })
                  }
                  className={cn(
                    'px-3 py-2 border rounded-lg text-sm',
                    design.mapStyle === option.value
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
      </div>

      {/* Portfolio */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showPortfolio"
            checked={design.showPortfolio ?? true}
            onChange={e => updateDesign({ showPortfolio: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showPortfolio" className="text-sm text-gray-700">
            Show Portfolio Section
          </label>
        </div>

        {design.showPortfolio && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
              <input
                type="text"
                value={design.portfolioSectionTitle || 'Our Products'}
                onChange={e => updateDesign({ portfolioSectionTitle: e.target.value })}
                placeholder="Our Products"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio Layout
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'grid', label: 'Grid' },
                  { value: 'carousel', label: 'Carousel' },
                  { value: 'masonry', label: 'Masonry' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() =>
                      updateDesign({
                        portfolioLayout:
                          option.value as BusinessProfileDesignSettings['portfolioLayout'],
                      })
                    }
                    className={cn(
                      'px-3 py-2 border rounded-lg text-sm',
                      design.portfolioLayout === option.value
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-300'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Review Sites */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showReviewSites"
          checked={design.showReviewSites ?? false}
          onChange={e => updateDesign({ showReviewSites: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="showReviewSites" className="text-sm text-gray-700">
          Show Review Sites
        </label>
      </div>

      {/* Lead Form */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showLeadForm"
            checked={design.showLeadForm ?? false}
            onChange={e => updateDesign({ showLeadForm: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showLeadForm" className="text-sm text-gray-700">
            Show Lead Form
          </label>
        </div>

        {design.showLeadForm && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Form Position</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'inline', label: 'Inline' },
                { value: 'popup', label: 'Popup' },
                { value: 'bottom', label: 'Bottom' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateDesign({
                      leadFormPosition:
                        option.value as BusinessProfileDesignSettings['leadFormPosition'],
                    })
                  }
                  className={cn(
                    'px-3 py-2 border rounded-lg text-sm',
                    design.leadFormPosition === option.value
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
      </div>
    </div>
  )

  return (
    <BaseDesigner design={design} onChange={onChange} tabs={tabs}>
      {renderProfileOptionsContent()}
      {renderSectionsContent()}
    </BaseDesigner>
  )
}

export default BusinessProfileDesigner
