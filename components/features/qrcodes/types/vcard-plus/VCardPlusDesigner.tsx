'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { cn } from '@/lib/utils'

export interface VCardPlusDesignSettings extends DesignSettings {
  // VCard-specific settings
  businessType?: string
  secondBackgroundColor?: string
  addContactButtonColor?: string
  addContactButtonTextColor?: string
  addContactButtonStyle?: 'floating' | 'classic'
  addContactButtonText?: string
  addContactButtonPosition?: 'top-section' | 'bottom-section' | 'both'
  socialIconsPosition?: 'below_contact_icons' | 'above_portfolio'
  qrcodePreference?: 'show' | 'logo' | 'none'
  logoBackground?: 'round' | 'square' | 'none'
  contactsSettings?: 'details' | 'icons' | 'both'
  shareOnWhatsapp?: 'enabled' | 'disabled'
  gradientEffect?: 'enabled' | 'disabled'
  portfolioSectionTitle?: string
  portfolioSectionTitleColor?: string
}

interface VCardPlusDesignerProps {
  design: VCardPlusDesignSettings
  onChange: (design: VCardPlusDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'page', label: 'Page Settings', icon: '⚙️' },
  { id: 'portfolio', label: 'Portfolio', icon: '🖼️' },
]

const businessTypes = [
  { value: 'bakery', label: 'Bakery' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'barber', label: 'Barber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'builder', label: 'Builder' },
  { value: 'gardener', label: 'Gardener / Landscaper' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'mechanic', label: 'Mechanic' },
  { value: 'garage', label: 'Garage' },
  { value: 'joiner', label: 'Joiner / Carpenter' },
  { value: 'car-valeter', label: 'Car Valeter / Detailer' },
  { value: 'painter', label: 'Painter / Decorator' },
  { value: 'plasterer', label: 'Plasterer' },
  { value: 'cleaner', label: 'Cleaner' },
  { value: 'roofer', label: 'Roofer' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'solicitor', label: 'Lawyer / Solicitors' },
  { value: 'other', label: 'Other' },
]

export function VCardPlusDesigner({ design, onChange }: VCardPlusDesignerProps) {
  const updateDesign = (updates: Partial<VCardPlusDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  const renderPageSettingsContent = () => (
    <div className="space-y-4 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Page Settings</h4>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
        <p className="text-xs text-gray-500 mb-2">Allows us to pick some colors for you</p>
        <select
          value={design.businessType || 'other'}
          onChange={e => updateDesign({ businessType: e.target.value })}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {businessTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Show QR Code</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'show', label: 'Show QR Code' },
            { value: 'logo', label: 'Show Logo' },
            { value: 'none', label: 'None' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  qrcodePreference: option.value as VCardPlusDesignSettings['qrcodePreference'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.qrcodePreference === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {design.qrcodePreference === 'logo' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo Background</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'round', label: 'Round' },
              { value: 'square', label: 'Square' },
              { value: 'none', label: 'None' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() =>
                  updateDesign({
                    logoBackground: option.value as VCardPlusDesignSettings['logoBackground'],
                  })
                }
                className={cn(
                  'px-3 py-2 border rounded-lg text-sm',
                  design.logoBackground === option.value
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Contacts Settings</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'details', label: 'Show Details' },
            { value: 'icons', label: 'Show Icons' },
            { value: 'both', label: 'Show Both' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  contactsSettings: option.value as VCardPlusDesignSettings['contactsSettings'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.contactsSettings === option.value
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Share on WhatsApp</label>
        <div className="flex gap-2">
          {[
            { value: 'enabled', label: 'Enabled' },
            { value: 'disabled', label: 'Disabled' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  shareOnWhatsapp: option.value as VCardPlusDesignSettings['shareOnWhatsapp'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.shareOnWhatsapp === option.value
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Gradient Effect</label>
        <div className="flex gap-2">
          {[
            { value: 'enabled', label: 'Enabled' },
            { value: 'disabled', label: 'Disabled' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  gradientEffect: option.value as VCardPlusDesignSettings['gradientEffect'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.gradientEffect === option.value
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

  const renderAddContactButtonContent = () => (
    <div className="space-y-4 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Add to Contact Button</h4>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Button Style</label>
        <div className="flex gap-2">
          {[
            { value: 'floating', label: 'Floating' },
            { value: 'classic', label: 'Classic (with text)' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  addContactButtonStyle:
                    option.value as VCardPlusDesignSettings['addContactButtonStyle'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.addContactButtonStyle === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {design.addContactButtonStyle === 'classic' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={design.addContactButtonText || 'Add to Contacts'}
              onChange={e => updateDesign({ addContactButtonText: e.target.value })}
              placeholder="Add to Contacts"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Button Position</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'top-section', label: 'Top Section' },
                { value: 'bottom-section', label: 'Bottom Section' },
                { value: 'both', label: 'Both' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateDesign({
                      addContactButtonPosition:
                        option.value as VCardPlusDesignSettings['addContactButtonPosition'],
                    })
                  }
                  className={cn(
                    'px-3 py-2 border rounded-lg text-sm',
                    design.addContactButtonPosition === option.value
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Button Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={design.addContactButtonColor || '#3b82f6'}
            onChange={e => updateDesign({ addContactButtonColor: e.target.value })}
            className="h-10 w-16 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={design.addContactButtonColor || '#3b82f6'}
            onChange={e => updateDesign({ addContactButtonColor: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {design.addContactButtonStyle === 'classic' ? 'Text Color' : 'Icon Color'}
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={design.addContactButtonTextColor || '#ffffff'}
            onChange={e => updateDesign({ addContactButtonTextColor: e.target.value })}
            className="h-10 w-16 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={design.addContactButtonTextColor || '#ffffff'}
            onChange={e => updateDesign({ addContactButtonTextColor: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
    </div>
  )

  const renderPortfolioContent = () => (
    <div className="space-y-4 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Portfolio & Products</h4>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
        <input
          type="text"
          value={design.portfolioSectionTitle || ''}
          onChange={e => updateDesign({ portfolioSectionTitle: e.target.value })}
          placeholder="Portfolio"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={design.portfolioSectionTitleColor || '#111827'}
            onChange={e => updateDesign({ portfolioSectionTitleColor: e.target.value })}
            className="h-10 w-16 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={design.portfolioSectionTitleColor || '#111827'}
            onChange={e => updateDesign({ portfolioSectionTitleColor: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Social Icons Position
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'below_contact_icons', label: 'Below contact icons' },
            { value: 'above_portfolio', label: 'Between portfolio and contact cards' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  socialIconsPosition:
                    option.value as VCardPlusDesignSettings['socialIconsPosition'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.socialIconsPosition === option.value
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

  const renderAdditionalColors = () => (
    <div className="space-y-4 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Additional Colors</h4>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Second Background Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={design.secondBackgroundColor || '#f3f4f6'}
            onChange={e => updateDesign({ secondBackgroundColor: e.target.value })}
            className="h-10 w-16 rounded border cursor-pointer"
          />
          <input
            type="text"
            value={design.secondBackgroundColor || '#f3f4f6'}
            onChange={e => updateDesign({ secondBackgroundColor: e.target.value })}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
    </div>
  )

  return (
    <BaseDesigner design={design} onChange={onChange} tabs={tabs}>
      {renderAdditionalColors()}
      {renderAddContactButtonContent()}
      {renderPageSettingsContent()}
      {renderPortfolioContent()}
    </BaseDesigner>
  )
}

export default VCardPlusDesigner
