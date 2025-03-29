import { useTranslation } from 'react-i18next'

import { SelectField, type SelectFieldProps } from './select-field'

const yearOptions: number[] = []

for (let i = 1970; i <= 2050; i++) {
  yearOptions.push(i)
}

export interface YearSelectProps
  extends Omit<
    SelectFieldProps<number>,
    'options' | 'value' | 'onValueChange' | 'getOptionValue' | 'getOptionLabel'
  > {
  value?: number
  onValueChange?: (value: number) => void
}
export const YearSelect = ({ value, onValueChange, ...props }: YearSelectProps) => {
  const { t } = useTranslation()
  return (
    <SelectField
      value={value ? String(value) : undefined}
      onValueChange={(value) => {
        onValueChange?.(Number(value))
      }}
      options={yearOptions}
      getOptionValue={(option) => option}
      getOptionLabel={(option) => option}
      placeholder={t('year')}
      {...props}
    />
  )
}
