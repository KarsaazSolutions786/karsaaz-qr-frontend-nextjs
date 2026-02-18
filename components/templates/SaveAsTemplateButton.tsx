'use client'

import { useState } from 'react'
import { Save, Loader2, CheckCircle, X } from 'lucide-react'
import { useCreateTemplate } from '@/lib/hooks/queries/useTemplates'
import type { CreateTemplateInput } from '@/types/entities/template'

interface SaveAsTemplateButtonProps {
  qrcodeId: number
  qrcodeData: any // Full QR code object
  onSuccess?: () => void
  className?: string
  children?: React.ReactNode
}

export default function SaveAsTemplateButton({
  qrcodeId: _qrcodeId,
  qrcodeData,
  onSuccess,
  className = '',
  children,
}: SaveAsTemplateButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    template_access_level: 'private' as 'public' | 'private',
  })

  const createTemplateMutation = useCreateTemplate({
    onSuccess: () => {
      onSuccess?.()
      setIsModalOpen(false)
      // Reset form
      setFormData({
        name: '',
        description: '',
        template_access_level: 'private',
      })
      // You can add toast notification here if available
    },
    onError: (error) => {
      console.error('Failed to create template:', error)
      // You can add toast notification here if available
    },
  })

  const handleSaveTemplate = () => {
    if (!formData.name.trim()) return

    const templateInput: CreateTemplateInput = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      type: qrcodeData.type || 'url',
      template_access_level: formData.template_access_level,
      settings: qrcodeData.settings || {},
      data: qrcodeData.data || {},
      design: qrcodeData.design || {},
      thumbnail_url: qrcodeData.thumbnail_url || undefined,
    }

    createTemplateMutation.mutate(templateInput)
  }

  const handleOpenModal = () => {
    // Pre-fill with QR code name if available
    setFormData({
      name: qrcodeData.name ? `${qrcodeData.name} Template` : '',
      description: '',
      template_access_level: 'private',
    })
    setIsModalOpen(true)
  }

  return (
    <>
      <button
        onClick={handleOpenModal}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 active:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${className}`}
      >
        <Save className="w-4 h-4" />
        {children || 'Save as Template'}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-lg w-full mx-4 rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Save as Template
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={createTemplateMutation.isPending}
                className="p-1 rounded-md hover:bg-gray-100 transition-colors disabled:cursor-not-allowed"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Preview */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-700 mb-2">Preview</p>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Type:</span> {qrcodeData.type || 'URL'}
                </p>
                {qrcodeData.design?.foreground_color && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="font-medium">Color:</span>
                    <span
                      className="inline-block w-4 h-4 rounded border border-gray-300"
                      style={{ backgroundColor: qrcodeData.design.foreground_color }}
                    />
                    {qrcodeData.design.foreground_color}
                  </p>
                )}
                {qrcodeData.design?.logo_url && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Has logo:</span>{' '}
                    <CheckCircle className="inline w-4 h-4 text-green-600" />
                  </p>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="template-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="template-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter template name"
                  disabled={createTemplateMutation.isPending}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="template-description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="template-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this template (optional)"
                  rows={3}
                  disabled={createTemplateMutation.isPending}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Access Level
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="private"
                      checked={formData.template_access_level === 'private'}
                      onChange={(_e) => setFormData({ ...formData, template_access_level: 'private' })}
                      disabled={createTemplateMutation.isPending}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-gray-700">
                      <strong>Private</strong> - Only visible to you
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="public"
                      checked={formData.template_access_level === 'public'}
                      onChange={(_e) => setFormData({ ...formData, template_access_level: 'public' })}
                      disabled={createTemplateMutation.isPending}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm text-gray-700">
                      <strong>Public</strong> - Visible to all users
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSaveTemplate}
                disabled={!formData.name.trim() || createTemplateMutation.isPending}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-semibold rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createTemplateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Template
                  </>
                )}
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                disabled={createTemplateMutation.isPending}
                className="flex-1 px-4 py-2 border border-gray-300 text-sm font-semibold text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
