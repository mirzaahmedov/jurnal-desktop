import type { TwoFFormValues } from './config'
import type { TwoFTableRow } from './interfaces'

import { memo } from 'react'

import {
  type EditableColumnDef,
  EditableTable,
  type EditableTableProps
} from '@/common/components/editable-table'
import { cn } from '@/common/lib/utils'

export interface TwoFTableProps
  extends Omit<EditableTableProps<TwoFFormValues, 'childs'>, 'columnDefs'> {
  columns: EditableColumnDef<TwoFTableRow>[]
}
// fix readonly if there is an issue
export const TwoFTable = memo(({ columns, ...props }: TwoFTableProps) => {
  return (
    <EditableTable
      columnDefs={columns}
      getRowClassName={({ index, rows }) =>
        cn(
          '[&_input]:p-1 scroll-my-32',
          index === 0 &&
            '[&_input]:font-bold sticky top-[var(--editable-table-header-height)] z-50 shadow-sm',
          index === (rows?.length ?? 0) - 1 &&
            '[&_input]:font-bold sticky bottom-0 z-50 shadow-sm-up'
        )
      }
      {...props}
    />
  )
})
