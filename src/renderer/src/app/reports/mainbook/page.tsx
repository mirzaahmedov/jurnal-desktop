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
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates
} from '@/common/features/saldo'
import { useSettingsStore } from '@/common/features/settings'
import { useKeyUp, usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { mainbookColumns } from './columns'
import { MainbookQueryKeys } from './config'
import { MainbookFilters, useYearFilter } from './filters'
import { useMainbookSaldo } from './saldo/use-saldo'
import { MainbookService } from './service'

const MainbookPage = () => {
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const navigate = useNavigate()
  const setLayout = useLayout()

  const [year] = useYearFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { queuedMonths, clearQueue } = useMainbookSaldo()

  const {
    data: mainbook,
    isFetching: isFetchingMainbook,
    error
  } = useQuery({
    queryKey: [
      MainbookQueryKeys.getAll,
      {
        budjet_id,
        main_schet_id,
        page: pagination.page,
        limit: pagination.limit,
        year
      }
    ],
    queryFn: MainbookService.getAll,
    enabled: !queuedMonths.length
  })
  const { mutate: deleteMainbook, isPending: isDeleting } = useMutation({
    mutationKey: [MainbookQueryKeys.delete],
    mutationFn: MainbookService.delete,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [MainbookQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.MAINBOOK, res)
    },
    onError: (error) => {
      handleSaldoErrorDates(SaldoNamespace.MAINBOOK, error)
    }
  })
  const { mutate: cleanMainbook, isPending: isCleaning } = useMutation({
    mutationKey: [MainbookQueryKeys.clean],
    mutationFn: MainbookService.cleanSaldo,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [MainbookQueryKeys.getAll]
      })
      clearQueue()
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.mainbook'),
      content: MainbookFilters,
      onCreate: () => {
        navigate('create', {
          state: {
            year
          }
        })
      }
    })
  }, [setLayout, navigate, t, year])
  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.MAINBOOK, error)
    }
  }, [error])

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

  const handleClean = () => {
    confirm({
      withPassword: true,
      onConfirm(password) {
        cleanMainbook({
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
    handler: handleClean
  })

  return (
    <ListView>
      <ListView.Content isLoading={isFetchingMainbook || isDeleting || isCleaning}>
        <GenericTable
          data={mainbook?.data ?? []}
          columnDefs={mainbookColumns}
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
                    buttonText={t('download')}
                    params={{
                      report_title_id,
                      main_schet_id,
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
          count={mainbook?.meta?.count ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default MainbookPage
