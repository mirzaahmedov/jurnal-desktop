import type { Key } from 'react-aria-components'

import { useState } from 'react'

import { useTranslation } from 'react-i18next'

import { ComboboxItem, JollyComboBox, type JollyComboBoxProps } from './jolly/combobox'

interface YearOption {
  value: number
  label: string
}

const yearOptions: YearOption[] = []

for (let i = 2010; i <= 2030; i++) {
  yearOptions.push({
    value: i,
    label: String(i)
  })
}

export interface YearSelectProps extends Omit<JollyComboBoxProps<YearOption>, 'children'> {}
export const YearSelect = ({ selectedKey, onSelectionChange, ...props }: YearSelectProps) => {
  const { t } = useTranslation()

  const [inputValue, setInputValue] = useState(selectedKey ? String(selectedKey) : '')

  console.log({ selectedKey })

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
      onBlur={() => {
        if (!inputValue) {
          setInputValue(props.defaultSelectedKey ? String(props.defaultSelectedKey) : '')
        }
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
