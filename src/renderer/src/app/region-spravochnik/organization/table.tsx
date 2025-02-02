import type { GenericTableProps } from '@/common/components/generic-table/table'
import type { Organization } from '@/common/models'

import { GenericTable } from '@/common/components'

import { organizationColumns } from './columns'

const OrganizationTable = ({
  data,
  ...props
}: Omit<GenericTableProps<Organization>, 'columnDefs' | 'getRowId'>) => {
  return (
    <GenericTable
      {...props}
      data={data ?? []}
      columnDefs={organizationColumns}
      getRowId={(row) => row.id}
    />
  )
}

export { OrganizationTable }
