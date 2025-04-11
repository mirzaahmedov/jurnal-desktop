import type { InputProps } from './ui/input'
import type { NumericFormatProps } from 'react-number-format'

import { forwardRef, useLayoutEffect, useRef } from 'react'

import { NumericFormat } from 'react-number-format'

import { cn } from '@/common/lib/utils'

import { Input } from './ui/input'

export type NumericInputProps = Omit<NumericFormatProps<InputProps>, 'getInputRef'> & {
  adjustWidth?: boolean
}
export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ className, adjustWidth, ...props }, forwardedRef) => {
    const inputRef = useRef<HTMLInputElement>()

    useLayoutEffect(() => {
      if (adjustWidth) {
        const input = inputRef.current
        if (input) {
          const size = input.value.length - 1
          requestAnimationFrame(() => {
            input.style.minWidth = `${size + 1}ch`
          })
        }
      }
    }, [adjustWidth, props.value])

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
        onValueChange={props.onValueChange}
      />
    )
  }
)

NumericInput.displayName = 'NumericInput'
