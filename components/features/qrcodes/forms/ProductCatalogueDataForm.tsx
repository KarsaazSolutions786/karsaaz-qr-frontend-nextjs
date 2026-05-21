'use client'
import { useQRFormWatch } from '@/lib/hooks/useQRFormWatch'
import { useTranslation } from '@/lib/i18n'
import { productCatalogueDataSchema } from '@/lib/validations/qrcode'
import { z } from 'zod'
import { useState } from 'react'
import { Plus, X, ChevronDown, ChevronUp, GripVertical } from 'lucide-react'

const INPUT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const SELECT =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition cursor-pointer focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100'
const TEXTAREA =
  'mt-1.5 block w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 bg-white shadow-sm transition placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 min-h-[80px]'
const LABEL = 'block text-sm font-semibold text-gray-700 mb-1'
const ERROR = 'mt-1 text-xs text-red-500'

type ProductCatalogueData = z.infer<typeof productCatalogueDataSchema>

interface ProductCatalogueDataFormProps {
  defaultValues?: Partial<ProductCatalogueData>
  onChange?: (data: Partial<ProductCatalogueData>) => void
}

interface CategoryEntry {
  id: string
  name: string
  description?: string
  image?: string
}



/**
 * Purpose: Executes ProductCatalogueDataForm functionality.
 * Owner/Author: Syed Ashhad
 * Created: February 2026
 * Last Editor: Syed Ashhad
 * Last Updated: March 2026
 */
export function ProductCatalogueDataForm({
  defaultValues,
  onChange,
}: ProductCatalogueDataFormProps) {
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
  } = useQRFormWatch<ProductCatalogueData>({
    schema: productCatalogueDataSchema,
    defaultValues,
    onChange,
  })

  const [categories, setCategories] = useState<CategoryEntry[]>(
    (defaultValues as any)?.categories || []
  )
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  /**
   * Purpose: Executes generateId functionality.
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  const generateId = () => Math.random().toString(36).substring(2, 9)

  /**
   * Purpose: Executes toggleCategory functionality.
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  /**
   * Purpose: Executes addCategory functionality.
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  const addCategory = () => {
    const newCat: CategoryEntry = {
      id: generateId(),
      name: '',
      description: '',
    }
    const updated = [...categories, newCat]
    setCategories(updated)
    setExpandedCategories(prev => new Set(prev).add(newCat.id))
    onChange?.({ ...(defaultValues as any), categories: updated })
  }

  /**
   * Purpose: Deletes the specified resource.
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  const removeCategory = (id: string) => {
    const updated = categories.filter(c => c.id !== id)
    setCategories(updated)
    onChange?.({ ...(defaultValues as any), categories: updated })
  }

  /**
   * Purpose: Updates the configuration or state.
   * Owner/Author: Syed Ashhad
   * Created: February 2026
   * Last Editor: Syed Ashhad
   * Last Updated: March 2026
   */
  const updateCategory = (id: string, field: keyof CategoryEntry, value: string) => {
    const updated = categories.map(c => (c.id === id ? { ...c, [field]: value } : c))
    setCategories(updated)
    onChange?.({ ...(defaultValues as any), categories: updated })
  }

  return (
    <form className="space-y-5">
      {/* Business Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="business_name" className={LABEL}>
            {t('Business Name')} *
          </label>
          <input
            {...register('business_name')}
            id="business_name"
            type="text"
            placeholder={t('My Store')}
            className={INPUT}
          />
          {errors.business_name && <p className={ERROR}>{errors.business_name.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className={LABEL}>
            {t('Phone')}
          </label>
          <input
            {...register('phone')}
            id="phone"
            type="text"
            placeholder="+1 234 567 890"
            className={INPUT}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className={LABEL}>
            {t('Email')}
          </label>
          <input
            {...register('email')}
            id="email"
            type="email"
            placeholder="info@store.com"
            className={INPUT}
          />
          {errors.email && <p className={ERROR}>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="website" className={LABEL}>
            {t('Website')}
          </label>
          <input
            {...register('website')}
            id="website"
            type="url"
            placeholder="https://mystore.com"
            className={INPUT}
          />
          {errors.website && <p className={ERROR}>{errors.website.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="address" className={LABEL}>
          {t('Address')}
        </label>
        <input
          {...register('address')}
          id="address"
          type="text"
          placeholder={t('123 Main Street, City')}
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="maps_url" className={LABEL}>
          {t('Google Maps URL')}
        </label>
        <input
          {...register('maps_url')}
          id="maps_url"
          type="text"
          placeholder={t('Paste Google Maps share link')}
          className={INPUT}
        />
      </div>

      {/* Categories Section */}
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <label className={LABEL}>{t('Product Categories')}</label>
          <button
            type="button"
            onClick={addCategory}
            className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('Add Category')}
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          {t('Organize your products into categories. Products and images are managed in the designer step.')}
        </p>

        {categories.length === 0 && (
          <div className="text-center py-6 text-sm text-gray-400">
            {t('No categories added yet. Click "Add Category" to get started.')}
          </div>
        )}

        <div className="space-y-2">
          {categories.map(category => (
            <div
              key={category.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Category Header */}
              <div className="flex items-center gap-2 p-3">
                <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0 cursor-grab" />
                <button
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="flex-1 flex items-center justify-between text-left"
                >
                  <span className="text-sm font-medium text-gray-800">
                    {category.name || t('Untitled Category')}
                  </span>
                  {expandedCategories.has(category.id) ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => removeCategory(category.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category Details (expanded) */}
              {expandedCategories.has(category.id) && (
                <div className="px-3 pb-3 space-y-3 border-t border-gray-100 pt-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {t('Category Name')} *
                    </label>
                    <input
                      type="text"
                      value={category.name}
                      onChange={e => updateCategory(category.id, 'name', e.target.value)}
                      placeholder={t('e.g., Electronics, Clothing')}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {t('Description')}
                    </label>
                    <textarea
                      value={category.description || ''}
                      onChange={e =>
                        updateCategory(category.id, 'description', e.target.value)
                      }
                      placeholder={t('Optional category description')}
                      rows={2}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Social Profiles */}
      <div>
        <label htmlFor="socialProfiles" className={LABEL}>
          {t('Social Profiles')}
        </label>
        <textarea
          {...register('socialProfiles')}
          id="socialProfiles"
          placeholder={t('One URL per line')}
          className={TEXTAREA}
        />
        <p className="mt-1 text-xs text-gray-500">
          {t('Enter one social media URL per line (Facebook, Instagram, etc.)')}
        </p>
      </div>

      {/* Opening Hours */}
      <div>
        <label htmlFor="opening_hours_enabled" className={LABEL}>
          {t('Opening Hours')}
        </label>
        <select
          {...register('opening_hours_enabled')}
          id="opening_hours_enabled"
          className={SELECT}
        >
          <option value="disabled">{t('Disabled')}</option>
          <option value="enabled">{t('Enabled')}</option>
        </select>
      </div>

      {/* Expiry Date */}
      <div>
        <label htmlFor="expires_at" className={LABEL}>
          {t('Expiry Date')}
        </label>
        <input {...register('expires_at')} id="expires_at" type="date" className={INPUT} />
      </div>
    </form>
  )
}
