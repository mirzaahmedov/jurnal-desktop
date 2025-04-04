import type { OX } from '@/common/models'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { GenericTable } from '@/common/components'
import { useLayout } from '@/common/layout/store'
import { serializeDateParams } from '@/common/lib/query-params'
import { ListView } from '@/common/views'

import { columns } from './columns'
import { queryKeys } from './config'
import { adminOXService } from './service'

const AdminOXPage = () => {
  const navigate = useNavigate()

  const { t } = useTranslation(['app'])

  const { data: reports, isFetching } = useQuery({
    queryKey: [queryKeys.getAll],
    queryFn: adminOXService.getAll
  })

  const handleEdit = (row: OX.AdminReport) => {
    const date = serializeDateParams({ month: row.month, year: row.year })
    navigate(`edit?date=${date}&region_id=${row.region_id}&budjet_id=${row.budjet_id}`)
  }

  useLayout({
    title: t('pages.1ox-report')
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
