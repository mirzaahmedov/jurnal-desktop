import type { MainbookFormValues } from './config'
import type { ProvodkaRow } from './provodki'

import { memo } from 'react'

import {
  type EditableColumnDef,
  EditableTable,
  type EditableTableProps
} from '@/common/components/editable-table'
import { cn } from '@/common/lib/utils'

export interface MainbookTableProps
  extends Omit<EditableTableProps<MainbookFormValues, 'childs'>, 'columnDefs'> {
  columns: EditableColumnDef<ProvodkaRow>[]
}
export const MainbookTable = memo(({ columns, ...props }: MainbookTableProps) => {
  return (
    <EditableTable
      columnDefs={columns}
      getRowClassName={({ index, rows }) =>
        cn(
          '[&_input]:p-1 scroll-my-32',
          index === (rows?.length ?? 0) - 1 &&
            '[&_input]:font-bold sticky bottom-0 z-50 shadow-sm-up'
        )
      }
      getEditorProps={({ index, rows }) => {
        return index === (rows?.length ?? 0) - 1 ? { readOnly: true } : {}
      }}
      {...props}
    />
  )
})
