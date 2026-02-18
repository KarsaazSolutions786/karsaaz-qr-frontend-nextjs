import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

function getButtonClasses(variant: string, size: string, className?: string) {
  return cn(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    {
      'bg-blue-600 text-white hover:bg-blue-700': variant === 'default',
      'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50':
        variant === 'outline',
      'text-gray-700 hover:bg-gray-100': variant === 'ghost',
      'bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
    },
    {
      'h-10 px-4 py-2 text-sm': size === 'default',
      'h-8 px-3 py-1 text-xs': size === 'sm',
      'h-12 px-6 py-3 text-base': size === 'lg',
      'h-10 w-10 p-0': size === 'icon',
    },
    className
  )
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    if (asChild && React.isValidElement(props.children)) {
      return React.cloneElement(props.children as React.ReactElement<any>, {
        className: getButtonClasses(variant, size, className),
        ref,
      })
    }

    return (
      <button
        className={getButtonClasses(variant, size, className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
