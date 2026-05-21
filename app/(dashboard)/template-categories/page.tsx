'use client'

import Link from 'next/link'
import { useTemplateCategories, useDeleteTemplateCategory } from '@/lib/hooks/queries/useTemplates'
import { useTranslation } from '@/lib/i18n'
import { LottieLoader } from '@/components/ui/lottie-loader'

/**
 * Purpose: Executes TemplateCategoriesPage functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export default function TemplateCategoriesPage() {
  const { t } = useTranslation()
  // TanStack Query hooks
  const { data: categories = [], isLoading: loading } = useTemplateCategories()
  const deleteMutation = useDeleteTemplateCategory()

  /**
   * Purpose: Executes handleDelete functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleDelete = async (id: number) => {
    if (!confirm(t('Delete this category?'))) return
    try {
      await deleteMutation.mutateAsync(id)
    } catch { /* error */ }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('Template Categories')}</h1>
          <p className="mt-1 text-sm text-gray-600">{t('Organize QR code templates into categories.')}</p>
        </div>
        <Link
          href="/template-categories/new"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {t('Create Category')}
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <LottieLoader size={80} />
        </div>
      ) : categories.length === 0 ? (
        <div className="mt-8 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-sm font-medium text-gray-900">{t('No categories')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('Create a category to organize your templates.')}</p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t('Name')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">{t('Sort Order')}</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">{t('Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{cat.id}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {cat.textColor && (
                      <span
                        className="mr-2 inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: cat.textColor }}
                      />
                    )}
                    {cat.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{cat.sort_order ?? '\u2014'}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <Link href={`/template-categories/${cat.id}`} className="mr-3 font-medium text-indigo-600 hover:text-indigo-500">
                      {t('Edit')}
                    </Link>
                    <button onClick={() => handleDelete(cat.id)} className="font-medium text-red-600 hover:text-red-500">
                      {t('Delete')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
