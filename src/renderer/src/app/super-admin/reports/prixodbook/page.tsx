import type { AdminPrixodbook } from '@/common/models'

import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { GenericTable } from '@/common/components'
import { usePagination } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { ListView } from '@/common/views'

import { prixodbookColumns } from './columns'
import { prixodbookQueryKeys } from './config'
import { PrixodbookFilters, useBudjetFilter, useMonthFilter, useYearFilter } from './filters'
import { adminPrixodbookService } from './service'

const AdminPrixodbookPage = () => {
  const pagination = usePagination()
  const navigate = useNavigate()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [year] = useYearFilter()
  const [month] = useMonthFilter()
  const [budjet_id] = useBudjetFilter()

  const { t } = useTranslation(['app'])

  const { data: prixodbook, isFetching: isFetchingPrixodbook } = useQuery({
    queryKey: [
      prixodbookQueryKeys.getAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        year,
        month,
        budjet_id
      }
    ],
    queryFn: adminPrixodbookService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.prixodbook'),
      content: PrixodbookFilters
    })
  }, [setLayout, navigate, t])

  const handleEdit = (row: AdminPrixodbook) => {
    navigate(`${row.id}`)
  }

  return (
    <ListView>
      <ListView.Content loading={isFetchingPrixodbook}>
        <GenericTable
          data={prixodbook?.data ?? []}
          columnDefs={prixodbookColumns}
          onEdit={handleEdit}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          pageCount={prixodbook?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default AdminPrixodbookPage
