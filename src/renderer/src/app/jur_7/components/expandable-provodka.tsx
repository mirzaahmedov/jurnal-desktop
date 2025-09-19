import type { MaterialPrixod } from '@/common/models'

import { ArrowDownLeft } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'

import { Button } from '@/common/components/jolly/button'
import { Popover, PopoverDialog, PopoverTrigger } from '@/common/components/jolly/popover'

export interface ExpandableProvodkaProps {
  row: Pick<MaterialPrixod, 'provodki_array'>
}
export const ExpandableProvodka = ({ row }: ExpandableProvodkaProps) => {
  const { t } = useTranslation()
  return Array.isArray(row.provodki_array) ? (
    <div className="flex flex-col items-end">
      <div className="w-full">
        <ul>
          <li className="grid grid-cols-[30px_1fr_1fr_1fr_1fr] gap-2 text-sm mb-5">
            <span className="text-xs font-bold">№</span>
            <span className="text-xs font-bold">
              {t('debet')} {t('schet').toLowerCase()}
            </span>
            <span className="text-xs font-bold">
              {t('debet')} {t('subschet').toLowerCase()}
            </span>
            <span className="text-xs font-bold">
              {t('kredit')} {t('schet').toLowerCase()}
            </span>
            <span className="text-xs font-bold">
              {t('kredit')} {t('subschet').toLowerCase()}
            </span>
          </li>
          {row.provodki_array?.slice(0, 2).map((item, index) => (
            <li
              key={index}
              className="grid grid-cols-[30px_1fr_1fr_1fr_1fr] gap-2 text-sm"
            >
              <span className="text-xs">{index + 1}</span>
              <span className="text-xs">{item.debet_schet}</span>
              <span className="text-xs">{item.debet_sub_schet}</span>
              <span className="text-xs">{item.kredit_schet}</span>
              <span className="text-xs">{item.kredit_sub_schet}</span>
            </li>
          ))}
        </ul>
      </div>
      {row.provodki_array.length > 2 ? (
        <PopoverTrigger>
          <div className="w-full">
            <Button
              variant="link"
              className="p-0 text-xs text-brand gap-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowDownLeft className="size-4" />
              <Trans>view_all</Trans>
            </Button>
          </div>
          <Popover placement="end">
            <PopoverDialog>
              <li className="grid grid-cols-[30px_1fr_1fr_1fr_1fr] gap-2 text-sm mb-5">
                <span className="text-xs font-bold">№</span>
                <span className="text-xs font-bold">
                  {t('debet')} {t('schet').toLowerCase()}
                </span>
                <span className="text-xs font-bold">
                  {t('debet')} {t('subschet').toLowerCase()}
                </span>
                <span className="text-xs font-bold">
                  {t('kredit')} {t('schet').toLowerCase()}
                </span>
                <span className="text-xs font-bold">
                  {t('kredit')} {t('subschet').toLowerCase()}
                </span>
              </li>
              {row.provodki_array.map((item, index) => (
                <li
                  key={index}
                  className="grid grid-cols-[30px_1fr_1fr_1fr_1fr] gap-2 text-sm"
                >
                  <span className="text-xs">{index + 1}</span>
                  <span className="text-xs">{item.debet_schet}</span>
                  <span className="text-xs">{item.debet_sub_schet}</span>
                  <span className="text-xs">{item.kredit_schet}</span>
                  <span className="text-xs">{item.kredit_sub_schet}</span>
                </li>
              ))}
            </PopoverDialog>
          </Popover>
        </PopoverTrigger>
      ) : null}
    </div>
  ) : null
}
