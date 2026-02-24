'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { cn } from '@/lib/utils'

export interface ProductCatalogueDesignSettings extends DesignSettings {
  // Product Catalogue-specific settings
  catalogueName?: string
  catalogueNameFontSize?: number
  categoryLayout?: 'tabs' | 'accordion' | 'sidebar' | 'grid'
  productLayout?: 'grid' | 'list' | 'cards'
  productColumns?: 2 | 3 | 4
  showProductImage?: 'always' | 'only-if-uploaded' | 'do-not-show-images'
  imageSize?: 'small' | 'medium' | 'large'
  imageAspectRatio?: 'square' | '4:3' | '16:9' | 'original'
  showProductPrice?: boolean
  showProductDescription?: boolean
  currencySymbol?: string
  currencyPosition?: 'before' | 'after'
  priceColor?: string
  productButtonTarget?: 'self' | '_blank'
  productButtonText?: string
  productButtonColor?: string
  productButtonTextColor?: string
  showReviewSites?: boolean
  cardBackgroundColor?: string
  cardBorderRadius?: number
  categoryBackgroundColor?: string
  categoryTextColor?: string
}

interface ProductCatalogueDesignerProps {
  design: ProductCatalogueDesignSettings
  onChange: (design: ProductCatalogueDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'catalogue', label: 'Catalogue', icon: '📦' },
  { id: 'products', label: 'Products', icon: '🛍️' },
]

export function ProductCatalogueDesigner({ design, onChange }: ProductCatalogueDesignerProps) {
  const updateDesign = (updates: Partial<ProductCatalogueDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  const renderCatalogueOptionsContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Catalogue Settings</h4>

      {/* Catalogue Name */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catalogue Name</label>
          <input
            type="text"
            value={design.catalogueName || ''}
            onChange={e => updateDesign({ catalogueName: e.target.value })}
            placeholder="Our Catalogue"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name Font Size: {design.catalogueNameFontSize || 24}px
          </label>
          <input
            type="range"
            value={design.catalogueNameFontSize || 24}
            onChange={e => updateDesign({ catalogueNameFontSize: parseInt(e.target.value) })}
            min="14"
            max="48"
            className="w-full"
          />
        </div>
      </div>

      {/* Category Layout */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category Layout</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'tabs', label: 'Tabs' },
            { value: 'accordion', label: 'Accordion' },
            { value: 'sidebar', label: 'Sidebar' },
            { value: 'grid', label: 'Grid' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  categoryLayout: option.value as ProductCatalogueDesignSettings['categoryLayout'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.categoryLayout === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Colors */}
      <div className="space-y-3">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Text Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.categoryTextColor || '#1f2937'}
              onChange={e => updateDesign({ categoryTextColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.categoryTextColor || '#1f2937'}
              onChange={e => updateDesign({ categoryTextColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
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
    </div>
  )

  const renderProductsContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">Product Display</h4>

      {/* Product Layout */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Product Layout</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'grid', label: 'Grid' },
            { value: 'list', label: 'List' },
            { value: 'cards', label: 'Cards' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() =>
                updateDesign({
                  productLayout: option.value as ProductCatalogueDesignSettings['productLayout'],
                })
              }
              className={cn(
                'px-3 py-2 border rounded-lg text-sm',
                design.productLayout === option.value
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Columns */}
      {design.productLayout === 'grid' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Grid Columns</label>
          <div className="flex flex-wrap gap-2">
            {[2, 3, 4].map(cols => (
              <button
                key={cols}
                onClick={() =>
                  updateDesign({
                    productColumns: cols as ProductCatalogueDesignSettings['productColumns'],
                  })
                }
                className={cn(
                  'px-3 py-2 border rounded-lg text-sm',
                  design.productColumns === cols
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300'
                )}
              >
                {cols} Columns
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Settings */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Show Product Images
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'always', label: 'Always' },
              { value: 'only-if-uploaded', label: 'Only if Uploaded' },
              { value: 'do-not-show-images', label: 'Do Not Show' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() =>
                  updateDesign({
                    showProductImage:
                      option.value as ProductCatalogueDesignSettings['showProductImage'],
                  })
                }
                className={cn(
                  'px-3 py-2 border rounded-lg text-sm',
                  design.showProductImage === option.value
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {design.showProductImage !== 'do-not-show-images' && (
          <>
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
                        imageSize: option.value as ProductCatalogueDesignSettings['imageSize'],
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Aspect Ratio
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'square', label: '1:1' },
                  { value: '4:3', label: '4:3' },
                  { value: '16:9', label: '16:9' },
                  { value: 'original', label: 'Original' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() =>
                      updateDesign({
                        imageAspectRatio:
                          option.value as ProductCatalogueDesignSettings['imageAspectRatio'],
                      })
                    }
                    className={cn(
                      'px-3 py-2 border rounded-lg text-sm',
                      design.imageAspectRatio === option.value
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

      {/* Display Options */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showProductPrice"
            checked={design.showProductPrice ?? true}
            onChange={e => updateDesign({ showProductPrice: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showProductPrice" className="text-sm text-gray-700">
            Show Product Price
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showProductDescription"
            checked={design.showProductDescription ?? true}
            onChange={e => updateDesign({ showProductDescription: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="showProductDescription" className="text-sm text-gray-700">
            Show Product Description
          </label>
        </div>
      </div>

      {/* Price Settings */}
      {design.showProductPrice && (
        <div className="space-y-3">
          <h5 className="text-sm font-medium text-gray-700">Price Settings</h5>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency Symbol
              </label>
              <input
                type="text"
                value={design.currencySymbol || '$'}
                onChange={e => updateDesign({ currencySymbol: e.target.value })}
                placeholder="$"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <div className="flex gap-1">
                {[
                  { value: 'before', label: '$10' },
                  { value: 'after', label: '10$' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() =>
                      updateDesign({
                        currencyPosition:
                          option.value as ProductCatalogueDesignSettings['currencyPosition'],
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
        </div>
      )}

      {/* Product Button */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-gray-700">Product Button</h5>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Open Link In</label>
          <div className="flex gap-2">
            {[
              { value: 'self', label: 'Same Window' },
              { value: '_blank', label: 'New Window' },
            ].map(option => (
              <button
                key={option.value}
                onClick={() =>
                  updateDesign({
                    productButtonTarget:
                      option.value as ProductCatalogueDesignSettings['productButtonTarget'],
                  })
                }
                className={cn(
                  'px-3 py-2 border rounded-lg text-sm',
                  design.productButtonTarget === option.value
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
          <input
            type="text"
            value={design.productButtonText || 'Order Now'}
            onChange={e => updateDesign({ productButtonText: e.target.value })}
            placeholder="Order Now"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.productButtonColor || '#3b82f6'}
              onChange={e => updateDesign({ productButtonColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.productButtonColor || '#3b82f6'}
              onChange={e => updateDesign({ productButtonColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Button Text Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={design.productButtonTextColor || '#ffffff'}
              onChange={e => updateDesign({ productButtonTextColor: e.target.value })}
              className="h-10 w-16 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={design.productButtonTextColor || '#ffffff'}
              onChange={e => updateDesign({ productButtonTextColor: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Card Styling */}
      <div className="space-y-3">
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
      </div>
    </div>
  )

  return (
    <BaseDesigner design={design} onChange={onChange} tabs={tabs}>
      {renderCatalogueOptionsContent()}
      {renderProductsContent()}
    </BaseDesigner>
  )
}

export default ProductCatalogueDesigner
