import type { AdminOdinox } from '@/common/models'

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

import { AdminOdinoxColumns } from './columns'
import { AdminOdinoxQueryKeys } from './config'
import { AdminOdinoxFilters, useMonthFilter, useYearFilter } from './filters'
import { AdminOdinoxService } from './service'

const AdminOdinoxPage = () => {
  const pagination = usePagination()
  const navigate = useNavigate()
  const setLayout = useLayout()

  const [year] = useYearFilter()
  const [month] = useMonthFilter()

  const { t } = useTranslation(['app'])

  const { data: odinox, isFetching: isFetchingOdinox } = useQuery({
    queryKey: [
      AdminOdinoxQueryKeys.getAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        year,
        month
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
      <ListView.Content isLoading={isFetchingOdinox}>
        <GenericTable
          data={odinox?.data ?? []}
          columnDefs={AdminOdinoxColumns}
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
                    url={`/odinox/${row.id}`}
                    fileName={`${t('pages.odinox')}_${row.month}-${row.year}.xlsx`}
                    buttonText={t('download')}
                    params={{
                      excel: true,
                      main_schet_id: row.main_schet_id,
                      region_id: row.region_id
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
          pageCount={odinox?.meta?.pageCount ?? 0}
          count={odinox?.meta?.count ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default AdminOdinoxPage
