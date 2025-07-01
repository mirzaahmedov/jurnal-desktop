import { Copyable } from '@/common/components/copyable'
import { type CellRenderer, defaultGetRowId } from '@/common/components/generic-table'
import { Checkbox } from '@/common/components/ui/checkbox'

export const IDCell: CellRenderer<any> = (row, _, props) => {
  const { getRowId, getRowSelected, selectedIds, params } = props ?? {}
  const { onCheckedChange } = params ?? {}

  const id = getRowId ? getRowId(row) : defaultGetRowId(row)

  return (
    <div className="flex items-center gap-2">
      {Array.isArray(selectedIds) ? (
        <Checkbox
          checked={
            getRowSelected
              ? getRowSelected({
                  row,
                  selectedIds,
                  getRowId: getRowId ?? defaultGetRowId
                })
              : selectedIds.includes(id)
          }
          onCheckedChange={(checked) => {
            if (typeof onCheckedChange === 'function') {
              onCheckedChange(row, !!checked)
            }
          }}
          className="size-5"
        />
      ) : null}
      <Copyable value={id}>
        <b>#{id}</b>
      </Copyable>
    </div>
  )
}
