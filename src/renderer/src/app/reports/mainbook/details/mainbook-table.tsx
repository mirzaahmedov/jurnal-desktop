import type { ProvodkaRow } from './provodki'

import { type EditableColumnDef, EditableTable } from '@/common/components/editable-table'
import { cn } from '@/common/lib/utils'

export interface MainbookTableProps {
  columns: EditableColumnDef<ProvodkaRow>[]
  data: ProvodkaRow[]
}
export const MainbookTable = ({ columns, data }: MainbookTableProps) => {
  return (
    <EditableTable
      columnDefs={columns}
      data={data}
      getRowClassName={({ index, data }) =>
        cn(
          '[&_input]:p-1 ',
          index === (data?.length ?? 0) - 1 &&
            '[&_input]:font-bold sticky bottom-0 z-50 shadow-sm-up'
        )
      }
    />
  )
}
