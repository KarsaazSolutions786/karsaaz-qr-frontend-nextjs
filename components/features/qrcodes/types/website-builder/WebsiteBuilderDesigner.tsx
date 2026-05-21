'use client'

import React from 'react'
import { BaseDesigner, DesignSettings, DesignerTab } from '../base/BaseDesigner'
import { useTranslation } from '@/lib/i18n'

export interface WebsiteBuilderDesignSettings extends DesignSettings {
  // Website Builder-specific settings
  // Note: Website Builder uses its own WYSIWYG editor, so design settings are minimal
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  faviconUrl?: string
  ogImage?: string
}

interface WebsiteBuilderDesignerProps {
  design: WebsiteBuilderDesignSettings
  onChange: (design: WebsiteBuilderDesignSettings) => void
}

const tabs: DesignerTab[] = [
  { id: 'colors', label: 'Colors', icon: '🎨' },
  { id: 'typography', label: 'Typography', icon: '📝' },
  { id: 'buttons', label: 'Buttons', icon: '🔘' },
  { id: 'layout', label: 'Layout', icon: '📐' },
  { id: 'seo', label: 'SEO', icon: '🔍' },
]

/**
 * Purpose: Executes WebsiteBuilderDesigner functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function WebsiteBuilderDesigner({ design, onChange }: WebsiteBuilderDesignerProps) {
  const { t } = useTranslation()
  /**
   * Purpose: Updates the configuration or state.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const updateDesign = (updates: Partial<WebsiteBuilderDesignSettings>) => {
    onChange({ ...design, ...updates })
  }

  /**
   * Purpose: Executes renderSeoContent functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const renderSeoContent = () => (
    <div className="space-y-6 mt-4 pt-4 border-t">
      <h4 className="font-medium text-gray-900">{t('SEO Settings')}</h4>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Page Title')}</label>
        <input
          type="text"
          value={design.seoTitle || ''}
          onChange={e => updateDesign({ seoTitle: e.target.value })}
          placeholder={t('Enter page title for SEO')}
          className="w-full px-3 py-2 border rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">{t('Recommended: 50-60 characters')}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Meta Description')}</label>
        <textarea
          value={design.seoDescription || ''}
          onChange={e => updateDesign({ seoDescription: e.target.value })}
          placeholder={t('Enter meta description for SEO')}
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">{t('Recommended: 150-160 characters')}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Keywords')}</label>
        <input
          type="text"
          value={design.seoKeywords || ''}
          onChange={e => updateDesign({ seoKeywords: e.target.value })}
          placeholder="keyword1, keyword2, keyword3"
          className="w-full px-3 py-2 border rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">{t('Separate keywords with commas')}</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Favicon URL')}</label>
        <input
          type="url"
          value={design.faviconUrl || ''}
          onChange={e => updateDesign({ faviconUrl: e.target.value })}
          placeholder="https://example.com/favicon.ico"
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('Open Graph Image URL')}</label>
        <input
          type="url"
          value={design.ogImage || ''}
          onChange={e => updateDesign({ ogImage: e.target.value })}
          placeholder="https://example.com/og-image.jpg"
          className="w-full px-3 py-2 border rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">
          {t('Used when sharing on social media. Recommended: 1200x630 pixels')}
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>{t('Note')}:</strong> {t('The Website Builder uses its own WYSIWYG editor for page design. Use the Website Builder tool to create and edit your page content.')}
        </p>
      </div>
    </div>
  )

  return (
    <BaseDesigner design={design} onChange={onChange} tabs={tabs}>
      {renderSeoContent()}
    </BaseDesigner>
  )
}

export default WebsiteBuilderDesigner
