import type { ProvodkaRow } from './provodki'

import {
  type EditableColumnDef,
  EditableTable,
  type EditableTableProps
} from '@/common/components/editable-table'
import { cn } from '@/common/lib/utils'

export interface PrixodbookTableProps
  extends Omit<EditableTableProps<ProvodkaRow>, 'columnDefs' | 'data'> {
  columns: EditableColumnDef<ProvodkaRow>[]
  data: ProvodkaRow[]
}
export const PrixodbookTable = ({ columns, data, ...props }: PrixodbookTableProps) => {
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
