'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useTranslation } from '@/lib/i18n'
import { AuthFlowOrchestrator } from './AuthFlowOrchestrator'

interface AuthGateModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  title?: string
  description?: string
}

/**
 * Purpose: Modal that pops up when auth is required for an action. Shows login form inline; on success, closes and triggers the original action.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */

export function AuthGateModal({
  open,
  onClose,
  onSuccess,
  title,
  description,
}: AuthGateModalProps) {
  const { t } = useTranslation()
  const displayTitle = title || t('Authentication Required')
  const displayDescription = description || t('Please sign in to continue with this action.')
  /**
   * Purpose: Executes handleSuccess functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSuccess = () => {
    onClose()
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{displayTitle}</DialogTitle>
          <DialogDescription>{displayDescription}</DialogDescription>
        </DialogHeader>
        <AuthFlowOrchestrator onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
