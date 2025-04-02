import type { Mainbook } from '@renderer/common/models'

import { useEffect } from 'react'

import { GenericTable } from '@renderer/common/components'
import { Button } from '@renderer/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/common/components/ui/dropdown-menu'
import { useConfirm } from '@renderer/common/features/confirm'
import { DownloadFile } from '@renderer/common/features/file'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useSettingsStore } from '@renderer/common/features/settings'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Ellipsis } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { mainbookColumns } from './columns'
import { mainbookQueryKeys } from './config'
import { MainbookFilters, useYearFilter } from './filters'
import { mainbookService } from './service'

const MainbookPage = () => {
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const navigate = useNavigate()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [year] = useYearFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: mainbook, isFetching: isFetchingMainbook } = useQuery({
    queryKey: [
      mainbookQueryKeys.getAll,
      {
        budjet_id,
        page: pagination.page,
        limit: pagination.limit,
        year
      }
    ],
    queryFn: mainbookService.getAll
  })
  const { mutate: deleteMainbook, isPending } = useMutation({
    mutationKey: [mainbookQueryKeys.delete],
    mutationFn: mainbookService.delete,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [mainbookQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.mainbook'),
      content: MainbookFilters,
      onCreate: () => {
        navigate('create')
      }
    })
  }, [setLayout, navigate, t])

  const handleEdit = (row: Mainbook) => {
    navigate(`${row.id}`)
  }
  const handleDelete = (row: Mainbook) => {
    confirm({
      onConfirm: () => {
        deleteMainbook(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetchingMainbook || isPending}>
        <GenericTable
          data={mainbook?.data ?? []}
          columnDefs={mainbookColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
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
                    buttonText={t('download-something', { something: t('pages.mainbook') })}
                    params={{
                      report_title_id,
                      budjet_id,
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
          pageCount={mainbook?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default MainbookPage
