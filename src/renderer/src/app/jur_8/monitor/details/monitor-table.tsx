import type { JUR8MonitorChild } from '@/common/models'

import {
  type EditableColumnDef,
  EditableTable,
  type EditableTableProps
} from '@/common/components/editable-table'
import { cn } from '@/common/lib/utils'

export interface MonitorTableProps
  extends Omit<EditableTableProps<JUR8MonitorChild>, 'columnDefs' | 'data'> {
  columns: EditableColumnDef<JUR8MonitorChild>[]
  data: JUR8MonitorChild[]
}
export const MonitorTable = ({ columns, data, ...props }: MonitorTableProps) => {
  return (
    <EditableTable
      columnDefs={columns}
      data={data}
      getRowClassName={({ index, data }) =>
        cn(
          '[&_input]:p-1 scroll-my-32',
          index === (data?.length ?? 0) - 1 &&
            '[&_input]:font-bold sticky bottom-0 z-50 shadow-sm-up'
        )
      }
      {...props}
    />
  )
}
