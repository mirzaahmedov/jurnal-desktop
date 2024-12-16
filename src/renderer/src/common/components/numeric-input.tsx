import type { NumericFormatProps } from 'react-number-format'
import type { InputProps } from './ui/input'

import { forwardRef } from 'react'
import { NumericFormat } from 'react-number-format'
import { Input } from './ui/input'
import { cn } from '@/common/lib/utils'

export type NumericInputProps = NumericFormatProps<InputProps>
export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <NumericFormat
        getInputRef={ref}
        allowNegative
        allowLeadingZeros={false}
        thousandSeparator=" "
        decimalSeparator=","
        decimalScale={2}
        customInput={Input}
        className={cn('text-end', className)}
        {...props}
        onChange={undefined}
      />
    )
  }
)
