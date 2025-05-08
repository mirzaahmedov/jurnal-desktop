import type {
  HeaderColumnDef,
  VirtualEditableColumnDef,
  VirtualLeafEditableColumnDef
} from './interface'

import { getTreeBreadth, getTreeDepth } from '@/common/lib/tree/utils'

export const getHeaderGroups = <T extends object>(
  columns: VirtualEditableColumnDef<T>[]
): HeaderColumnDef<VirtualEditableColumnDef<T>>[][] => {
  let maxDepth = 0
  columns.forEach((column) => {
    const depth = getTreeDepth({
      node: column,
      getChildren: (node) => node.columns
    })
    if (depth > maxDepth) {
      maxDepth = depth
    }
  })

  const groups = Array.from(
    { length: maxDepth },
    () => [] as HeaderColumnDef<VirtualEditableColumnDef<T>>[]
  )

  const processColumns = (columns: VirtualEditableColumnDef<T>[], rowIndex: number) => {
    const children = [] as VirtualEditableColumnDef<T>[]

    columns.forEach((column) => {
      const leafDepth = getTreeDepth({
        node: column,
        getChildren: (node) => node.columns
      })
      const leafBreadth = getTreeBreadth({
        node: column,
        getChildren: (node) => node.columns
      })

      groups[rowIndex].push({
        ...column,
        _depth: leafDepth,
        _colSpan: leafBreadth,
        _rowSpan: maxDepth / leafDepth
      })

      children.push(...(column.columns ?? []))
    })

    if (!children.length) {
      return
    }

    processColumns(children, rowIndex + 1)
  }

  processColumns(columns, 0)

  return groups
}

export const getLeafColumns = <T extends object>(
  columns: VirtualEditableColumnDef<T>[]
): VirtualLeafEditableColumnDef<T>[] => {
  const accessorColumns = [] as VirtualEditableColumnDef<T>[]

  const processColumns = (columns: VirtualEditableColumnDef<T>[]) => {
    columns.forEach((column) => {
      if (column.columns?.length) {
        processColumns(column.columns)
      } else {
        accessorColumns.push(column)
      }
    })
  }

  processColumns(columns)

  return accessorColumns as VirtualLeafEditableColumnDef<T>[]
}
