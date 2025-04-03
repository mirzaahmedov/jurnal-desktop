import { formatNumber } from '@/common/lib/format'

export interface SummaCellProps {
  summa: number
}
export const SummaCell = ({ summa }: SummaCellProps) => {
  return <b className="font-black">{formatNumber(summa)}</b>
}
