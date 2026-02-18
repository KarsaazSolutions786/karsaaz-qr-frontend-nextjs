'use client'

import { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useUseTemplate } from '@/lib/hooks/queries/useTemplates'
import type { QRCodeTemplate } from '@/types/entities/template'

interface UseTemplateButtonProps {
  templateId: number
  template?: QRCodeTemplate
  onUse?: (data: Partial<any>) => void
  variant?: 'primary' | 'secondary'
  loading?: boolean
  className?: string
  children?: React.ReactNode
}

export default function UseTemplateButton({
  templateId,
  template,
  onUse,
  variant = 'primary',
  loading: externalLoading = false,
  className = '',
  children,
}: UseTemplateButtonProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const useTemplateMutation = useUseTemplate({
    onSuccess: (data) => {
      setShowSuccess(true)
      onUse?.(data)
      
      // Hide success feedback after 2 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 2000)
    },
    onError: (error) => {
      console.error('Failed to use template:', error)
      // You can add toast notification here if available
    },
  })

  const handleUseTemplate = () => {
    useTemplateMutation.mutate({
      template_id: templateId,
      name: template?.name,
    })
  }

  const isLoading = externalLoading || useTemplateMutation.isPending
  const isSuccess = showSuccess

  const baseClasses = 'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus:ring-primary-500',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-500',
  }

  const successClasses = 'bg-green-600 text-white hover:bg-green-700'

  return (
    <button
      onClick={handleUseTemplate}
      disabled={isLoading || isSuccess}
      className={`${baseClasses} ${isSuccess ? successClasses : variantClasses[variant]} ${className}`}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      
      {isSuccess && (
        <CheckCircle className="w-4 h-4" />
      )}
      
      {isLoading && 'Loading...'}
      {isSuccess && 'Template Applied!'}
      {!isLoading && !isSuccess && (children || 'Use Template')}
    </button>
  )
}
