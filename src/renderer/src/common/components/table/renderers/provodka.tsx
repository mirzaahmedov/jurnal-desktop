import { formatNumber } from '@/common/lib/format'

interface ProvodkaChild {
  provodki_schet: string
  provodki_sub_schet: string
}

export interface ProvodkaCellProps {
  summa: number
  provodki: ProvodkaChild[]
}
export const ProvodkaCell = ({ summa }: ProvodkaCellProps) => {
  return <b className="font-black">{formatNumber(summa)}</b>
}
