import type { MainZarplata } from '@/common/models'

import { GenericTable, type GenericTableProps } from '@/common/components'

import { MainZarplataColumnDefs } from './columns'

export const MainZarplataTable = (
  props: Partial<GenericTableProps<MainZarplata>> & Pick<GenericTableProps<MainZarplata>, 'data'>
) => {
  return (
    <GenericTable
      columnDefs={MainZarplataColumnDefs}
      className="table-generic-xs"
      {...props}
    />
  )
}
