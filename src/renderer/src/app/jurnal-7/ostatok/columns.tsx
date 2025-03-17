import type { OstatokProduct } from '@renderer/common/models/ostatok'

import { type ColumnDef, Copyable } from '@renderer/common/components'
import { DataList } from '@renderer/common/components/data-list'
import { HoverInfoCell } from '@renderer/common/components/table/renderers'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { formatLocaleDate, formatNumber } from '@renderer/common/lib/format'
import { Trans } from 'react-i18next'

export const ostatokProductColumns: ColumnDef<OstatokProduct>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    minWidth: 180
  },
  {
    key: 'name',
    minWidth: 400,
    renderCell: (row) => (
      <HoverInfoCell
        title={row.name}
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
        title={row.group_name}
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
    numeric: true,
    key: 'from.kol',
    header: 'Начало Кол.',
    renderCell: (row) => formatNumber(row.from.kol)
  },
  {
    numeric: true,
    key: 'from.summa',
    header: 'Начало Сумма',
    renderCell: (row) => formatNumber(row.from.summa)
  },
  {
    numeric: true,
    key: 'internal.prixod.kol',
    header: 'Приход Кол.',
    renderCell: (row) => formatNumber(row.internal?.kol_prixod)
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
    renderCell: (row) => formatNumber(row.internal?.kol_rasxod)
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
    renderCell: (row) => `x${row.to.kol}`
  },
  {
    numeric: true,
    key: 'to.summa',
    header: 'Конец Сумма',
    renderCell: (row) => formatNumber(row.to.summa)
  },
  {
    key: 'prixod_data.doc_date',
    header: 'Дата',
    renderCell: (row) => formatLocaleDate(row.prixodData?.docDate)
  }
]
