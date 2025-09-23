import type { VariantProps } from 'class-variance-authority'

import * as React from 'react'

import { cva } from 'class-variance-authority'

import { cn } from '@/common/lib/utils'

export const inputVariants = cva(
  'selection:bg-brand selection:text-white scroll-m-5 flex h-10 block my-0 w-full rounded border border-input bg-white ring-slate-100 hover:ring disabled:hover:ring-0 text-foreground px-3 text-sm shadow-none transition-all transition-50 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      editor: {
        true: 'border-none rounded-none hover:ring-0 bg-transparent py-5'
      },
      error: {
        true: 'text-destructive focus-visible:text-destructive focus-visible:ring-destructive'
      }
    },
    compoundVariants: [
      {
        editor: true,
        error: true,
        className: 'bg-destructive/10 !ring-2 !ring-solid !ring-destructive'
      }
    ]
  }
)
export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'error'> &
  VariantProps<typeof inputVariants>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, editor, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputVariants({
            error,
            editor
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
