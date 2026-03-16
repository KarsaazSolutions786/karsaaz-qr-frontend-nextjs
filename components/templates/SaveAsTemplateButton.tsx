'use client'

import { useState } from 'react'
import { Save, Loader2, X } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useCreateTemplate } from '@/lib/hooks/queries/useTemplates'
import { toast } from 'sonner'

interface SaveAsTemplateButtonProps {
  /** The saved QR code ID (required -- QR must be saved first) */
  qrcodeId: string | number
  /** Display name of the QR code (used as default template name) */
  qrcodeName?: string
  /** QR code type label for the preview section */
  qrcodeType?: string
  onSuccess?: () => void
  className?: string
  children?: React.ReactNode
}

/**
 * SaveAsTemplateButton -- Opens a modal to save the current QR code as a
 * reusable template. The backend creates the template by cloning the QR code's
 * data, design, and settings from the referenced `qrcode_id`.
 *
 * Requirements:
 * - The QR code must already be saved (has a valid ID)
 * - Backend route: POST /qrcode-templates { qrcode_id, name, description, ... }
 */
export default function SaveAsTemplateButton({
  qrcodeId,
  qrcodeName,
  qrcodeType,
  onSuccess,
  className = '',
  children,
}: SaveAsTemplateButtonProps) {
  const { t } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template_access_level: 'private' as 'public' | 'private',
  })

  const createTemplateMutation = useCreateTemplate({
    onSuccess: () => {
      toast.success('Template saved successfully!')
      onSuccess?.()
      setIsModalOpen(false)
      setFormData({
        name: '',
        description: '',
        template_access_level: 'private',
      })
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error?.message || 'Failed to save template'
      toast.error(msg)
    },
  })

  const handleSaveTemplate = () => {
    if (!formData.name.trim()) return
    if (!formData.description.trim()) {
      toast.error('Please enter a description for the template.')
      return
    }

    createTemplateMutation.mutate({
      qrcode_id: qrcodeId,
      name: formData.name.trim(),
      description: formData.description.trim(),
      template_access_level: formData.template_access_level,
    })
  }

  const handleOpenModal = () => {
    setFormData({
      name: qrcodeName ? `${qrcodeName} Template` : '',
      description: '',
      template_access_level: 'private',
    })
    setIsModalOpen(true)
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${className}`}
      >
        <Save className="w-4 h-4" />
        {children || t('Save as Template')}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-lg w-full mx-4 rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('Save as Template')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={createTemplateMutation.isPending}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Context preview */}
            {qrcodeType && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">{t('Creating template from')}</p>
                <p className="text-sm font-medium text-gray-900">
                  {qrcodeName || 'Untitled QR Code'}{' '}
                  <span className="text-gray-500">({qrcodeType})</span>
                </p>
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="template-name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Template Name')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="template-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('Enter template name')}
                  disabled={createTemplateMutation.isPending}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="template-description" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('Description')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="template-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('Describe this template so others know when to use it')}
                  rows={3}
                  disabled={createTemplateMutation.isPending}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Access Level')}
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="private"
                      checked={formData.template_access_level === 'private'}
                      onChange={() => setFormData({ ...formData, template_access_level: 'private' })}
                      disabled={createTemplateMutation.isPending}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-gray-700">
                      <strong>{t('Private')}</strong> - {t('Only visible to you')}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="public"
                      checked={formData.template_access_level === 'public'}
                      onChange={() => setFormData({ ...formData, template_access_level: 'public' })}
                      disabled={createTemplateMutation.isPending}
                      className="w-4 h-4 text-purple-600 focus:ring-purple-500 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-gray-700">
                      <strong>{t('Public')}</strong> - {t('Visible to all users')}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSaveTemplate}
                disabled={!formData.name.trim() || !formData.description.trim() || createTemplateMutation.isPending}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createTemplateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('Saving...')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {t('Save Template')}
                  </>
                )}
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                disabled={createTemplateMutation.isPending}
                className="flex-1 px-4 py-2 border border-gray-300 text-sm font-semibold text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {t('Cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
