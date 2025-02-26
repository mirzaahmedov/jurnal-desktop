import { formatNumber } from '@renderer/common/lib/format'
import { useTranslation } from 'react-i18next'
import { Fragment } from 'react/jsx-runtime'

import { Copyable } from '@/common/components/copyable'

import { HoverInfoCell } from './hover-info'

interface ProvodkaItem {
  provodki_schet: string
  provodki_sub_schet: string
}

export interface ProvodkaCellProps {
  summa: number
  provodki: ProvodkaItem[]
}
export const ProvodkaCell = ({ summa, provodki }: ProvodkaCellProps) => {
  const { t } = useTranslation()
  return (
    <HoverInfoCell
      title={formatNumber(summa)}
      hoverContent={
        <ul className="text-foreground grid grid-cols-2 grid-flow-col auto-cols-max gap-x-5 gap-y-2">
          <li className="font-bold text-xs border-b border-slate-100 pb-2 uppercase">
            {t('schet')}
          </li>
          <li className="col-span-full font-bold text-xs border-b border-slate-100 pb-2 mb-2 uppercase">
            {t('subschet')}
          </li>
          {provodki.map((p, i) => (
            <Fragment key={i}>
              <li>
                <Copyable
                  side="start"
                  value={p.provodki_schet}
                >
                  {p.provodki_schet}
                </Copyable>
              </li>
              <li className="col-span-full">
                <Copyable
                  side="start"
                  value={p.provodki_sub_schet}
                >
                  {p.provodki_sub_schet}
                </Copyable>
              </li>
            </Fragment>
          ))}
        </ul>
      }
    />
  )
}
