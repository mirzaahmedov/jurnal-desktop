import type { OrganSaldoFormValues } from '../config'

import { memo } from 'react'

import { EditableTable, type EditableTableProps } from '@/common/components/editable-table'
import { cn } from '@/common/lib/utils'

export const OrganSaldoTable = memo(
  (props: EditableTableProps<OrganSaldoFormValues, 'organizations'>) => {
    return (
      <EditableTable
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
  }
)
