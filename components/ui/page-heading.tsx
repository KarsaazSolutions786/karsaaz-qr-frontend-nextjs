import { cn } from '@/lib/utils'

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

interface PageHeadingProps {
  /** Heading level (1–6), determines the HTML tag (h1–h6) */
  level: HeadingLevel
  children: React.ReactNode
  className?: string
  id?: string
}

const defaultStyles: Record<HeadingLevel, string> = {
  1: 'text-3xl font-bold tracking-tight sm:text-4xl',
  2: 'text-2xl font-bold tracking-tight',
  3: 'text-xl font-semibold',
  4: 'text-lg font-semibold',
  5: 'text-base font-medium',
  6: 'text-sm font-medium',
}

/**
 * Semantic heading component that ensures proper hierarchy.
 * Renders the correct h1–h6 tag based on `level` prop.
 */
export function PageHeading({ level, children, className, id }: PageHeadingProps) {
  const Tag = `h${level}` as const

  return (
    <Tag id={id} className={cn(defaultStyles[level], 'text-gray-900', className)}>
      {children}
    </Tag>
  )
}

export default PageHeading
