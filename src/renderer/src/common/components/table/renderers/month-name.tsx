import { getMonthName } from '@renderer/common/lib/date'
import { Trans } from 'react-i18next'

interface MonthNameProps {
  monthNumber: number
}
export const MonthNameCell = ({ monthNumber }: MonthNameProps) => {
  const monthName = getMonthName(monthNumber)
  return <Trans>{monthName}</Trans>
}
