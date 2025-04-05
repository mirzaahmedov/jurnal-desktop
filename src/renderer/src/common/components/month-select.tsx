import { useTranslation } from 'react-i18next'

import { getMonthName } from '@/common/lib/date'

import { SelectField, type SelectFieldProps } from './select-field'

const monthOptions: number[] = []

for (let i = 1; i <= 12; i++) {
  monthOptions.push(i)
}

export interface MonthSelectProps
  extends Omit<
    SelectFieldProps<number>,
    'options' | 'value' | 'onValueChange' | 'getOptionValue' | 'getOptionLabel'
  > {
  value?: number | undefined
  onValueChange?: (value: number | undefined) => void
}
export const MonthSelect = ({ value, onValueChange, ...props }: MonthSelectProps) => {
  const { t } = useTranslation()
  return (
    <SelectField
      value={value ? String(value) : ''}
      onValueChange={(value) => {
        onValueChange?.(value ? Number(value) : undefined)
      }}
      options={monthOptions}
      getOptionValue={(option) => option}
      getOptionLabel={(option) => t(getMonthName(option))}
      placeholder={t('month')}
      {...props}
    />
  )
}
