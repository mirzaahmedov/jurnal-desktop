import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/common/lib/utils'

const buttonVariants = cva(
  'inline-flex gap-0 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-brand text-primary-foreground shadow-none hover:bg-brand/90 hover:ring-2 ring-brand/30 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-1',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-none text-slate-500 hover:bg-slate-50 hover:text-brand',
        secondary: 'bg-secondary font-semibold text-slate-600 shadow-sm hover:bg-secondary/80',
        ghost:
          'text-slate-500 hover:bg-accent hover:text-brand focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1',
        link: 'text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, variant, size, asChild = false, loading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {loading ? <Loader2 className="icon icon-start icon-sm animate-spin" /> : null}
        {children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
