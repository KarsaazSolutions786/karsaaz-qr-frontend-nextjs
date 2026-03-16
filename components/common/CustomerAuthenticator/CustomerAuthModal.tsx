'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useTranslation } from '@/lib/i18n'
import { CustomerAuthenticator, type ViewerAuth } from './CustomerAuthenticator'

interface CustomerAuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  qrCodeId: string
  onAuthenticated: (viewer: ViewerAuth) => void
  title?: string
  description?: string
}

/**
 * Modal wrapper for the CustomerAuthenticator.
 * Uses shadcn/ui Dialog (Radix) for consistent modal behavior.
 */
export function CustomerAuthModal({
  open,
  onOpenChange,
  qrCodeId,
  onAuthenticated,
  title,
  description,
}: CustomerAuthModalProps) {
  const { t } = useTranslation()
  const resolvedTitle = title ?? t('Verify your identity')
  const resolvedDescription = description ?? t('Please verify your identity to continue viewing this content.')
  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{resolvedTitle}</DialogTitle>
          <DialogDescription>{resolvedDescription}</DialogDescription>
        </DialogHeader>
        <CustomerAuthenticator
          qrCodeId={qrCodeId}
          onAuthenticated={onAuthenticated}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  )
}

export default CustomerAuthModal
