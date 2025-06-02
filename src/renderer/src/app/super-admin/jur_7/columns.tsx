import type { AdminMaterial, AdminMaterialMainSchet } from './interfaces'
import type { ColumnDef } from '@/common/components'

import { SummaCell } from '@/common/components/table/renderers/summa'

export const AdminMaterialRegionColumnDefs: ColumnDef<AdminMaterial>[] = [
  {
    key: 'name'
  },
  {
    numeric: true,
    minWidth: 300,
    key: 'summa_from',
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_from}
      />
    )
  },
  {
    numeric: true,
    minWidth: 300,
    key: 'summa_to',
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_to}
      />
    )
  }
]

export const AdminMaterialMainSchetColumnDefs: ColumnDef<AdminMaterialMainSchet>[] = [
  {
    key: 'account_number',
    header: 'raschet-schet'
  },
  {
    key: 'jur1_schet',
    header: 'schet'
  },
  {
    key: 'budjet_name',
    header: 'budjet',
    width: 400
  },
  {
    numeric: true,
    key: 'summa_from',
    width: 300,
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_from}
      />
    )
  },
  {
    numeric: true,
    key: 'summa_to',
    width: 300,
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_to}
      />
    )
  }
]

// export const AdminMaterialSchetColumnDefs: ColumnDef<AdminMaterialSchet>[] = [
//   {
//     key: 'schet',
//     header: 'schet'
//   },
//   {
//     numeric: true,
//     key: 'summa_from',
//     header: 'summa_from',
//     minWidth: 300,
//     renderCell: (row) => (
//       <SummaCell
//         withColor
//         summa={row.summa_from}
//       />
//     )
//   },
//   {
//     numeric: true,
//     key: 'summa_to',
//     header: 'summa_to',
//     minWidth: 300,
//     renderCell: (row) => (
//       <SummaCell
//         withColor
//         summa={row.summa_to}
//       />
//     )
//   }
// ]
