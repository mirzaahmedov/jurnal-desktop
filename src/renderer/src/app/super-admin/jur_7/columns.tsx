import type { AdminMaterial, AdminMaterialMainSchet } from './interfaces'
import type { ColumnDef } from '@/common/components'

import { SummaCell } from '@/common/components/table/renderers/summa'

export const AdminMaterialRegionColumnDefs: ColumnDef<AdminMaterial>[] = [
  {
    key: 'name'
  },
  {
    numeric: true,
    minWidth: 200,
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
    minWidth: 200,
    key: 'prixod',
    renderCell: (row) => <SummaCell summa={row.prixod} />
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'rasxod',
    renderCell: (row) => <SummaCell summa={row.rasxod} />
  },
  {
    numeric: true,
    minWidth: 200,
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
    key: 'budjet_name',
    header: 'budjet',
    width: 400
  },
  {
    numeric: true,
    key: 'summa_from',
    width: 200,
    renderCell: (row) => (
      <SummaCell
        withColor
        summa={row.summa_from}
      />
    )
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'prixod',
    renderCell: (row) => <SummaCell summa={row.prixod} />
  },
  {
    numeric: true,
    minWidth: 200,
    key: 'rasxod',
    renderCell: (row) => <SummaCell summa={row.rasxod} />
  },
  {
    numeric: true,
    key: 'summa_to',
    width: 200,
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
//     minWidth: 200,
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
//     minWidth: 200,
//     renderCell: (row) => (
//       <SummaCell
//         withColor
//         summa={row.summa_to}
//       />
//     )
//   }
// ]
