import type { OstatokProduct } from '@/common/models/ostatok'

import { Trans } from 'react-i18next'

import { type ColumnDef, Copyable } from '@/common/components'
import { DataList } from '@/common/components/data-list'
import { HoverInfoCell } from '@/common/components/table/renderers'
import { IDCell } from '@/common/components/table/renderers/id'
import { formatLocaleDate, formatNumber } from '@/common/lib/format'

export const ostatokProductColumns: ColumnDef<OstatokProduct>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    minWidth: 160
  },
  {
    key: 'name',
    minWidth: 400,
    renderCell: (row) => (
      <HoverInfoCell
        title={<span className="text-xs">{row.name}</span>}
        hoverContent={
          <DataList
            className="min-w-52"
            list={[
              {
                name: <Trans>id</Trans>,
                value: (
                  <Copyable
                    side="start"
                    value={row.name}
                  >
                    #{row.product_id}
                  </Copyable>
                )
              },
              {
                name: <Trans>name</Trans>,
                value: row.name
              },
              {
                name: <Trans>ei</Trans>,
                value: `${row.edin}`
              },
              {
                name: <Trans>inventar-num</Trans>,
                value: row.inventar_num
              },
              {
                name: <Trans>serial-num</Trans>,
                value: row.serial_num
              }
            ]}
          />
        }
      />
    )
  },
  {
    key: 'edin',
    header: 'ei',
    minWidth: 100
  },
  {
    key: 'responsible',
    header: 'responsible_short',
    minWidth: 200,
    renderCell: (row) => (
      <HoverInfoCell
        title={row.fio}
        secondaryText={<Copyable value={row.responsible_id}>#{row.responsible_id}</Copyable>}
        hoverContent={null}
      />
    )
  },
  {
    key: 'group_id',
    header: 'group',
    minWidth: 260,
    renderCell: (row) => (
      <HoverInfoCell
        title={<span className="text-xs">{row.group_name}</span>}
        hoverContent={
          <DataList
            list={[
              {
                name: <Trans>id</Trans>,
                value: <Copyable value={row.group_id}>#{row.group_id}</Copyable>
              },
              {
                name: <Trans>name</Trans>,
                value: row.group_name
              },
              {
                name: <Trans>number</Trans>,
                value: row.group_number
              }
            ]}
          />
        }
      />
    )
  },
  {
    key: 'debet_schet',
    header: 'schet'
  },
  {
    numeric: true,
    key: 'from.kol',
    header: 'Начало Кол.',
    renderCell: (row) => row.from?.kol
  },
  {
    numeric: true,
    key: 'from.summa',
    header: 'Начало Сумма',
    renderCell: (row) => formatNumber(row.from?.summa)
  },
  {
    numeric: true,
    key: 'internal.prixod.kol',
    header: 'Приход Кол.',
    renderCell: (row) => row.internal?.kol_prixod
  },
  {
    numeric: true,
    key: 'internal.prixod.summa',
    header: 'Приход Сумма',
    renderCell: (row) => formatNumber(row.internal?.summa_prixod)
  },
  {
    numeric: true,
    key: 'internal.rasxod.kol',
    header: 'Расход Кол.',
    renderCell: (row) => row.internal?.kol_rasxod
  },
  {
    numeric: true,
    key: 'internal.rasxod.summa',
    header: 'Расход Сумма',
    renderCell: (row) => formatNumber(row.internal?.summa_rasxod)
  },
  {
    numeric: true,
    key: 'to.kol',
    header: 'Конец Кол.',
    renderCell: (row) => row.to?.kol
  },
  {
    numeric: true,
    key: 'to.summa',
    header: 'Конец Сумма',
    renderCell: (row) => formatNumber(row.to?.summa)
  },
  {
    key: 'prixod_data.doc_date',
    header: 'Дата',
    renderCell: (row) => formatLocaleDate(row.prixodData?.docDate)
  }
]
