import type { AdminMainbook } from '@/common/models'

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
      <ListView.Content isLoading={isFetchingMainbook}>
        <GenericTable
          data={mainbook?.data ?? []}
          columnDefs={mainbookColumns}
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
                    url={`/main/book/${row.id}`}
                    fileName={`${t('pages.mainbook').toLowerCase()}_${row.month}-${row.year}.xlsx`}
                    buttonText={t('download')}
                    params={{
                      main_schet_id: row.main_schet_id,
                      budjet_id: row.budjet_id,
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
          count={mainbook?.meta?.count ?? 0}
          pageCount={mainbook?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default AdminMainbookPage
