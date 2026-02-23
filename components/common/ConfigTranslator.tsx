'use client'

import { useState } from 'react'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { ConfigTranslatorModal } from './ConfigTranslatorModal'
import { useTranslation } from '@/lib/i18n'

interface ConfigTranslatorProps {
  configKey: string
  currentValue: string
  onSave?: () => void
}

export function ConfigTranslator({
  configKey,
  currentValue,
  onSave,
}: ConfigTranslatorProps) {
  const [open, setOpen] = useState(false)
  const { t, languages } = useTranslation()

  // Hide if only one language available
  if (languages.length < 2) return null

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => setOpen(true)}
        title={t('Translate')}
      >
        <GlobeAltIcon className="h-4 w-4 text-gray-500" />
      </Button>

      <ConfigTranslatorModal
        isOpen={open}
        onClose={() => setOpen(false)}
        configKey={configKey}
        currentValue={currentValue}
        onSave={onSave}
      />
    </>
  )
}
