import type { ColumnDef } from '@/common/components'
import { Copyable } from '@/common/components'
import type { Organization } from '@/common/models'

export const organizationColumns: ColumnDef<Organization>[] = [
  {
    key: 'name',
    header: 'Название'
  },
  {
    key: 'inn',
    header: 'ИНН',
    renderCell(row, col) {
      return (
        <Copyable value={String(row[col.key as keyof Organization])}>
          {row[col.key as keyof Organization]}
        </Copyable>
      )
    }
  },
  {
    key: 'mfo',
    header: 'МФО',
    renderCell(row, col) {
      return (
        <Copyable value={String(row[col.key as keyof Organization])}>
          {row[col.key as keyof Organization]}
        </Copyable>
      )
    }
  },
  {
    key: 'bank_klient',
    header: 'Название банка'
  },
  {
    key: 'raschet_schet',
    header: 'Расчетный счет',
    renderCell(row, col) {
      return (
        <Copyable value={String(row[col.key as keyof Organization])}>
          {row[col.key as keyof Organization]}
        </Copyable>
      )
    }
  },
  {
    key: 'raschet_schet_gazna',
    header: 'Расчетный счет газна',
    renderCell(row, col) {
      return (
        <Copyable value={String(row[col.key as keyof Organization])}>
          {row[col.key as keyof Organization]}
        </Copyable>
      )
    }
  }
]
