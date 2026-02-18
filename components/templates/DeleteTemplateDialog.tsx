'use client'

import { AlertTriangle } from 'lucide-react'
import { useDeleteTemplate } from '@/lib/hooks/queries/useTemplates'
import type { QRCodeTemplate } from '@/types/entities/template'

interface DeleteTemplateDialogProps {
  isOpen: boolean
  onClose: () => void
  template: QRCodeTemplate
  onConfirm?: () => void
}

export default function DeleteTemplateDialog({
  isOpen,
  onClose,
  template,
  onConfirm,
}: DeleteTemplateDialogProps) {
  const deleteTemplateMutation = useDeleteTemplate({
    onSuccess: () => {
      onConfirm?.()
      onClose()
      // You can add toast notification here if available
    },
    onError: (error) => {
      console.error('Failed to delete template:', error)
      // You can add toast notification here if available
    },
  })

  const handleDelete = () => {
    deleteTemplateMutation.mutate(template.id)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>

        <h3 className="text-center text-lg font-semibold text-gray-900">
          Delete Template?
        </h3>
        
        <p className="mt-3 text-center text-sm text-gray-600">
          Are you sure you want to delete{' '}
          <strong className="font-semibold text-gray-900">&ldquo;{template.name}&rdquo;</strong>?
        </p>
        
        <p className="mt-2 text-center text-sm text-gray-500">
          This action cannot be undone. The template will be permanently removed.
        </p>

        {template.template_access_level === 'public' && (
          <div className="mt-4 rounded-md bg-yellow-50 border border-yellow-200 p-3">
            <p className="text-xs text-yellow-800 text-center">
              ⚠️ This is a public template. Deleting it will remove it for all users.
            </p>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleDelete}
            disabled={deleteTemplateMutation.isPending}
            className="flex-1 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteTemplateMutation.isPending ? 'Deleting...' : 'Delete Template'}
          </button>

          <button
            onClick={onClose}
            disabled={deleteTemplateMutation.isPending}
            className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
