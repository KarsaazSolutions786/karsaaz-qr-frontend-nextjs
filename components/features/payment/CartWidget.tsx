'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useAccountCreditStore } from '@/lib/store/account-credit-store'
import { useAccountCredit } from '@/lib/hooks/useAccountCredit'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/**
 * Purpose: Floating cart widget that shows when items are in the account credit cart. Matches P1's QrcgAccountCreditCartWidget: - Fixed position at bottom center - Shows item count - "Checkout Now" CTA links to cart page - Animated entrance - Only visible in account-credit billing mode Place this in the dashboard layout alongside QuickActions.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */

export function CartWidget() {
  const { t } = useTranslation()
  const { isAccountCreditMode } = useAccountCredit()
  const numberOfItems = useAccountCreditStore((s) => s.numberOfItems())
  const hasItems = useAccountCreditStore((s) => s.hasItems())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render in account-credit mode with items in cart
  if (!mounted || !isAccountCreditMode || !hasItems) {
    return null
  }

  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-in slide-in-from-bottom-4 fade-in duration-500"
    >
      <div className="flex items-center gap-3 rounded-xl bg-primary px-5 py-3 text-primary-foreground shadow-lg">
        <div className="relative">
          <ShoppingCart className="h-5 w-5" />
          <Badge
            variant="destructive"
            className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px]"
          >
            {numberOfItems}
          </Badge>
        </div>

        <span className="text-sm font-semibold">
          {numberOfItems} {numberOfItems === 1 ? t('item in your cart') : t('items in your cart')}
        </span>

        <Button
          asChild
          size="sm"
          variant="secondary"
          className="ml-2 bg-white text-primary hover:bg-white/90"
        >
          <Link href="/account-credit-cart">
            {t('Checkout Now')}
          </Link>
        </Button>
      </div>
    </div>
  )
}
