'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

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

const getBusinessTypes = (t: (key: string) => string) => [
  { value: 'bakery', label: t('Bakery') },
  { value: 'healthcare', label: t('Healthcare') },
  { value: 'restaurant', label: t('Restaurant') },
  { value: 'plumber', label: t('Plumber') },
  { value: 'barber', label: t('Barber') },
  { value: 'electrician', label: t('Electrician') },
  { value: 'builder', label: t('Builder') },
  { value: 'gardener', label: t('Gardener / Landscaper') },
  { value: 'cafe', label: t('Cafe') },
  { value: 'mechanic', label: t('Mechanic') },
  { value: 'garage', label: t('Garage') },
  { value: 'joiner', label: t('Joiner / Carpenter') },
  { value: 'car-valeter', label: t('Car Valeter / Detailer') },
  { value: 'painter', label: t('Painter / Decorator') },
  { value: 'plasterer', label: t('Plasterer') },
  { value: 'cleaner', label: t('Cleaner') },
  { value: 'roofer', label: t('Roofer') },
  { value: 'accountant', label: t('Accountant') },
  { value: 'solicitor', label: t('Lawyer / Solicitors') },
  { value: 'other', label: t('Other') },
]

export function VCardPlusDesigner({ design, onChange }: VCardPlusDesignerProps) {
  const { t } = useTranslation()
  const businessTypes = getBusinessTypes(t)
  const updateDesign = (updates: Partial<VCardPlusDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  const renderPageSettingsContent = () => (
    <div className="space-y-4 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">{t('Page Settings')}</h4>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Business Type')}</label>
        <p className="text-xs text-gray-500 mb-2">{t('Allows us to pick some colors for you')}</p>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Show QR Code')}</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'show', label: t('Show QR Code') },
            { value: 'logo', label: t('Show Logo') },
            { value: 'none', label: t('None') },
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
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('Logo Background')}</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'round', label: t('Round') },
              { value: 'square', label: t('Square') },
              { value: 'none', label: t('None') },
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
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Contacts Settings')}</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'details', label: t('Show Details') },
            { value: 'icons', label: t('Show Icons') },
            { value: 'both', label: t('Show Both') },
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
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Share on WhatsApp')}</label>
        <div className="flex gap-2">
          {[
            { value: 'enabled', label: t('Enabled') },
            { value: 'disabled', label: t('Disabled') },
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
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Gradient Effect')}</label>
        <div className="flex gap-2">
          {[
            { value: 'enabled', label: t('Enabled') },
            { value: 'disabled', label: t('Disabled') },
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
      <h4 className="font-medium text-gray-900">{t('Add to Contact Button')}</h4>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t('Button Style')}</label>
        <div className="flex gap-2">
          {[
            { value: 'floating', label: t('Floating') },
            { value: 'classic', label: t('Classic (with text)') },
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
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('Button Text')}</label>
            <input
              type="text"
              value={design.addContactButtonText || t('Add to Contacts')}
              onChange={e => updateDesign({ addContactButtonText: e.target.value })}
              placeholder={t('Add to Contacts')}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('Button Position')}</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'top-section', label: t('Top Section') },
                { value: 'bottom-section', label: t('Bottom Section') },
                { value: 'both', label: t('Both') },
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
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Button Color')}</label>
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
          {design.addContactButtonStyle === 'classic' ? t('Text Color') : t('Icon Color')}
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
      <h4 className="font-medium text-gray-900">{t('Portfolio & Products')}</h4>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Section Title')}</label>
        <input
          type="text"
          value={design.portfolioSectionTitle || ''}
          onChange={e => updateDesign({ portfolioSectionTitle: e.target.value })}
          placeholder={t('Portfolio')}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Title Color')}</label>
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
          {t('Social Icons Position')}
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'below_contact_icons', label: t('Below contact icons') },
            { value: 'above_portfolio', label: t('Between portfolio and contact cards') },
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
      <h4 className="font-medium text-gray-900">{t('Additional Colors')}</h4>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t('Second Background Color')}
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
