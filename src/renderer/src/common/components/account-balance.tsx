import { useTranslation } from 'react-i18next'

import { formatNumber } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'

interface AccountBalanceProps {
  balance: number
}

export const AccountBalance = ({ balance }: AccountBalanceProps) => {
  if (typeof balance !== 'number' || isNaN(balance)) {
    return null
  }
  const { t } = useTranslation()
  return (
    <div className="flex flex-row items-center gap-2">
      <h6 className="text-sm font-semibold text-gray-600">{t('balance')}:</h6>
      <p className={cn('font-bold text-base text-teal-500', balance < 0 && 'text-red-500')}>
        {formatNumber(balance)} {t('sum')}
      </p>
    </div>
  )
}
