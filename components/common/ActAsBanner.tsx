'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useTranslation } from '@/lib/i18n'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

/**
 * Banner shown when admin is impersonating another user.
 * Displays warning with user name/email and "Return to Admin" button.
 * Spans the full width above the sidebar and header.
 */
export function ActAsBanner() {
  const { t } = useTranslation()
  const { isActingAs, actingAsUser, removeActAs } = useAuth()

  if (!isActingAs) return null

  return (
    <div className="bg-amber-500 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-3 z-50">
      <ExclamationTriangleIcon className="h-5 w-5 shrink-0" />
      <span>
        {t('You are viewing as')} {actingAsUser?.name || actingAsUser?.email || t('another user')}
      </span>
      <button
        onClick={removeActAs}
        className="underline font-bold hover:no-underline transition-all"
      >
        {t('Return to Admin')}
      </button>
    </div>
  )
}
