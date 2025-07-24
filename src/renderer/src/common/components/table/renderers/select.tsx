import { memo, useEffect, useRef } from 'react'

import {
  type CellRenderer,
  type GenericTableProps,
  defaultGetRowId
} from '@/common/components/generic-table'
import { Checkbox } from '@/common/components/jolly/checkbox'
import { cn } from '@/common/lib/utils'

const SelectCellComponent = memo(
  ({ row, tableProps }: { row: any; tableProps: GenericTableProps<any> }) => {
    const { getRowId, getRowSelected, selectedIds, params } = tableProps ?? {}
    const { onCheckedChange } = params ?? {}

    const inputRef = useRef<HTMLInputElement>(null)

    const id = getRowId ? getRowId(row) : defaultGetRowId(row)
    const checked = getRowSelected
      ? getRowSelected({
          row,
          selectedIds: Array.isArray(selectedIds) ? selectedIds : [],
          getRowId: getRowId ?? defaultGetRowId
        })
      : selectedIds?.includes(id)

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
      </div>
    )
  }
)

export const SelectCell: CellRenderer<any> = (row, _, props) => {
  return (
    <SelectCellComponent
      row={row}
      tableProps={props}
    />
  )
}
