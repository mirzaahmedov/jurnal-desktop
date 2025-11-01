// Enhanced auto-sizing components with better performance
import { useCallback, useEffect, useRef } from 'react'

import { NumericInput } from '@/common/components'
import { inputVariants } from '@/common/features/spravochnik'

import {
  calculateOptimalWidth,
  createDebouncedColumnSizer,
  measureTextWidthCanvas
} from './column-sizing-utils'

interface AutoSizingNumberInputProps {
  value?: number
  onChange: (value?: number) => void
  readOnly?: boolean
  columnId?: string
  onWidthChange?: (columnId: string, width: number) => void
  adjustWidth?: boolean
  minWidth?: number
  maxWidth?: number
  debounceDelay?: number
}

export const AutoSizingNumberInput = ({
  value,
  onChange,
  readOnly = false,
  columnId,
  onWidthChange,
  adjustWidth = false,
  minWidth = 80,
  maxWidth = 300,
  debounceDelay = 100
}: AutoSizingNumberInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // Create debounced updater
  const debouncedUpdater = useCallback(() => {
    if (onWidthChange && columnId) {
      return createDebouncedColumnSizer(onWidthChange, debounceDelay)
    }
    return null
  }, [onWidthChange, columnId, debounceDelay])

  // Update column width based on content
  useEffect(() => {
    if (adjustWidth && columnId && onWidthChange && inputRef.current) {
      const displayValue = typeof value === 'number' ? (value !== 0 ? value.toString() : '0') : '0'

      const textWidth = measureTextWidthCanvas(displayValue, '14px', 'system-ui, sans-serif')
      const optimalWidth = calculateOptimalWidth(textWidth, minWidth, maxWidth)

      const updater = debouncedUpdater()
      if (updater) {
        updater(columnId, optimalWidth)
      } else {
        onWidthChange(columnId, optimalWidth)
      }
    }
  }, [value, adjustWidth, columnId, onWidthChange, minWidth, maxWidth, debouncedUpdater])

  return (
    <NumericInput
      ref={inputRef}
      readOnly={readOnly}
      value={typeof value === 'number' ? (value !== 0 ? value : '') : ''}
      onValueChange={(values) => onChange?.(values.floatValue ?? 0)}
      className={inputVariants({
        editor: true,
        error: false
      })}
      autoComplete="off"
    />
  )
}

// Enhanced smeta input component would go here as well...
