import type { Mainbook } from '@renderer/common/models'

import { GenericTable } from '@renderer/common/components'
import { useLayout } from '@renderer/common/features/layout'
import { serializeDateParams } from '@renderer/common/lib/query-params'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { columns } from './columns'
import { queryKeys } from './config'
import { adminMainbookService } from './service'

const AdminMainbookPage = () => {
  const navigate = useNavigate()

  const { t } = useTranslation(['app'])

  const { data: reports, isFetching } = useQuery({
    queryKey: [queryKeys.getAll],
    queryFn: adminMainbookService.getAll
  })

  const handleEdit = (row: Mainbook.AdminReport) => {
    const date = serializeDateParams({ month: row.month, year: row.year })
    navigate(`info?date=${date}&region_id=${row.region_id}&budjet_id=${row.budjet_id}`)
  }

  useLayout({
    title: t('pages.mainbook')
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

export default AdminMainbookPage
