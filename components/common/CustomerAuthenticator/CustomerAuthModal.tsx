'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
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
  title = 'Verify your identity',
  description = 'Please verify your identity to continue viewing this content.',
}: CustomerAuthModalProps) {
  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
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
