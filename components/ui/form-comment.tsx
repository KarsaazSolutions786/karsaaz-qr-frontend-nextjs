'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface FormCommentProps {
  children: React.ReactNode
  className?: string
}

export function FormComment({ children, className }: FormCommentProps) {
  return <p className={cn('text-xs text-gray-500 mt-1', className)}>{children}</p>
}
