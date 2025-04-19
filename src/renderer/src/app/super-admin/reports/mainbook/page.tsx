import type { AdminMainbook } from '@/common/models'

import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { GenericTable } from '@/common/components'
import { usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { mainbookColumns } from './columns'
import { mainbookQueryKeys } from './config'
import { MainbookFilters, useBudjetFilter, useMonthFilter, useYearFilter } from './filters'
import { adminMainbookService } from './service'

const AdminMainbookPage = () => {
  const pagination = usePagination()
  const navigate = useNavigate()
  const setLayout = useLayout()

  const [year] = useYearFilter()
  const [month] = useMonthFilter()
  const [budjet_id] = useBudjetFilter()

  const { t } = useTranslation(['app'])

  const { data: mainbook, isFetching: isFetchingMainbook } = useQuery({
    queryKey: [
      mainbookQueryKeys.getAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        year,
        month,
        budjet_id
      }
    ],
    queryFn: adminMainbookService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.mainbook'),
      content: MainbookFilters
    })
  }, [setLayout, navigate, t])

  const handleEdit = (row: AdminMainbook) => {
    navigate(`${row.id}`)
  }

  return (
    <ListView>
      <ListView.Content loading={isFetchingMainbook}>
        <GenericTable
          data={mainbook?.data ?? []}
          columnDefs={mainbookColumns}
          onEdit={handleEdit}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          count={mainbook?.meta?.count ?? 0}
          pageCount={mainbook?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default AdminMainbookPage
