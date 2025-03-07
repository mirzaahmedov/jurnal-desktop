import { Copyable } from '@/common/components/copyable'
import { type CellRenderer, defaultRowIdGetter } from '@/common/components/generic-table'
import { Checkbox } from '@/common/components/ui/checkbox'

export const IDCell: CellRenderer<any> = (row, _, props) => {
  const { getRowId, selectedIds, params } = props ?? {}
  const { onCheckedChange } = params ?? {}

  const id = getRowId ? getRowId(row) : defaultRowIdGetter(row)

  return (
    <div className="flex items-center gap-2">
      {Array.isArray(selectedIds) ? (
        <Checkbox
          checked={selectedIds.includes(Number(id))}
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
