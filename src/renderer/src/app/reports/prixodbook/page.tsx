import type { Prixodbook } from '@renderer/common/models'

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

import { prixodbookColumns } from './columns'
import { prixodbookQueryKeys } from './config'
import { PrixodbookFilters, useYearFilter } from './filters'
import { prixodbookService } from './service'

const PrixodbookPage = () => {
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const navigate = useNavigate()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [year] = useYearFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: prixodbook, isFetching: isFetchingPrixodbook } = useQuery({
    queryKey: [
      prixodbookQueryKeys.getAll,
      {
        budjet_id,
        page: pagination.page,
        limit: pagination.limit,
        year
      }
    ],
    queryFn: prixodbookService.getAll
  })
  const { mutate: deletePrixodbook, isPending } = useMutation({
    mutationKey: [prixodbookQueryKeys.delete],
    mutationFn: prixodbookService.delete,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [prixodbookQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.prixodbook'),
      content: PrixodbookFilters,
      onCreate: () => {
        navigate('create')
      }
    })
  }, [setLayout, navigate, t])

  const handleEdit = (row: Prixodbook) => {
    navigate(`${row.id}`)
  }
  const handleDelete = (row: Prixodbook) => {
    confirm({
      onConfirm: () => {
        deletePrixodbook(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetchingPrixodbook || isPending}>
        <GenericTable
          data={prixodbook?.data ?? []}
          columnDefs={prixodbookColumns}
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
                    url={`/prixod/book/${row.id}`}
                    fileName={`${t('pages.prixodbook').toLowerCase()}_${row.month}-${row.year}.xlsx`}
                    buttonText={t('download-something', { something: t('pages.prixodbook') })}
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
          pageCount={prixodbook?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default PrixodbookPage
