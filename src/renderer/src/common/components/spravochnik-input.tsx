import type { HTMLAttributes } from 'react'
import type { InputProps } from '@/common/components/ui/input'
import type { VariantProps } from 'class-variance-authority'

import { forwardRef } from 'react'
import { cn } from '@/common/lib/utils'
import { cva } from 'class-variance-authority'
import { Input } from '@/common/components/ui/input'
import { CircleX } from 'lucide-react'
import { Button } from './ui/button'

const inputVariants = cva('cursor-pointer', {
  variants: {
    editor: {
      true: 'border-none rounded-none hover:ring-0 bg-transparent py-5'
    },
    error: {
      true: 'bg-destructive/5 focus-visible:ring-destructive'
    }
  }
})

type SpravochnikInputProps = InputProps &
  VariantProps<typeof inputVariants> & {
    containerProps?: HTMLAttributes<HTMLDivElement>
    onClear?(): void
  }

const SpravochnikInput = forwardRef<HTMLInputElement, SpravochnikInputProps>(
  ({ className, containerProps = {}, editor, error, onClear, ...props }, ref) => {
    return (
      <div
        {...containerProps}
        className={cn('relative group', containerProps?.className)}
      >
        <Input
          ref={ref}
          className={cn(inputVariants({ editor, error }), className)}
          error={error}
          {...props}
        />
        <div className="flex items-center invisible absolute right-0 top-0 bottom-0 text-foreground/50 [input:focus+&]:text-brand group-focus-within:visible group-hover:visible px-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full bg-white text-destructive/70 hover:text-destructive/70 size-8"
            onClick={onClear}
          >
            <CircleX className="size-4" />
          </Button>
        </div>
      </div>
    )
  }
)

export { SpravochnikInput, inputVariants }
export type { SpravochnikInputProps }
