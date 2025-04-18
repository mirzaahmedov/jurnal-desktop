import { useTranslation } from 'react-i18next'

import { getMonthName } from '@/common/lib/date'

import { JollySelect, type JollySelectProps, SelectItem } from './jolly/select'

interface MonthOption {
  value: number
}
const monthOptions: MonthOption[] = []

for (let i = 1; i <= 12; i++) {
  monthOptions.push({
    value: i
  })
}

export interface MonthSelectProps extends Omit<JollySelectProps<MonthOption>, 'children'> {}
export const MonthSelect = (props: MonthSelectProps) => {
  const { t } = useTranslation()
  return (
    <JollySelect
      placeholder={t('month')}
      items={monthOptions}
      {...props}
    >
      {(item) => <SelectItem id={item.value}>{t(getMonthName(item.value))}</SelectItem>}
    </JollySelect>
  )
}
