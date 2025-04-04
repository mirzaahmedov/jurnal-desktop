import { Trans } from 'react-i18next'

import { getMonthName } from '@/common/lib/date'

interface MonthNameProps {
  monthNumber: number
}
export const MonthNameCell = ({ monthNumber }: MonthNameProps) => {
  const monthName = getMonthName(monthNumber)
  return <Trans>{monthName}</Trans>
}
