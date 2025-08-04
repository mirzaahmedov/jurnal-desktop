import type { AdminTwoF } from '@/common/models'

import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { GenericTable } from '@/common/components'
import { usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { AdminTwoFColumns } from './columns'
import { AdminTwoFQueryKeys } from './config'
import { AdminTwoFFilters, useYearFilter } from './filters'
import { AdminTwoFService } from './service'

const AdminTwoFPage = () => {
  const pagination = usePagination()
  const navigate = useNavigate()
  const setLayout = useLayout()

  const [year] = useYearFilter()

  const { t } = useTranslation(['app'])

  const { data: odinox, isFetching: isFetchingTwoF } = useQuery({
    queryKey: [
      AdminTwoFQueryKeys.getAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        year
      }
    ],
    queryFn: AdminTwoFService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.two-f'),
      content: AdminTwoFFilters
    })
  }, [setLayout, navigate, t, year])

  const handleEdit = (row: AdminTwoF) => {
    navigate(`${row.id}`)
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetchingTwoF}>
        <GenericTable
          data={odinox?.data ?? []}
          columnDefs={AdminTwoFColumns}
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

export default AdminTwoFPage
