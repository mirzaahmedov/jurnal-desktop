import type { AdminOdinox } from '@/common/models'

import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { GenericTable } from '@/common/components'
import { usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { AdminOdinoxColumns } from './columns'
import { AdminOdinoxQueryKeys } from './config'
import { AdminOdinoxFilters, useYearFilter } from './filters'
import { AdminOdinoxService } from './service'

const AdminOdinoxPage = () => {
  const pagination = usePagination()
  const navigate = useNavigate()
  const setLayout = useLayout()

  const [year] = useYearFilter()

  const { t } = useTranslation(['app'])

  const { data: odinox, isFetching: isFetchingOdinox } = useQuery({
    queryKey: [
      AdminOdinoxQueryKeys.getAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        year
      }
    ],
    queryFn: AdminOdinoxService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.odinox'),
      content: AdminOdinoxFilters
    })
  }, [setLayout, navigate, t, year])

  const handleEdit = (row: AdminOdinox) => {
    navigate(`${row.id}`)
  }

  return (
    <ListView>
      <ListView.Content loading={isFetchingOdinox}>
        <GenericTable
          data={odinox?.data ?? []}
          columnDefs={AdminOdinoxColumns}
          onEdit={handleEdit}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          pageCount={odinox?.meta?.pageCount ?? 0}
          count={odinox?.meta?.count ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default AdminOdinoxPage
