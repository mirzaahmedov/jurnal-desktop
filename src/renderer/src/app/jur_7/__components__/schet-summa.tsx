import { Wallet } from 'lucide-react'

import { formatNumber } from '@/common/lib/format'

export interface SchetSummaProps {
  schet: string
  summa: number
}
export const SchetSumma = ({ schet, summa }: SchetSummaProps) => {
  return (
    <div className="p-3 rounded-lg border shadow-sm">
      <div className="text-sm mb-1 flex items-center justify-between gap-1">
        {schet} <Wallet className="text-brand size-4" />
      </div>
      <div className="font-bold text-foreground">{formatNumber(summa)}</div>
    </div>
  )
}
