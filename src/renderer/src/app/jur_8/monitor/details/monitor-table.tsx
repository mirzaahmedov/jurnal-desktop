import type { JUR8MonitorFormValues } from './config'
import type { JUR8MonitorChild } from '@/common/models'

import {
  type EditableColumnDef,
  EditableTable,
  type EditableTableProps
} from '@/common/components/editable-table'
import { cn } from '@/common/lib/utils'

export interface MonitorTableProps
  extends Omit<EditableTableProps<JUR8MonitorFormValues>, 'columnDefs' | 'data'> {
  columns: EditableColumnDef<JUR8MonitorChild>[]
}
export const MonitorTable = ({ columns, ...props }: MonitorTableProps) => {
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
      {...props}
    />
  )
}
