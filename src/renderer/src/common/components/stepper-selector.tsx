import type { HTMLAttributes } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/common/components/jolly/button'
import { cn } from '@/common/lib/utils'

export interface StepperSelectorProps<T extends object> extends HTMLAttributes<HTMLDivElement> {
  value?: number
  onValueChange: (value?: number) => void
  getOptionLabel: (data: NoInfer<T>) => React.ReactNode
  getOptionValue: (data: NoInfer<T>) => number
  onOptionSelect?: (option: NoInfer<T>) => void
  options: T[]
}
export const StepperSelector = <T extends object>({
  value,
  onValueChange,
  getOptionLabel,
  getOptionValue,
  onOptionSelect,
  options,
  ...props
}: StepperSelectorProps<T>) => {
  const currentIndex = options?.findIndex((option) => getOptionValue(option) === value)
  const nextIndex = currentIndex !== undefined ? (currentIndex + 1) % options.length : -1
  const prevIndex =
    currentIndex !== undefined ? (currentIndex - 1 + options.length) % options.length : -1

  return value && options?.length ? (
    <div
      {...props}
      className={cn('flex items-center gap-2', props.className)}
    >
      {options.length > 1 ? (
        <Button
          size="icon"
          variant="ghost"
          className="size-6"
          isDisabled={options?.length < 2}
          onClick={(e) => {
            e.stopPropagation()
            onValueChange(getOptionValue(options?.[prevIndex]))
            onOptionSelect?.(options?.[prevIndex])
          }}
        >
          <ChevronLeft className="btn-icon" />
        </Button>
      ) : null}
      <span className="flex-1 text-xs font-semibold text-center">
        {options?.[currentIndex] ? getOptionLabel(options?.[currentIndex]) : undefined}
      </span>
      {options.length > 1 ? (
        <Button
          size="icon"
          variant="ghost"
          className="size-6"
          isDisabled={options?.length < 2}
          onClick={(e) => {
            e.stopPropagation()
            onValueChange(getOptionValue(options?.[nextIndex]))
            onOptionSelect?.(options?.[nextIndex])
          }}
        >
          <ChevronRight className="btn-icon" />
        </Button>
      ) : null}
    </div>
  ) : null
}
