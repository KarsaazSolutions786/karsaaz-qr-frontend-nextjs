/**
 * UpgradeRequiredModal
 *
 * Shown when a user tries to create a QR code but has exceeded their plan's
 * quota. Provides a clear message about the limit and a CTA to the pricing page.
 */

'use client'

import { useRouter } from 'next/navigation'
import { useTranslation } from '@/lib/i18n'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

interface UpgradeRequiredModalProps {
  open: boolean
  onClose: () => void
  title?: string
  message?: string
  /** Current usage count to show in the modal */
  currentUsage?: number
  /** Plan limit to show in the modal */
  planLimit?: number
}

/**
 * Purpose: Executes UpgradeRequiredModal functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function UpgradeRequiredModal({
  open,
  onClose,
  title,
  message,
  currentUsage,
  planLimit,
}: UpgradeRequiredModalProps) {
  const { t } = useTranslation()
  const router = useRouter()

  /**
   * Purpose: Executes handleUpgrade functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: March 2026
   */
  const handleUpgrade = () => {
    onClose()
    router.push(ROUTES.PRICING)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>{title || t('Plan Limit Reached')}</DialogTitle>
            </div>
          </div>
          <DialogDescription className="pt-3">
            {message || t('You have reached your plan limits. Upgrade to continue creating QR codes.')}
          </DialogDescription>
        </DialogHeader>

        {typeof currentUsage === 'number' && typeof planLimit === 'number' && planLimit > 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('Dynamic QR codes used')}</span>
              <span className="font-semibold text-gray-900">
                {currentUsage} / {planLimit}
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex-row gap-3 sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            {t('Cancel')}
          </Button>
          <Button onClick={handleUpgrade}>
            {t('Upgrade Plan')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
