'use client'

import React, { useState, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import {
  BusinessHoursInput,
  type BusinessHours,
  DAYS,
} from '@/components/ui/business-hours-input'

/**
 * Purpose: Executes createDefaultHours functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
function createDefaultHours(): BusinessHours[] {
  return DAYS.map((day) => ({
    day,
    enabled: day !== 'Saturday' && day !== 'Sunday',
    open: '09:00',
    close: '17:00',
    additionalHours: [],
  }))
}

interface BusinessHoursModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  value?: BusinessHours[]
  onSave: (hours: BusinessHours[]) => void
  title?: string
  description?: string
}

/**
 * Purpose: Executes BusinessHoursModal functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: March 2026
 */
export function BusinessHoursModal({
  open,
  onOpenChange,
  value,
  onSave,
  title,
  description,
}: BusinessHoursModalProps) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState<BusinessHours[]>(
    value && value.length === 7 ? value : createDefaultHours()
  )

  // Reset draft when modal opens with new value
  React.useEffect(() => {
    if (open) {
      setDraft(value && value.length === 7 ? value : createDefaultHours())
    }
  }, [open, value])

  const handleSave = useCallback(() => {
    onSave(draft)
    onOpenChange(false)
  }, [draft, onSave, onOpenChange])

  const handleCancel = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title ?? t('Opening Hours')}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <BusinessHoursInput value={draft} onChange={setDraft} />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            {t('Cancel')}
          </Button>
          <Button type="button" onClick={handleSave}>
            {t('Save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BusinessHoursModal
