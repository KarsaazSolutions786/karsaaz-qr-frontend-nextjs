'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { AuthFlowOrchestrator } from './AuthFlowOrchestrator'

interface AuthGateModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  title?: string
  description?: string
}

/**
 * Modal that pops up when auth is required for an action.
 * Shows login form inline; on success, closes and triggers the original action.
 */
export function AuthGateModal({
  open,
  onClose,
  onSuccess,
  title = 'Authentication Required',
  description = 'Please sign in to continue with this action.',
}: AuthGateModalProps) {
  const handleSuccess = () => {
    onClose()
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <AuthFlowOrchestrator onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
