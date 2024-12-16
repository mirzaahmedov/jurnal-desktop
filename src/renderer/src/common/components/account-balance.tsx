import { formatNumber } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'

type AccountBalanceProps = {
  balance: number
}

const AccountBalance = ({ balance }: AccountBalanceProps) => {
  if (typeof balance !== 'number' || isNaN(balance)) {
    return null
  }
  return (
    <div className="flex flex-row items-center gap-4">
      <h6 className="text-sm font-medium text-gray-600">Баланс:</h6>
      <p className={cn('font-bold text-base text-teal-500', balance < 0 && 'text-red-500')}>
        {formatNumber(balance)} so'm
      </p>
    </div>
  )
}

export { AccountBalance }
