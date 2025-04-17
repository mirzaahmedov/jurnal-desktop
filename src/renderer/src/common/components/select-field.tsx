import type { ForwardedRef, ReactNode } from 'react'
import type { SelectProps } from 'react-aria-components'

import { forwardRef } from 'react'

import { X } from 'lucide-react'

import {
  Select,
  SelectItem,
  SelectListBox,
  SelectPopover,
  SelectTrigger,
  SelectValue
} from '@/common/components/jolly/select'
import { cn } from '@/common/lib/utils'

import { Button } from './ui/button'
import { FormControl } from './ui/form'

export type SelectFieldProps<T> = SelectProps & {
  disabled?: boolean
  readOnly?: boolean
  withFormControl?: boolean
  withReset?: boolean
  placeholder?: string
  options: T[] | readonly T[]
  getOptionLabel: (data: NoInfer<T>) => ReactNode
  getOptionValue: (data: NoInfer<T>) => string | number
  onOptionSelect?: (option: NoInfer<T>) => void
  value: string | number
  onValueChange: (value: string | number) => void
  triggerClassName?: string
  tabIndex?: number
}

const SelectFieldComponent = <T,>(
  {
    readOnly = false,
    withFormControl = false,
    withReset = false,
    placeholder,
    options,
    getOptionValue,
    getOptionLabel,
    onOptionSelect,
    triggerClassName,
    disabled,
    tabIndex,
    value,
    onValueChange,
    ...props
  }: SelectFieldProps<T>,
  ref: ForwardedRef<HTMLDivElement>
) => {
  return (
    <Select
      {...props}
      ref={ref}
      selectedKey={value}
      onSelectionChange={(value) => {
        if (options.length !== 0 && value) {
          onValueChange?.(value as string)
          onOptionSelect?.(options.find((option) => String(getOptionValue(option)) === value)!)
        }
      }}
      isDisabled={disabled || options.length === 0}
      placeholder={placeholder}
    >
      {withFormControl ? (
        <FormControl>
          <SelectTrigger
            className={cn('shadow-none focus:ring-2 focus:ring-brand bg-white', triggerClassName)}
            readOnly={readOnly}
          >
            <SelectValue tabIndex={tabIndex} />
            {withReset ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onPointerDown={(e) => {
                  e.stopPropagation()
                  onValueChange?.('')
                }}
                className="ml-auto mr-1 size-5"
              >
                <X className="size-4 opacity-50" />
              </Button>
            ) : null}
          </SelectTrigger>
        </FormControl>
      ) : (
        <SelectTrigger
          className={cn('shadow-none bg-white', triggerClassName)}
          readOnly={readOnly}
        >
          <SelectValue />
          {withReset ? (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onPointerDown={(e) => {
                e.stopPropagation()
                onValueChange?.('')
              }}
              className="ml-auto mr-1 size-5"
            >
              <X className="size-4 opacity-50" />
            </Button>
          ) : null}
        </SelectTrigger>
      )}

      <SelectPopover>
        <SelectListBox className="max-h-[400px]">
          {options.map((option) => (
            <SelectItem
              key={getOptionValue(option)}
              id={String(getOptionValue(option))}
            >
              {getOptionLabel(option)}
            </SelectItem>
          ))}
        </SelectListBox>
      </SelectPopover>
    </Select>
  )
}

export const SelectField = forwardRef(SelectFieldComponent) as <T>(
  props: SelectFieldProps<T> & { ref?: ForwardedRef<HTMLSpanElement> }
) => ReturnType<typeof SelectFieldComponent>
