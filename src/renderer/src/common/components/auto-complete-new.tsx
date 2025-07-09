import { useEffect } from 'react'

import { useEventCallback } from '@/common/hooks'

import { JollyComboBox, type JollyComboBoxProps } from './jolly/combobox'

export const AutoComplete = <T extends object>({
  inputValue,
  onInputChange,
  selectedKey,
  onSelectionChange,
  items,
  children,
  ...props
}: JollyComboBoxProps<T>) => {
  const onInputChangeEvent = useEventCallback(onInputChange)

  useEffect(() => {
    if (selectedKey) {
      onInputChangeEvent?.((selectedKey as string) || '')
    } else {
      onInputChangeEvent?.('')
    }
  }, [selectedKey, onInputChangeEvent])
  // Ensure that inputValue is a
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
