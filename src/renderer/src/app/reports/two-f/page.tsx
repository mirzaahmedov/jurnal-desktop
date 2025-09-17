import type { TwoF } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Ellipsis } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/common/components/ui/dropdown-menu'
import { useConfirm } from '@/common/features/confirm'
import { DownloadFile } from '@/common/features/file'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSettingsStore } from '@/common/features/settings'
import { usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { TwoFColumns } from './columns'
import { TwoFQueryKeys } from './config'
import { TwoFFilters, useYearFilter } from './filters'
import { TwoFService } from './service'

const TwoFPage = () => {
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const navigate = useNavigate()
  const setLayout = useLayout()

  const [year] = useYearFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { data: odinox, isFetching: isFetchingTwoF } = useQuery({
    queryKey: [
      TwoFQueryKeys.getAll,
      {
        budjet_id,
        main_schet_id,
        page: pagination.page,
        limit: pagination.limit,
        year
      }
    ],
    queryFn: TwoFService.getAll
  })
  const { mutate: deleteTwoF, isPending: isDeleting } = useMutation({
    mutationKey: [TwoFQueryKeys.delete],
    mutationFn: TwoFService.delete,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [TwoFQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.two-f'),
      content: TwoFFilters,
      onCreate: () => {
        navigate('create', {
          state: {
            year
          }
        })
      }
    })
  }, [setLayout, navigate, t, year])

  const handleEdit = (row: TwoF) => {
    navigate(`${row.id}`)
  }
  const handleDelete = (row: TwoF) => {
    confirm({
      onConfirm: () => {
        deleteTwoF(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetchingTwoF || isDeleting}>
        <GenericTable
          data={odinox?.data ?? []}
          columnDefs={TwoFColumns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          getRowDeletable={(row) => row.isdeleted}
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
                    url={`/f2/${row.id}`}
                    fileName={`${t('pages.odinox')}_${row.month}-${row.year}.xlsx`}
                    buttonText={t('download')}
                    params={{
                      report_title_id,
                      main_schet_id,
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
          pageCount={odinox?.meta?.pageCount ?? 0}
          count={odinox?.meta?.count ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default TwoFPage
