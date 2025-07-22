import type { OdinoxFormValues } from './config'
import type { OdinoxTableRow } from './interfaces'

import { memo } from 'react'

import {
  type EditableColumnDef,
  EditableTable,
  type EditableTableProps
} from '@/common/components/editable-table'
import { cn } from '@/common/lib/utils'

export interface OdinoxTableProps
  extends Omit<EditableTableProps<OdinoxFormValues, 'childs'>, 'columnDefs'> {
  columns: EditableColumnDef<OdinoxTableRow>[]
}
// fix readonly if there is an issue
export const OdinoxTable = memo(({ columns, ...props }: OdinoxTableProps) => {
  return (
    <EditableTable
      columnDefs={columns}
      getRowClassName={({ index, rows }) =>
        cn(
          '[&_input]:p-1 scroll-my-32',
          index === 0 && '[&_input]:font-bold sticky top-[145px] z-50 shadow-sm',
          index === (rows?.length ?? 0) - 1 &&
            '[&_input]:font-bold sticky bottom-0 z-50 shadow-sm-up'
        )
      }
      {...props}
    />
  )
})
