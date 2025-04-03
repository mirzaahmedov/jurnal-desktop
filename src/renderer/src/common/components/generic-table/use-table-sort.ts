import type { ColumnDef, TableSortDirection } from './interface'

import { useState } from 'react'

export const useTableSort = () => {
  const [sorting, setSorting] = useState<{
    order_by: any
    order_type: TableSortDirection
  }>()

  const handleSort = (column: ColumnDef<any>, direction: TableSortDirection) => {
    if (!direction) {
      setSorting(undefined)
      return
    }
    setSorting({ order_by: column.key, order_type: direction })
  }
  const getColumnSorted = (column: ColumnDef<any>) => {
    if (column.key === sorting?.order_by) {
      return sorting.order_type
    }
    return undefined
  }

  return {
    sorting,
    handleSort,
    getColumnSorted
  }
}
