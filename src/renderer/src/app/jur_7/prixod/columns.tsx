import type { ColumnDef } from '@/common/components'
import type { MaterialPrixod } from '@/common/models'

import { ArrowDownLeft } from 'lucide-react'
import { Trans, useTranslation } from 'react-i18next'

// import { useTranslation } from 'react-i18next'

// import { ExpandableList } from '@/common/components/table/renderers/expandable-list'
import { IDCell } from '@/common/components/table/renderers/id'
import { UserCell } from '@/common/components/table/renderers/user'
import { Button } from '@/common/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export const prixodColumns: ColumnDef<MaterialPrixod>[] = [
  {
    sort: true,
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    sort: true,
    fit: true,
    minWidth: 200,
    key: 'doc_num'
  },
  {
    sort: true,
    fit: true,
    minWidth: 200,
    key: 'doc_date',
    renderCell: (row) => formatLocaleDate(row.doc_date)
  },
  {
    fill: true,
    minWidth: 350,
    key: 'kimdan_name',
    header: 'from-who'
  },
  {
    fill: true,
    minWidth: 350,
    key: 'kimga_name',
    header: 'to-whom'
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'summa',
    renderCell: (row) => <b className="font-black">{formatNumber(row.summa)}</b>
  },
  {
    key: 'childs',
    header: 'provodka',
    minWidth: 550,
    renderCell: (row) => {
      return <ExpandableProvodka row={row} />
    }
  },
  {
    fill: true,
    minWidth: 350,
    key: 'opisanie'
  },
  {
    fit: true,
    key: 'user_id',
    minWidth: 200,
    header: 'created-by-user',
    renderCell: (row) => (
      <UserCell
        id={row.user_id}
        fio={row.fio}
        login={row.login}
      />
    )
  }
]

export interface ExpandableProvodkaProps {
  row: MaterialPrixod
}
export const ExpandableProvodka = ({ row }: ExpandableProvodkaProps) => {
  const { t } = useTranslation()
  return (
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
          {row.provodki_array.slice(0, 3).map((item, index) => (
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
        <Popover>
          <div className="w-full">
            <PopoverTrigger asChild>
              <Button
                variant="link"
                className="p-0 text-xs text-brand gap-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                <ArrowDownLeft className="size-4" />
                <Trans>view_all</Trans>
              </Button>
            </PopoverTrigger>
          </div>
          <PopoverContent align="end">
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
          </PopoverContent>
        </Popover>
      ) : null}
    </div>
  )
}
