import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/common/components/ui/select'

import { FormControl } from './ui/form'
import type { ForwardedRef } from 'react'
import type { SelectProps } from '@radix-ui/react-select'
import { cn } from '@/common/lib/utils'
import { forwardRef } from 'react'

type SelectFieldProps<T> = SelectProps & {
  withFormControl?: boolean
  placeholder: string
  options: T[]
  getOptionLabel(data: T): string
  getOptionValue(data: T): string | number
  triggerClassName?: string
}

const SelectFieldComponent = <T extends Record<string, unknown>>(
  props: SelectFieldProps<T>,
  ref: ForwardedRef<HTMLSpanElement>
) => {
  const {
    withFormControl = false,
    placeholder,
    options,
    getOptionValue,
    getOptionLabel,
    triggerClassName,
    disabled,
    ...rest
  } = props
  return (
    <Select
      {...rest}
      disabled={disabled || options.length === 0}
    >
      {withFormControl ? (
        <FormControl>
          <SelectTrigger
            className={cn('shadow-none focus:ring-2 focus:ring-brand', triggerClassName)}
          >
            <SelectValue
              placeholder={placeholder}
              ref={ref}
            />
          </SelectTrigger>
        </FormControl>
      ) : (
        <SelectTrigger className={cn('shadow-none', triggerClassName)}>
          <SelectValue
            placeholder={placeholder}
            ref={ref}
          />
        </SelectTrigger>
      )}

      <SelectContent>
        {options.map((option) => (
          <SelectItem
            key={getOptionValue(option)}
            value={String(getOptionValue(option))}
          >
            {getOptionLabel(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export const SelectField = forwardRef(SelectFieldComponent) as <T>(
  props: SelectFieldProps<T> & { ref?: ForwardedRef<HTMLSpanElement> }
) => ReturnType<typeof SelectFieldComponent>

export type { SelectFieldProps }
