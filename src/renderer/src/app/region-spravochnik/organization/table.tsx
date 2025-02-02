import { GenericTable } from '@/common/components'
import { GenericTableProps } from '@/common/components/generic-table/table'
import { Organization } from '@/common/models'

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
