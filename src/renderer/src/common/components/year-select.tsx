import type { Key } from 'react-aria-components'

import { useEffect, useRef, useState } from 'react'

import { useTranslation } from 'react-i18next'

import { ComboboxItem, JollyComboBox, type JollyComboBoxProps } from './jolly/combobox'

interface YearOption {
  value: number
  label: string
}

const currentYear = new Date().getFullYear()
const yearOptions: YearOption[] = []

for (let i = currentYear - 5; i <= currentYear + 5; i++) {
  yearOptions.push({
    value: i,
    label: String(i)
  })
}

export interface YearSelectProps extends Omit<JollyComboBoxProps<YearOption>, 'children'> {}
export const YearSelect = ({ selectedKey, onSelectionChange, ...props }: YearSelectProps) => {
  const isFocused = useRef(false)

  const [inputValue, setInputValue] = useState(selectedKey ? String(selectedKey) : '')

  const { t } = useTranslation()

  const handleSelectionChange = (id: Key | null) => {
    const exists = yearOptions.find((item) => item.value === id)
    if (exists) {
      setInputValue(exists.label)
      onSelectionChange?.(id)
      return
    }

    if (inputValue !== '' && !isNaN(Number(inputValue))) {
      const year = Number(inputValue)
      setInputValue(year.toString())
      onSelectionChange?.(year)
      return
    }

    setInputValue('')
    onSelectionChange?.(null)
  }

  const handleInputChange = (value: string) => {
    setInputValue(value)
    if (value === '') {
      onSelectionChange?.(null)
    }
  }

  useEffect(() => {
    if (isFocused.current) {
      return
    }

    if (selectedKey) {
      setInputValue(String(selectedKey))
    } else {
      setInputValue('')
    }
  }, [selectedKey])

  return (
    <JollyComboBox
      {...props}
      allowsCustomValue
      formValue="text"
      placeholder={t('year')}
      selectedKey={selectedKey}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onSelectionChange={handleSelectionChange}
      onOpenChange={(open) => {
        if (!open && !inputValue) {
          setInputValue(selectedKey ? String(selectedKey) : '')
        }
      }}
      onFocus={() => {
        isFocused.current = true
      }}
      onBlur={() => {
        isFocused.current = false
      }}
      defaultItems={yearOptions}
      defaultFilter={(optionText, filterText) => {
        return optionText.toLowerCase().startsWith(filterText.toLowerCase())
      }}
    >
      {(item) => <ComboboxItem id={item.value}>{item.label}</ComboboxItem>}
    </JollyComboBox>
  )
}
