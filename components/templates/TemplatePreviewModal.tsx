/**
 * TemplatePreviewModal Component
 * 
 * Preview modal for QR code templates with detailed information.
 */

'use client'

import React, { useEffect } from 'react'
import { QRCodeTemplate } from '@/types/entities/template'
import { X, Tag, Palette, Lock, Globe } from 'lucide-react'
import Image from 'next/image'

export interface TemplatePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  template: QRCodeTemplate | null
  onUseTemplate?: (template: QRCodeTemplate) => void
}

export default function TemplatePreviewModal({
  isOpen,
  onClose,
  template,
  onUseTemplate,
}: TemplatePreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !template) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleUseTemplate = () => {
    if (onUseTemplate) {
      onUseTemplate(template)
    }
  }

  const { design } = template
  const isPrivate = template.template_access_level === 'private'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="preview-modal-title" className="text-lg font-semibold text-gray-900">
            Template Preview
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Left Column - Preview */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                {template.thumbnail_url ? (
                  <Image
                    src={template.thumbnail_url}
                    alt={template.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                    <div className="w-32 h-32 bg-primary-200 rounded-lg" />
                  </div>
                )}
              </div>

              {/* Type and Access Badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800 border border-primary-200">
                  <Tag className="w-3.5 h-3.5" />
                  {template.type}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                    isPrivate
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : 'bg-green-100 text-green-800 border border-green-200'
                  }`}
                >
                  {isPrivate ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Private
                    </>
                  ) : (
                    <>
                      <Globe className="w-3.5 h-3.5" />
                      Public
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Template Info */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{template.name}</h3>
                {template.description && (
                  <p className="text-sm text-gray-600">{template.description}</p>
                )}
              </div>

              {/* Category */}
              {template.category && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Category</h4>
                  <div className="flex items-center gap-2">
                    {template.category.icon && (
                      <span className="text-lg">{template.category.icon}</span>
                    )}
                    <span className="text-sm text-gray-900">{template.category.name}</span>
                  </div>
                </div>
              )}

              {/* Design Specifications */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Design Specifications
                </h4>
                <div className="space-y-3">
                  {/* Colors */}
                  {(design.foreground_color || design.background_color) && (
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-500 w-24 flex-shrink-0 pt-1">
                        Colors
                      </span>
                      <div className="flex items-center gap-2">
                        {design.foreground_color && (
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-6 h-6 rounded border border-gray-300"
                              style={{ backgroundColor: design.foreground_color }}
                              title={`Foreground: ${design.foreground_color}`}
                            />
                            <span className="text-xs text-gray-600">
                              {design.foreground_color}
                            </span>
                          </div>
                        )}
                        {design.background_color && (
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-6 h-6 rounded border border-gray-300"
                              style={{ backgroundColor: design.background_color }}
                              title={`Background: ${design.background_color}`}
                            />
                            <span className="text-xs text-gray-600">
                              {design.background_color}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Module Shape */}
                  {design.module_shape && (
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-500 w-24 flex-shrink-0">
                        Module Shape
                      </span>
                      <span className="text-sm text-gray-900 capitalize">
                        {design.module_shape}
                      </span>
                    </div>
                  )}

                  {/* Eye Shape */}
                  {design.eye_shape && (
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-500 w-24 flex-shrink-0">Eye Shape</span>
                      <span className="text-sm text-gray-900 capitalize">{design.eye_shape}</span>
                    </div>
                  )}

                  {/* Error Correction */}
                  {design.error_correction && (
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-500 w-24 flex-shrink-0">
                        Error Correction
                      </span>
                      <span className="text-sm text-gray-900">{design.error_correction}</span>
                    </div>
                  )}

                  {/* Pattern */}
                  {design.pattern_type && design.pattern_type !== 'none' && (
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-500 w-24 flex-shrink-0">Pattern</span>
                      <span className="text-sm text-gray-900 capitalize">
                        {design.pattern_type}
                      </span>
                    </div>
                  )}

                  {/* Gradient */}
                  {design.gradient_type && design.gradient_type !== 'none' && (
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-500 w-24 flex-shrink-0">Gradient</span>
                      <span className="text-sm text-gray-900 capitalize">
                        {design.gradient_type}
                      </span>
                    </div>
                  )}

                  {/* AI Generated */}
                  {design.ai_generated && (
                    <div className="flex items-start gap-3">
                      <span className="text-xs text-gray-500 w-24 flex-shrink-0">
                        AI Generated
                      </span>
                      <span className="text-sm text-purple-600 font-medium">Yes</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamps */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created: {new Date(template.created_at).toLocaleDateString()}</span>
                  <span>Updated: {new Date(template.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            Close
          </button>
          {onUseTemplate && (
            <button
              onClick={handleUseTemplate}
              className="px-6 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Use This Template
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
