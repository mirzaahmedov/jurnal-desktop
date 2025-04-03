import { useTranslation } from 'react-i18next'

import { Copyable } from '@/common/components/copyable'
import { formatNumber } from '@/common/lib/format'

import { HoverInfoCell } from './hover-info'

interface ProvodkaChild {
  provodki_schet: string
  provodki_sub_schet: string
}

export interface ProvodkaCellProps {
  summa: number
  provodki: ProvodkaChild[]
}
export const ProvodkaCell = ({ summa, provodki }: ProvodkaCellProps) => {
  const { t } = useTranslation()
  return (
    <HoverInfoCell
      title={<b className="font-black">{formatNumber(summa)}</b>}
      hoverContent={
        <ul className="text-foreground flex flex-col gap-y-2">
          <ul className="flex items-center justify-between">
            <li className="font-bold text-xs border-b border-slate-100 pb-2 uppercase">
              {t('schet')}
            </li>
            <li className="col-span-full font-bold text-xs border-b border-slate-100 pb-2 mb-2 uppercase">
              {t('subschet')}
            </li>
          </ul>
          {Array.isArray(provodki)
            ? provodki.map((p, i) => (
                <ul
                  key={i}
                  className="flex justify-between"
                >
                  <li>
                    <Copyable value={p.provodki_schet}>{p.provodki_schet}</Copyable>
                  </li>
                  <li className="col-span-full">
                    <Copyable
                      side="start"
                      value={p.provodki_sub_schet}
                    >
                      {p.provodki_sub_schet}
                    </Copyable>
                  </li>
                </ul>
              ))
            : null}
        </ul>
      }
    />
  )
}
