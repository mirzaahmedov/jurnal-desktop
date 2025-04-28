import type { RealCost } from '@/common/models'

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

import { RealCostColumns } from './columns'
import { RealCostQueryKeys } from './config'
import { OdinoxFilters, useYearFilter } from './filters'
import { RealCostService } from './service'

const RealCostPage = () => {
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const navigate = useNavigate()
  const setLayout = useLayout()

  const [year] = useYearFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const { data: realcosts, isFetching: isFetchingRealCosts } = useQuery({
    queryKey: [
      RealCostQueryKeys.getAll,
      {
        budjet_id,
        main_schet_id,
        page: pagination.page,
        limit: pagination.limit,
        year
      }
    ],
    queryFn: RealCostService.getAll
  })
  const { mutate: deleteRealCost, isPending: isDeleting } = useMutation({
    mutationKey: [RealCostQueryKeys.delete],
    mutationFn: RealCostService.delete,
    onSuccess: (res) => {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [RealCostQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.realcost'),
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

  const handleEdit = (row: RealCost) => {
    navigate(`${row.id}`)
  }
  const handleDelete = (row: RealCost) => {
    confirm({
      onConfirm: () => {
        deleteRealCost(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetchingRealCosts || isDeleting}>
        <GenericTable
          data={realcosts?.data ?? []}
          columnDefs={RealCostColumns}
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
                    url={`/odinox/${row.id}`}
                    fileName={`${t('pages.mainbook').toLowerCase()}_${row.month}-${row.year}.xlsx`}
                    buttonText={t('download-something', { something: t('pages.mainbook') })}
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
          pageCount={realcosts?.meta?.pageCount ?? 0}
          count={realcosts?.meta?.count ?? 0}
          {...pagination}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default RealCostPage
