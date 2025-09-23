import type { AdminRealCost } from '@/common/models'

import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Ellipsis } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { GenericTable } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/common/components/ui/dropdown-menu'
import { DownloadFile } from '@/common/features/file'
import { usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { AdminRealCostColumns } from './columns'
import { AdminRealCostQueryKeys } from './config'
import { AdminRealCostFilters, useMonthFilter, useYearFilter } from './filters'
import { AdminRealCostService } from './service'

const AdminRealCostPage = () => {
  const pagination = usePagination()
  const navigate = useNavigate()
  const setLayout = useLayout()

  const [year] = useYearFilter()
  const [month] = useMonthFilter()

  const { t } = useTranslation(['app'])

  const { data: realCosts, isFetching: isFetchingRealCosts } = useQuery({
    queryKey: [
      AdminRealCostQueryKeys.getAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        year,
        month
      }
    ],
    queryFn: AdminRealCostService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.realcost'),
      content: AdminRealCostFilters
    })
  }, [setLayout, navigate, t, year])

  const handleEdit = (row: AdminRealCost) => {
    navigate(`${row.id}`)
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetchingRealCosts}>
        <GenericTable
          data={realCosts?.data ?? []}
          columnDefs={AdminRealCostColumns}
          onEdit={handleEdit}
          actions={(row) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                >
                  <Ellipsis className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="left"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <DownloadFile
                    url={`/real/cost/${row.id}`}
                    fileName={`${t('pages.realcost').toLowerCase()}_${row.month}-${row.year}.xlsx`}
                    buttonText={t('download')}
                    params={{
                      main_schet_id: row.main_schet_id,
                      region_id: row.region_id,
                      excel: true
                    }}
                    className="px-2 py-1.5"
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          pageCount={realCosts?.meta?.pageCount ?? 0}
          count={realCosts?.meta?.count ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default AdminRealCostPage
