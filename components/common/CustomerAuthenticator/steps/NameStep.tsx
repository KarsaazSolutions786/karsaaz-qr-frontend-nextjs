'use client'

import React, { useState, FormEvent } from 'react'
import { useTranslation } from '@/lib/i18n'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface NameStepProps {
  email: string
  onSubmit: (name: string) => void
  onBack: () => void
  loading: boolean
}

/**
 * Purpose: Executes NameStep functionality.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export function NameStep({ email, onSubmit, onBack, loading }: NameStepProps) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  /**
   * Purpose: Executes handleSubmit functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setValidationError(t('Name is required'))
      return
    }
    if (trimmed.length < 2) {
      setValidationError(t('Name must be at least 2 characters'))
      return
    }
    setValidationError(null)
    onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {t("What's your name?")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t('Continuing as')} <span className="font-medium">{email}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Input
          type="text"
          placeholder={t('Your name')}
          value={name}
          onChange={e => {
            setName(e.target.value)
            if (validationError) setValidationError(null)
          }}
          autoFocus
          disabled={loading}
        />
        {validationError && <p className="text-sm text-red-500">{validationError}</p>}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
          disabled={loading}
        >
          {t('Back')}
        </Button>
        <Button type="submit" className="flex-1" disabled={loading || !name.trim()}>
          {loading ? t('Sending code...') : t('Continue')}
        </Button>
      </div>
    </form>
  )
}
