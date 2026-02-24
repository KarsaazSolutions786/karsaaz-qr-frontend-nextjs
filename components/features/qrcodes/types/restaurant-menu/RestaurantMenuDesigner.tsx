'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { cn } from '@/lib/utils'

export interface RestaurantMenuDesignSettings extends DesignSettings {
  // Restaurant-specific settings
  menuStyle?: 'grid' | 'list' | 'cards' | 'elegant'
  categoryStyle?: 'tabs' | 'accordion' | 'sidebar' | 'dropdown'
  showImages?: boolean
  imageSize?: 'small' | 'medium' | 'large'
  showPrices?: boolean
  currencySymbol?: string
  currencyPosition?: 'before' | 'after'
  showDescription?: boolean
  showAllergens?: boolean
  showCalories?: boolean
  showSpicyIndicator?: boolean
  showVegetarianIndicator?: boolean
  headerImage?: string
  logoPosition?: 'left' | 'center' | 'right'
  showOpeningHours?: boolean
  showContactInfo?: boolean
  accentColor?: string
  cardBackgroundColor?: string
  priceColor?: string
  categoryBackgroundColor?: string
}

interface RestaurantMenuDesignerProps {
  design: RestaurantMenuDesignSettings
  onChange: (design: RestaurantMenuDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'menu', label: 'Menu Options', icon: '🍽️' },
  { id: 'display', label: 'Display', icon: '👁️' },
]

export function RestaurantMenuDesigner({ design, onChange }: RestaurantMenuDesignerProps) {
  const updateDesign = (updates: Partial<RestaurantMenuDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  const renderMenuOptionsContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Menu Layout</h4>

      {/* Menu Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Menu Style</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'grid', label: 'Grid' },
            { value: 'list', label: 'List' },
            { value: 'cards', label: 'Cards' },
            { value: 'elegant', label: 'Elegant' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  menuStyle: option.value as RestaurantMenuDesignSettings['menuStyle'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.menuStyle === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category Navigation</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'tabs', label: 'Tabs' },
            { value: 'accordion', label: 'Accordion' },
            { value: 'sidebar', label: 'Sidebar' },
            { value: 'dropdown', label: 'Dropdown' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  categoryStyle: option.value as RestaurantMenuDesignSettings['categoryStyle'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.categoryStyle === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logo Position */}
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
                  logoPosition: option.value as RestaurantMenuDesignSettings['logoPosition'],
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

      {/* Image Settings */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showImages"
            checked={design.showImages ?? true}
            onChange={e => updateDesign({ showImages: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showImages" className="text-sm text-gray-700">
            Show Item Images
          </label>
        </div>

        {design.showImages && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image Size</label>
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
                      imageSize: option.value as RestaurantMenuDesignSettings['imageSize'],
                    })
                  }
                  className={cn(
                    'px-3 py-2 border rounded-lg text-sm',
                    design.imageSize === option.value
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

      {/* Currency Settings */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showPrices"
            checked={design.showPrices ?? true}
            onChange={e => updateDesign({ showPrices: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showPrices" className="text-sm text-gray-700">
            Show Prices
          </label>
        </div>

        {design.showPrices && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={design.currencySymbol || '$'}
                onChange={e => updateDesign({ currencySymbol: e.target.value })}
                placeholder="$"
                className="w-24 px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency Position
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'before', label: '$10.00' },
                  { value: 'after', label: '10.00$' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() =>
                      updateDesign({
                        currencyPosition:
                          option.value as RestaurantMenuDesignSettings['currencyPosition'],
                      })
                    }
                    className={cn(
                      'px-3 py-2 border rounded-lg text-sm',
                      design.currencyPosition === option.value
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={design.priceColor || '#10b981'}
                  onChange={e => updateDesign({ priceColor: e.target.value })}
                  className="h-10 w-16 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={design.priceColor || '#10b981'}
                  onChange={e => updateDesign({ priceColor: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )

  const renderDisplayContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Display Options</h4>

      {/* Item Information */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showDescription"
            checked={design.showDescription ?? true}
            onChange={e => updateDesign({ showDescription: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showDescription" className="text-sm text-gray-700">
            Show Item Descriptions
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showAllergens"
            checked={design.showAllergens ?? true}
            onChange={e => updateDesign({ showAllergens: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showAllergens" className="text-sm text-gray-700">
            Show Allergen Information
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showCalories"
            checked={design.showCalories ?? false}
            onChange={e => updateDesign({ showCalories: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showCalories" className="text-sm text-gray-700">
            Show Calorie Information
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showSpicyIndicator"
            checked={design.showSpicyIndicator ?? true}
            onChange={e => updateDesign({ showSpicyIndicator: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showSpicyIndicator" className="text-sm text-gray-700">
            Show Spicy Indicator
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showVegetarianIndicator"
            checked={design.showVegetarianIndicator ?? true}
            onChange={e => updateDesign({ showVegetarianIndicator: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showVegetarianIndicator" className="text-sm text-gray-700">
            Show Vegetarian/Vegan Indicator
          </label>
        </div>
      </div>

      {/* Restaurant Information */}
      <div className="space-y-2">
        <h5 className="text-sm font-medium text-gray-700">Restaurant Info</h5>

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
      </div>

      {/* Additional Colors */}
      <div className="space-y-4">
        <h5 className="text-sm font-medium text-gray-700">Additional Colors</h5>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.accentColor || '#f59e0b'}
              onChange={e => updateDesign({ accentColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.accentColor || '#f59e0b'}
              onChange={e => updateDesign({ accentColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Background
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.categoryBackgroundColor || '#f3f4f6'}
              onChange={e => updateDesign({ categoryBackgroundColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.categoryBackgroundColor || '#f3f4f6'}
              onChange={e => updateDesign({ categoryBackgroundColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <BaseDesigner design={design} onChange={onChange} tabs={tabs}>
      {renderMenuOptionsContent()}
      {renderDisplayContent()}
    </BaseDesigner>
  )
}

export default RestaurantMenuDesigner
