import { formatNumber } from '@/common/lib/format'
import { cn } from '@/common/lib/utils'

export interface SummaCellProps {
  withColor?: boolean
  summa: number
}
export const SummaCell = ({ summa, withColor }: SummaCellProps) => {
  return (
    <b
      className={cn(
        'font-black',
        withColor ? (summa > 0 ? 'text-teal-500' : summa < 0 ? 'text-red-500' : 'text-brand') : null
      )}
    >
      {formatNumber(summa)}
    </b>
  )
}
