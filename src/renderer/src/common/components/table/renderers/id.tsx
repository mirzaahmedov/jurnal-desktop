import { memo } from 'react'

import { Copyable } from '@/common/components/copyable'
import {
  type CellRenderer,
  type GenericTableProps,
  defaultGetRowId
} from '@/common/components/generic-table'
import { Checkbox } from '@/common/components/jolly/checkbox'

const IDCellComponent = memo(
  ({ row, tableProps }: { row: any; tableProps: GenericTableProps<any> }) => {
    const { getRowId, getRowSelected, selectedIds, params } = tableProps ?? {}
    const { onCheckedChange } = params ?? {}

    const id = getRowId ? getRowId(row) : defaultGetRowId(row)
    const checked = getRowSelected
      ? getRowSelected({
          row,
          selectedIds: Array.isArray(selectedIds) ? selectedIds : [],
          getRowId: getRowId ?? defaultGetRowId
        })
      : selectedIds?.includes(id)

    return (
      <div className="flex items-center gap-2">
        {Array.isArray(selectedIds) ? (
          <Checkbox
            isIndeterminate={checked === 'indeterminate'}
            isSelected={typeof checked === 'boolean' ? checked : false}
            onChange={(isSelected) => {
              if (typeof onCheckedChange === 'function') {
                onCheckedChange(row, !!isSelected)
              }
            }}
            className="size-4"
          />
        ) : null}
        <Copyable value={id}>
          <b>#{id}</b>
        </Copyable>
      </div>
    )
  }
)

export const IDCell: CellRenderer<any> = (row, _, props) => {
  return (
    <IDCellComponent
      row={row}
      tableProps={props}
    />
  )
}
