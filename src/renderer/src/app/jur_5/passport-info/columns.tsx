import type { ColumnDef } from '@/common/components'
import type { MainZarplata } from '@/common/models'

import { Checkbox } from '@/common/components/jolly/checkbox'
import { SummaCell } from '@/common/components/table/renderers/summa'

export const MainZarplataColumnDefs: ColumnDef<MainZarplata>[] = [
  {
    key: 'kartochka',
    minWidth: 100,
    sort: true,
    header: 'card_num'
  },
  {
    key: 'fio',
    sort: true,
    minWidth: 300
  },
  {
    key: 'spravochnikDoljnostName',
    minWidth: 200,
    sort: true,
    header: 'doljnost',
    renderCell: (row) => <span>{row.doljnostName}</span>
  },
  {
    key: 'spravochikZarplataZvanieName',
    minWidth: 200,
    header: 'military_rank'
  },
  {
    key: 'oklad',
    header: 'oklad',
    numeric: true,
    sort: true,
    renderCell: (row) => <SummaCell summa={row.doljnostOklad} />
  },
  {
    key: 'stavka'
  }
]

export const MainZarplataDetailedColumnDefs: ColumnDef<MainZarplata>[] = [
  { key: 'id', header: 'ID', minWidth: 60 },
  { key: 'kartochka', header: 'card_num', minWidth: 100 },
  { key: 'fio', header: 'fio', minWidth: 200 },
  { key: 'spravochikZarplataZvanieName', header: 'military_rank', minWidth: 150 },
  {
    key: 'xarbiy',
    header: 'military',
    minWidth: 80,
    renderCell: (row) => <Checkbox isSelected={row.xarbiy} />
  },
  { key: 'inn', header: 'inn', minWidth: 120 },
  { key: 'ostanovitRaschet', header: 'stop_calculation', minWidth: 120 },
  { key: 'dateBirth', header: 'date_of_birth', minWidth: 120 },
  { key: 'inps', header: 'inps', minWidth: 120 },
  { key: 'spravochnikZarplataGrafikRabotiName', header: 'grafik', minWidth: 150 },
  { key: 'spravochnikSostavName', header: 'sostav', minWidth: 150 },
  { key: 'stavka', header: 'stavka', minWidth: 100, numeric: true },
  { key: 'nachaloSlujbi', header: 'start_of_service', minWidth: 120 },
  { key: 'doljnostName', header: 'doljnost', minWidth: 150 },
  {
    key: 'doljnostOklad',
    header: 'oklad',
    minWidth: 120,
    numeric: true,
    renderCell: (row) => <SummaCell summa={row.doljnostOklad} />
  },
  { key: 'doljnostPrikazNum', header: 'order_number', minWidth: 100 },
  { key: 'doljnostPrikazDate', header: 'order_date', minWidth: 120 },
  { key: 'spravochnikZarplataIstochnikFinanceName', header: 'source_of_finance', minWidth: 150 }
]
