import { AdminMainbook } from '@renderer/common/models'
import { GenericTable } from '@renderer/common/components'
import { ListView } from '@renderer/common/views'
import { adminMainBookService } from './service'
import { columns } from './columns'
import { queryKeys } from './config'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

const AdminMoonBookPage = () => {
  const navigate = useNavigate()

  const { data: reports, isFetching } = useQuery({
    queryKey: [queryKeys.getAll],
    queryFn: adminMainBookService.getAll
  })

  const handleEdit = (row: AdminMainbook) => {
    navigate(`${row.id}?region_id=${row.region_id}`)
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching}>
        <GenericTable
          columns={columns}
          data={reports?.data ?? []}
          onEdit={handleEdit}
        />
      </ListView.Content>
    </ListView>
  )
}

export default AdminMoonBookPage
