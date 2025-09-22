import type { FC, MutableRefObject, RefCallback } from 'react'

import { cva } from 'class-variance-authority'
import { NumericFormat } from 'react-number-format'

import { cn } from '@/common/lib/utils'

export interface EditorContext {
  arrayName: string
}
export interface EditorProps {
  isNumeric?: boolean
  disabled?: boolean
  inputRef?: MutableRefObject<HTMLInputElement> | RefCallback<HTMLInputElement>
  context: EditorContext
  value: unknown
  onValueChange: (value: unknown) => void
  onKeyDown?: (e: KeyboardEvent) => void
  onBlur?: () => void
  rowIndex: number
  className?: string
}

export const EditorInput: FC<EditorProps> = (props) => {
  const {
    isNumeric,
    value,
    onValueChange,
    onBlur,
    className,
    inputRef,
    disabled,
    rowIndex,
    onKeyDown
  } = props
  return isNumeric ? (
    <NumericFormat
      autoFocus
      getInputRef={inputRef}
      disabled={disabled}
      value={!isNaN(Number(value)) ? Number(value) || null : 0}
      onValueChange={(values) => {
        onValueChange(values.floatValue ?? 0)
      }}
      onBlur={onBlur}
      onKeyDown={(e) => onKeyDown?.(e.nativeEvent)}
      className={cn(inputVariants({ disabled }), className)}
      data-rowindex={rowIndex}
      thousandSeparator=" "
      decimalSeparator=","
      decimalScale={2}
    />
  ) : (
    <input
      autoFocus
      ref={inputRef}
      disabled={disabled}
      type="text"
      value={value as string}
      onChange={(e) => onValueChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={(e) => onKeyDown?.(e.nativeEvent)}
      className={cn(inputVariants({ disabled }), className)}
      data-rowindex={rowIndex}
    />
  )
}

const inputVariants = cva(
  cn(
    'ag-input-field-input ag-text-field-input',
    'h-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand'
  ),
  {
    variants: {
      disabled: {
        true: 'bg-gray-100 text-gray-400',
        false: 'bg-white'
      }
    }
  }
)
