'use client'

import { forwardRef } from 'react'

import { type VariantProps, cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  composeRenderProps
} from 'react-aria-components'

import { cn } from '@/common/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors',
    /* Disabled */
    'data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ',
    /* Focus Visible */
    'data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-brand data-[focus-visible]:ring-offset-2',
    /* Resets */
    'focus-visible:outline-none'
  ],
  {
    variants: {
      variant: {
        default: 'bg-brand text-primary-foreground data-[hovered]:bg-brand/90',
        destructive: 'bg-destructive text-destructive-foreground data-[hovered]:bg-destructive/90',
        outline: 'border border-input bg-background text-slate-600 data-[hovered]:bg-accent',
        secondary: 'bg-secondary text-secondary-foreground data-[hovered]:bg-secondary/80',
        ghost:
          'text-foreground-muted data-[hovered]:bg-accent data-[hovered]:text-foreground-muted',
        link: 'text-primary underline-offset-4 data-[hovered]:underline'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'size-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

interface ButtonProps extends AriaButtonProps, VariantProps<typeof buttonVariants> {
  IconStart?: React.ElementType
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, IconStart, ...props }, ref) => {
    return (
      <AriaButton
        ref={ref}
        className={composeRenderProps(className, (className) =>
          cn(
            buttonVariants({
              variant,
              size,
              className
            })
          )
        )}
        {...props}
      >
        {(props) => (
          <>
            {props.isPending ? (
              <Loader2 className="btn-icon icon-sm icon-start animate-spin" />
            ) : IconStart ? (
              <IconStart className="btn-icon icon-sm icon-start" />
            ) : null}
            {typeof children === 'function' ? children(props) : children}
          </>
        )}
      </AriaButton>
    )
  }
)

export { Button, buttonVariants }
export type { ButtonProps }
