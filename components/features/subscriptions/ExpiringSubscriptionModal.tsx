'use client'

import Link from 'next/link'
import { Clock, AlertTriangle } from 'lucide-react'
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

interface ExpiringSubscriptionModalProps {
  open: boolean
  daysRemaining: number
  onDismiss: () => void
}

/**
 * Purpose: Modal displayed when a paid subscription is about to expire (< 7 days remaining). Matches P1 ExpiringSoonSubscription behavior: - Shows days remaining counter - "Renew Now" CTA redirects to pricing page - "Remind Me Later" dismisses for the current session
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function ExpiringSubscriptionModal({
  open,
  daysRemaining,
  onDismiss,
}: ExpiringSubscriptionModalProps) {
  const { t } = useTranslation()

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) onDismiss()
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-gray-900 dark:text-gray-50">
            {t('Subscription Expiring Soon')}
          </DialogTitle>
          <DialogDescription className="text-center text-base text-gray-700 dark:text-gray-200">
            {t(
              'Your subscription is expiring soon. Renew now to avoid any interruption to your services.'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-3 rounded-lg bg-amber-50 px-4 py-3">
          <Clock className="h-5 w-5 text-amber-600" />
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-700">{daysRemaining}</p>
            <p className="text-xs text-amber-600">
              {daysRemaining === 1 ? t('day remaining') : t('days remaining')}
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-700 dark:text-gray-200">
          {t(
            'Renew your subscription to continue creating and managing QR codes, accessing analytics, and all premium features.'
          )}
        </p>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild className="w-full">
            <Link href="/pricing">{t('Renew Now')}</Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full text-gray-700 dark:text-gray-200"
            onClick={onDismiss}
          >
            {t('Remind Me Later')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
