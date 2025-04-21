import type { GenericTableProps } from '@/common/components/generic-table/interface'
import type { Organization } from '@/common/models'

import { GenericTable } from '@/common/components'

import { OrganizationColumns } from './columns'

export const OrganizationTable = ({
  data,
  ...props
}: Omit<GenericTableProps<Organization>, 'columnDefs' | 'getRowId'>) => {
  return (
    <GenericTable
      {...props}
      data={data ?? []}
      columnDefs={OrganizationColumns}
      getRowId={(row) => row.id}
    />
  )
}
