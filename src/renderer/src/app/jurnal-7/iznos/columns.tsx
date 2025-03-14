import type { OstatokProduct } from '@renderer/common/models'

import { type ColumnDef, Copyable } from '@renderer/common/components'
import { DataList } from '@renderer/common/components/data-list'
import { HoverInfoCell } from '@renderer/common/components/table/renderers'
import { IDCell } from '@renderer/common/components/table/renderers/id'
import { getMonthName } from '@renderer/common/lib/date'
import { formatLocaleDate, formatNumber } from '@renderer/common/lib/format'

export const iznosColumns: ColumnDef<OstatokProduct>[] = [
  {
    key: 'id',
    renderCell: IDCell
  },
  {
    key: 'name',
    headerClassName: 'min-w-[400px] whitespace-pre-wrap',
    className: 'min-w-[400px] whitespace-pre-wrap'
  },
  {
    key: 'responsible',
    header: 'responsible_short',
    className: 'min-w-[200px]',
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
    renderCell: (row) => (
      <HoverInfoCell
        title={row.group_name}
        hoverContent={
          <DataList
            list={[
              {
                name: 'id',
                value: <Copyable value={row.group_id}>#{row.group_id}</Copyable>
              },
              {
                name: 'name',
                value: row.group_name
              },
              {
                name: 'number',
                value: row.group_number
              }
            ]}
          />
        }
      />
    )
  },
  {
    fit: true,
    key: 'inventar_num',
    header: 'inventar-num',
    renderCell: (row) => row.inventar_num
  },
  {
    fit: true,
    key: 'serial_num',
    header: 'serial-num',
    renderCell: (row) => row.serial_num
  },
  {
    key: 'kol',
    renderCell: (row) => row.to.kol
  },
  {
    numeric: true,
    key: 'sena',
    renderCell: (row) => row.to.sena
  },
  {
    key: 'year'
  },
  {
    key: 'month',
    renderCell: (row) => getMonthName(row.month)
  },
  {
    key: 'iznos_schet',
    header: 'schet'
  },
  {
    key: 'iznos_sub_schet',
    header: 'subschet'
  },
  {
    fit: true,
    key: '',
    header: 'iznos_start_date',
    renderCell: (row) => formatLocaleDate(row.iznos_start)
  },
  {
    numeric: true,
    key: 'iznos_summa',
    header: 'iznos_summa_total',
    renderCell: (row) => formatNumber(row.to.iznos_summa ?? 0)
  },
  {
    numeric: true,
    key: 'iznos_summa_bir_oylik',
    header: 'iznos_summa_month',
    renderCell: (row) => formatNumber(row.month_iznos_summa ?? 0)
  },
  {
    numeric: true,
    key: 'eski_iznos_summa',
    header: 'iznos_summa_old',
    renderCell: (row) => formatNumber(row.eski_iznos_summa)
  }
]
