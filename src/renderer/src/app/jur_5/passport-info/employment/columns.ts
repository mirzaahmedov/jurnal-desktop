import type { ColumnDef } from '@/common/components'
import type { Employment } from '@/common/models/employment'

import { t } from 'i18next'

import { IDCell } from '@/common/components/table/renderers/id'
import { SummaCell } from '@/common/components/table/renderers/summa'

export const EmploymentColumnDefs: ColumnDef<Employment>[] = [
  {
    key: 'id',
    renderCell: IDCell,
    width: 160,
    minWidth: 160
  },
  {
    key: 'rayon'
  },
  {
    key: 'doljnostName',
    header: 'doljnost'
  },
  {
    key: 'prikazStart',
    header: 'order_number'
  },
  {
    key: 'dateStart',
    header: 'start_date'
  },
  {
    key: 'dateFinish',
    header: 'end_date',
    renderCell: (row) => (row.dateFinish ? row.dateFinish : t('untill_now'))
  },
  {
    key: 'summa',
    renderCell: SummaCell
  },
  {
    key: 'stavka'
  }
]
