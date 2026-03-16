'use client'

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

interface FileImageProps {
  file: File | null
  alt?: string
  className?: string
  fallback?: React.ReactNode
}

export function FileImage({ file, alt, className, fallback }: FileImageProps) {
  const { t } = useTranslation()
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!file) {
      setSrc(null) // eslint-disable-line react-hooks/set-state-in-effect -- legitimate: syncing blob URL from File prop
      return
    }
    const url = URL.createObjectURL(file)
    setSrc(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  if (!src) {
    return <>{fallback ?? null}</>
  }

  return <img src={src} alt={alt ?? t('Preview')} className={cn('rounded-lg object-cover', className)} />
}
