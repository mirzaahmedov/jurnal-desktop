import type { FieldError } from 'react-hook-form'

import { useEffect, useMemo, useState } from 'react'

import { useFilter } from 'react-aria-components'

import { AutoComplete } from '@/common/components/auto-complete'
import { ComboboxItem, type JollyComboBoxProps } from '@/common/components/jolly/combobox'
import { useEventCallback } from '@/common/hooks'
import { cn } from '@/common/lib/utils'

export interface AutoCompleteTextProps
  extends Omit<
    JollyComboBoxProps<any>,
    | 'children'
    | 'error'
    | 'items'
    | 'selectedKey'
    | 'onSelectionChange'
    | 'inputValue'
    | 'onInputChange'
  > {
  tabIndex?: number
  items: string[]
  value: string
  error?: FieldError | undefined
  isPending?: boolean
  onChange: (value: string) => void
}
export const AutoCompleteText = ({
  tabIndex,
  items,
  error,
  value,
  editor = true,
  className,
  onChange,
  isPending = false,
  isDisabled = false,
  ...props
}: AutoCompleteTextProps) => {
  const [inputValue, setInputValue] = useState(value)

  const { startsWith } = useFilter({
    sensitivity: 'base'
  })

  const onChangeEvent = useEventCallback(onChange)
  const filteredOptions = useMemo(() => {
    return items.filter((item) => startsWith(item, inputValue))
  }, [items, inputValue, startsWith])

  useEffect(() => {
    if (isPending) {
      return
    }
    setInputValue(value ?? '')
    onChangeEvent(value ?? '')
  }, [value, isPending, items])

  return (
    <AutoComplete
      items={filteredOptions}
      isDisabled={isPending || isDisabled}
      className={cn('gap-0 w-32', className)}
      tabIndex={tabIndex}
      selectedKey={value}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSelectionChange={(key) => {
        onChange((key as string) || '')
      }}
      editor={editor}
      error={!!error?.message}
      {...props}
    >
      {(item) => (
        <ComboboxItem id={item.schet}>
          {item.schet} ({item.schet6})
        </ComboboxItem>
      )}
    </AutoComplete>
  )
}
