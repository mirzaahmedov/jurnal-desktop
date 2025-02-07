import { formatNumber } from '@renderer/common/lib/format'
import { useTranslation } from 'react-i18next'

import { TooltipCell } from './tooltip'

export interface ProvodkaCellProps {
  summa: number
  schet: string
  sub_schet: string
}
export const ProvodkaCell = ({ summa, schet, sub_schet }: ProvodkaCellProps) => {
  const { t } = useTranslation()
  return (
    <TooltipCell<Omit<ProvodkaCellProps, 'summa'>>
      data={{
        schet,
        sub_schet
      }}
      title={formatNumber(summa)}
      elements={{
        schet: t('schet'),
        sub_schet: t('subschet')
      }}
      className="text-start"
    />
  )
}
