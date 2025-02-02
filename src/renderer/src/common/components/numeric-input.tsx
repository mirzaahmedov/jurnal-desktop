import type { InputProps } from './ui/input'
import type { NumericFormatProps } from 'react-number-format'

import { forwardRef, useRef } from 'react'

import { NumericFormat } from 'react-number-format'

import { cn } from '@/common/lib/utils'

import { Input } from './ui/input'

export type NumericInputProps = NumericFormatProps<InputProps> & {
  adjustWidth?: boolean
}
export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ className, adjustWidth, ...props }, forwardedRef) => {
    const inputRef = useRef<HTMLInputElement>()

    return (
      <NumericFormat
        getInputRef={(ref: HTMLInputElement) => {
          inputRef.current = ref
          if (typeof forwardedRef === 'function') {
            forwardedRef(ref)
          } else if (forwardedRef) {
            forwardedRef.current = ref
          }
        }}
        allowNegative
        allowLeadingZeros={false}
        thousandSeparator=" "
        decimalSeparator=","
        decimalScale={2}
        customInput={Input}
        className={cn('text-end', className)}
        {...props}
        onValueChange={(values, src) => {
          props.onValueChange?.(values, src)
          if (adjustWidth) {
            const input = inputRef.current
            if (input) {
              input.style.minWidth = `${input.value.length}ch`
            }
          }
        }}
        onChange={undefined}
      />
    )
  }
)

NumericInput.displayName = 'NumericInput'
