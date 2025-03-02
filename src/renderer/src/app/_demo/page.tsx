import type { ColumnDef } from '@renderer/common/components/collapsible-table'
import type { Organization } from '@renderer/common/models'

import { GenericTable } from '@renderer/common/components'

const users: Organization[] = []
const columnDefs: ColumnDef<Organization>[] = []

const DemoPage = () => {
  return (
    <div className="flex-1 w-full h-full">
      <GenericTable
        data={users}
        getRowId={(row) => row.id}
        columnDefs={columnDefs}
      />
    </div>
  )
}

export default DemoPage
