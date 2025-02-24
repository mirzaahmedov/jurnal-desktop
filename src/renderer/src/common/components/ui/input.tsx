import type { VariantProps } from 'class-variance-authority'

import * as React from 'react'

import { cva } from 'class-variance-authority'

import { cn } from '@/common/lib/utils'

export const inputVariants = cva(
  'scroll-m-32 flex h-9 w-full rounded-md border border-input bg-white ring-slate-100 hover:ring disabled:hover:ring-0 text-foreground px-3 py-1 text-sm shadow-none transition-all transition-50 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      error: {
        true: 'text-destructive focus-visible:text-destructive focus-visible:ring-destructive'
      }
    }
  }
)
export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'error'> &
  VariantProps<typeof inputVariants>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({
            error
          }),
          className
        )}
        data-error={error}
        ref={ref}
        onFocus={(e) => {
          e.target.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
            behavior: 'smooth'
          })
        }}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
