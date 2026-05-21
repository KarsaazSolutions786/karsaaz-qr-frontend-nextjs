'use client'

import Link from 'next/link'
import { Clock, Sparkles, X as XIcon } from 'lucide-react'
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

interface TrialExpiringModalProps {
  open: boolean
  daysRemaining: number
  onDismiss: () => void
}

/**
 * Features that trial users will lose upon expiration.
 * Displayed as a comparison list to motivate upgrading.
 */
const TRIAL_FEATURES = [
  { key: 'dynamic_qr', label: 'Dynamic QR Codes' },
  { key: 'analytics', label: 'Scan Analytics & Tracking' },
  { key: 'custom_design', label: 'Custom QR Code Designs' },
  { key: 'bulk_operations', label: 'Bulk QR Code Operations' },
  { key: 'templates', label: 'QR Code Templates' },
] as const

/**
 * Purpose: Modal displayed when a trial subscription is about to expire (< 3 days remaining). Matches P1 TrialExpiringSoonSubscription behavior: - Shows trial days remaining - Feature comparison showing what user will lose - "Upgrade Now" CTA redirects to pricing page - "Continue Trial" dismisses for the current session
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function TrialExpiringModal({
  open,
  daysRemaining,
  onDismiss,
}: TrialExpiringModalProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onDismiss() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-center">
            {t('Your Trial is Ending Soon')}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t('Upgrade now to keep all your features and QR codes working without interruption.')}
          </DialogDescription>
        </DialogHeader>

        {/* Days remaining counter */}
        <div className="flex items-center justify-center gap-3 rounded-lg bg-blue-50 px-4 py-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-700">{daysRemaining}</p>
            <p className="text-xs text-blue-600">
              {daysRemaining === 1 ? t('day left in your trial') : t('days left in your trial')}
            </p>
          </div>
        </div>

        {/* Feature comparison -- what you will lose */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-3 text-sm font-semibold text-gray-700">
            {t('Features you will lose:')}
          </p>
          <ul className="space-y-2">
            {TRIAL_FEATURES.map((feature) => (
              <li key={feature.key} className="flex items-center gap-2 text-sm">
                <XIcon className="h-4 w-4 text-red-400 shrink-0" />
                <span className="text-gray-600">{t(feature.label)}</span>
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild className="w-full">
            <Link href="/pricing">
              <Sparkles className="mr-2 h-4 w-4" />
              {t('Upgrade Now')}
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={onDismiss}
          >
            {t('Continue Trial')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
