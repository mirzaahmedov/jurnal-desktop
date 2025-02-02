import { GenericTable } from '@renderer/common/components'
import { useLayout } from '@renderer/common/features/layout'
import { serializeDateParams } from '@renderer/common/lib/query-params'
import { OX } from '@renderer/common/models'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { columns } from './columns'
import { queryKeys } from './config'
import { adminOXService } from './service'

const AdminOXPage = () => {
  const navigate = useNavigate()

  const { data: reports, isFetching } = useQuery({
    queryKey: [queryKeys.getAll],
    queryFn: adminOXService.getAll
  })

  const handleEdit = (row: OX.AdminReport) => {
    const date = serializeDateParams({ month: row.month, year: row.year })
    navigate(`edit?date=${date}&region_id=${row.region_id}&budjet_id=${row.budjet_id}`)
  }

  useLayout({
    title: 'Отчеты по ОХ'
  })

  return (
    <ListView>
      <ListView.Content loading={isFetching}>
        <GenericTable
          columnDefs={columns}
          data={reports?.data ?? []}
          onEdit={handleEdit}
        />
      </ListView.Content>
    </ListView>
  )
}

export default AdminOXPage
