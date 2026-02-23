import { cn } from '@/lib/utils'

interface SrOnlyProps {
  children: React.ReactNode
  className?: string
  /** Render as a specific HTML element (default: span) */
  as?: 'span' | 'div' | 'p' | 'label' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

/**
 * Visually hidden text that remains accessible to screen readers.
 * Uses Tailwind's sr-only utility.
 */
export function SrOnly({ children, className, as: Tag = 'span' }: SrOnlyProps) {
  return <Tag className={cn('sr-only', className)}>{children}</Tag>
}

export default SrOnly
