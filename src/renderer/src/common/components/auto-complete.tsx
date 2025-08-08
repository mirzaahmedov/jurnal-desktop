import type { Key } from 'react-aria-components'

import { type RefObject, useEffect, useImperativeHandle } from 'react'

import { useEventCallback } from '@/common/hooks'

import { JollyComboBox, type JollyComboBoxProps } from './jolly/combobox'

export interface AutoCompleteMethods {
  select: (key: Key) => void
}

export interface AutoCompleteProps<T extends object> extends JollyComboBoxProps<T> {
  methods?: RefObject<AutoCompleteMethods>
}

export const AutoComplete = <T extends object>({
  methods,
  inputValue,
  onInputChange,
  selectedKey,
  onSelectionChange,
  items,
  children,
  ...props
}: AutoCompleteProps<T>) => {
  const onInputChangeEvent = useEventCallback(onInputChange)
  const onSelectionChangeEvent = useEventCallback(onSelectionChange)

  useImperativeHandle(
    methods,
    () => ({
      select: (key) => {
        onInputChangeEvent?.((key as string) || '')
        onSelectionChangeEvent?.((key as string) || '')
      }
    }),
    [onInputChangeEvent, onSelectionChangeEvent]
  )

  useEffect(() => {
    if (selectedKey) {
      onInputChangeEvent?.((selectedKey as string) || '')
    } else {
      onInputChangeEvent?.('')
    }
  }, [selectedKey, onInputChangeEvent])

  return (
    <JollyComboBox
      allowsCustomValue
      allowsEmptyCollection
      menuTrigger="focus"
      formValue="text"
      selectedKey={selectedKey}
      onSelectionChange={(key) => {
        if (key) {
          onInputChange?.((key as string) || '')
          onSelectionChange?.(key as string)
        }
      }}
      items={items}
      inputValue={inputValue}
      onOpenChange={(open) => {
        if (!open) {
          onSelectionChange?.(inputValue || '')
        }
      }}
      onInputChange={onInputChange}
      {...props}
    >
      {children}
    </JollyComboBox>
  )
}
