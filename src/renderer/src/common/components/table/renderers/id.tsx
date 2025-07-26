import { memo, useEffect, useRef } from 'react'

import { Copyable } from '@/common/components/copyable'
import {
  type CellRenderer,
  type GenericTableProps,
  defaultGetRowId
} from '@/common/components/generic-table'
import { Checkbox } from '@/common/components/jolly/checkbox'
import { cn } from '@/common/lib/utils'

const IDCellComponent = memo(
  ({ row, tableProps }: { row: any; tableProps: GenericTableProps<any> }) => {
    const { getRowId, getRowSelected, selectedIds, params } = tableProps ?? {}
    const { onCheckedChange } = params ?? {}

    const inputRef = useRef<HTMLInputElement>(null)

    const id = getRowId ? getRowId(row) : defaultGetRowId(row)
    const checked = getRowSelected
      ? getRowSelected({
          row,
          selectedIds: Array.isArray(selectedIds) ? selectedIds?.map(String) : [],
          getRowId: getRowId ?? defaultGetRowId
        })
      : selectedIds?.map(String)?.includes(String(id))

    useEffect(() => {
      if (!inputRef.current) return
      const handleClick = (e: MouseEvent) => {
        e.stopPropagation()
      }
      inputRef.current.addEventListener('click', handleClick, true)
      return () => {
        inputRef.current?.removeEventListener('click', handleClick, true)
      }
    }, [])

    return (
      <div className="flex items-center gap-2">
        {Array.isArray(selectedIds) ? (
          <Checkbox
            inputRef={inputRef}
            isIndeterminate={checked === 'indeterminate'}
            isSelected={typeof checked === 'boolean' ? checked : false}
            onChange={(isSelected) => {
              if (typeof onCheckedChange === 'function') {
                onCheckedChange(row, !!isSelected)
              }
            }}
            className={cn('size-4', !onCheckedChange && 'pointer-events-none')}
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
