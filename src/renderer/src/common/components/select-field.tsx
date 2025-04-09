import type { SelectProps } from '@radix-ui/react-select'
import type { ForwardedRef, ReactNode } from 'react'

import { forwardRef } from 'react'

import { X } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/common/components/ui/select'
import { cn } from '@/common/lib/utils'

import { Button } from './ui/button'
import { FormControl } from './ui/form'

export type SelectFieldProps<T extends object> = SelectProps & {
  readOnly?: boolean
  withFormControl?: boolean
  withReset?: boolean
  placeholder?: string
  options: T[] | readonly T[]
  getOptionLabel: (data: NoInfer<T>) => ReactNode
  getOptionValue: (data: NoInfer<T>) => string | number
  onOptionSelect?: (option: NoInfer<T>) => void
  triggerClassName?: string
  tabIndex?: number
}

const SelectFieldComponent = <T extends object>(
  {
    readOnly = false,
    withFormControl = false,
    withReset = false,
    placeholder,
    options,
    getOptionValue,
    getOptionLabel,
    triggerClassName,
    disabled,
    tabIndex,
    value,
    onValueChange,
    onOptionSelect,
    ...props
  }: SelectFieldProps<T>,
  ref: ForwardedRef<HTMLSpanElement>
) => {
  return (
    <Select
      {...props}
      value={value}
      onValueChange={(value) => {
        if (options.length !== 0 && value) {
          onValueChange?.(value)
        }
      }}
      disabled={disabled || options.length === 0}
    >
      {withFormControl ? (
        <FormControl>
          <SelectTrigger
            className={cn('shadow-none focus:ring-2 focus:ring-brand bg-white', triggerClassName)}
            tabIndex={tabIndex}
            readOnly={readOnly}
          >
            <SelectValue
              placeholder={placeholder}
              ref={ref}
            />
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
          tabIndex={tabIndex}
          readOnly={readOnly}
        >
          <SelectValue
            placeholder={placeholder}
            ref={ref}
          />
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

      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={getOptionValue(option)}
            value={String(getOptionValue(option))}
            onSelect={() => {
              onOptionSelect?.(option)
            }}
          >
            {getOptionLabel(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export const SelectField = forwardRef(SelectFieldComponent) as <T extends object>(
  props: SelectFieldProps<T> & { ref?: ForwardedRef<HTMLSpanElement> }
) => ReturnType<typeof SelectFieldComponent>
