import type { Mainbook } from '@/common/models'

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
import { useKeyUp, usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { OdinoxColumns } from './columns'
import { OdinoxQueryKeys } from './config'
import { OdinoxFilters, useYearFilter } from './filters'
import { OdinoxService } from './service'

const OdinoxPage = () => {
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const navigate = useNavigate()
  const setLayout = useLayout()

  const [year] = useYearFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { data: odinox, isFetching: isFetchingOdinox } = useQuery({
    queryKey: [
      OdinoxQueryKeys.getAll,
      {
        budjet_id,
        main_schet_id,
        page: pagination.page,
        limit: pagination.limit,
        year
      }
    ],
    queryFn: OdinoxService.getAll
  })
  const { mutate: deleteOdinox, isPending: isDeleting } = useMutation({
    mutationKey: [OdinoxQueryKeys.delete],
    mutationFn: OdinoxService.delete,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [OdinoxQueryKeys.getAll]
      })
    }
  })
  const { mutate: cleanOdinox, isPending: isCleaning } = useMutation({
    mutationKey: [OdinoxQueryKeys.clean],
    mutationFn: OdinoxService.cleanSaldo,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [OdinoxQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.odinox'),
      content: OdinoxFilters,
      onCreate: () => {
        navigate('create', {
          state: {
            year
          }
        })
      }
    })
  }, [setLayout, navigate, t, year])

  const handleEdit = (row: Mainbook) => {
    navigate(`${row.id}`)
  }
  const handleDelete = (row: Mainbook) => {
    confirm({
      onConfirm: () => {
        deleteOdinox(row.id)
      }
    })
  }

  const handleClean = () => {
    confirm({
      withPassword: true,
      onConfirm(password) {
        cleanOdinox({
          budjet_id: budjet_id!,
          main_schet_id: main_schet_id!,
          password
        })
      }
    })
  }

  useKeyUp({
    key: 'Delete',
    ctrlKey: true,
    onKeyUp: handleClean
  })

  return (
    <ListView>
      <ListView.Content loading={isFetchingOdinox || isDeleting || isCleaning}>
        <GenericTable
          data={odinox?.data ?? []}
          columnDefs={OdinoxColumns}
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
          pageCount={odinox?.meta?.pageCount ?? 0}
          count={odinox?.meta?.count ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default OdinoxPage
