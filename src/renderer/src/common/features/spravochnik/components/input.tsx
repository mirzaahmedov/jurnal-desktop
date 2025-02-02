import type { InputProps } from '@/common/components/ui/input'
import type { VariantProps } from 'class-variance-authority'

import { type HTMLAttributes, type Ref } from 'react'

import { cva } from 'class-variance-authority'
import { CircleX } from 'lucide-react'

import { LoadingSpinner } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { Input } from '@/common/components/ui/input'
import { cn } from '@/common/lib/utils'

import { registerKeyBindings } from './key-bindings'

const inputVariants = cva('cursor-pointer', {
  variants: {
    editor: {
      true: 'border-none rounded-none hover:ring-0 bg-transparent py-5'
    },
    error: {
      true: 'focus-visible:ring-destructive'
    }
  },
  compoundVariants: [
    {
      editor: true,
      error: true,
      className: 'bg-destructive/10 !ring-2 !ring-solid !ring-destructive'
    }
  ]
})

type SpravochnikInputProps<T> = InputProps &
  VariantProps<typeof inputVariants> & {
    inputRef?: Ref<HTMLInputElement>
    loading?: boolean
    selected?: T
    getInputValue: (value?: T) => string
    open?: () => void
    clear?: () => void
    divProps?: HTMLAttributes<HTMLDivElement>
  }

const SpravochnikInput = <T extends Record<string, unknown>>({
  inputRef,
  loading = false,
  error = false,
  editor = false,
  selected,
  getInputValue,
  className,
  open,
  clear,
  divProps = {},
  ...props
}: SpravochnikInputProps<T>) => {
  return (
    <div
      {...divProps}
      className={cn('relative group', divProps?.className)}
    >
      <Input
        ref={inputRef}
        disabled={loading}
        className={cn(inputVariants({ editor, error }), className)}
        error={error}
        value={getInputValue(selected) ?? ''}
        onDoubleClick={open}
        data-error={error}
        {...registerKeyBindings({ open, clear })}
        {...props}
      />
      {loading ? (
        <div className="flex items-center absolute right-2 top-0 bottom-0">
          <LoadingSpinner className="size-5 border-brand/40 border-r-transparent border-[3px]" />
        </div>
      ) : (
        <div className="flex items-center invisible absolute right-0 top-0 bottom-0 text-foreground/50 [input:focus+&]:text-brand group-focus-within:visible group-hover:visible px-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="bg-white text-destructive/70 hover:text-destructive/70 size-7"
            onClick={clear}
          >
            <CircleX className="size-5" />
          </Button>
        </div>
      )}
    </div>
  )
}

export { inputVariants, SpravochnikInput }
export type { SpravochnikInputProps }
