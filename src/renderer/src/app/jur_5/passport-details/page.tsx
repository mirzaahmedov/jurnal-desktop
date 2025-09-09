import type { MainZarplata } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { Pagination } from '@/common/components/pagination'
import { useConfirm } from '@/common/features/confirm'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { MainZarplataService } from '@/common/features/main-zarplata/service'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import {
  VacantTree,
  type VacantTreeNode,
  VacantTreeSearch
} from '@/common/features/vacant/ui/vacant-tree'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { queryClient } from '@/common/lib/query-client'

import { MainZarplataColumnDefs } from './columns'
import { PassportInfoCreateDialog } from './components/passport-details-create-dialog'
import { PassportDetailsViewDialog } from './components/passport-details-view-dialog'

const PassportDetailsPage = () => {
  const setLayout = useLayout()

  const pagination = usePagination()
  const createDialogToggle = useToggle()
  const editDialogToggle = useToggle()

  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode | null>(null)
  const [selectedUser, setSelectedUser] = useState<MainZarplata | undefined>()

  const [searchFilter] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { filteredTreeNodes, search, setSearch, vacantsQuery } = useVacantTreeNodes()
  const { data: mainZarplata, isFetching: isFetchingMainZarplata } = useQuery({
    queryKey: [
      MainZarplataService.QueryKeys.GetByVacantId,
      {
        vacantId: selectedVacant?.id ?? 0
      }
    ],
    queryFn: MainZarplataService.getByVacantId,
    enabled: !!selectedVacant || !searchFilter
  })
  const { data: mainZarplataSearch, isFetching: isFetchingMainZarplataSearch } = useQuery({
    queryKey: [
      MainZarplataService.QueryKeys.GetAll,
      {
        search: searchFilter ?? '',
        page: pagination.page,
        limit: pagination.limit
      }
    ],
    queryFn: MainZarplataService.getAll,
    enabled: !!searchFilter
  })

  const { mutate: deleteMainZarplata, isPending: isDeleting } = useMutation({
    mutationFn: MainZarplataService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [MainZarplataService.QueryKeys.GetByVacantId]
      })
    },
    onError: (res: { message: string }) => {
      toast.error(res.message ?? t('delete_failed'))
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.passport_details'),
      breadcrumbs: [
        {
          title: t('pages.zarplata')
        }
      ],
      content: SearchFilterDebounced,
      onCreate: selectedVacant ? createDialogToggle.open : undefined
    })
  }, [t, setLayout, selectedVacant])

  const handleRowEdit = (row: MainZarplata) => {
    setSelectedUser(row)
    editDialogToggle.open()
  }
  const handleRowDelete = (row: MainZarplata) => {
    confirm({
      onConfirm: () => {
        deleteMainZarplata(row.id)
      }
    })
  }

  return (
    <>
      <Allotment
        proportionalLayout={false}
        defaultSizes={[300, 0]}
        className="h-full"
      >
        <Allotment.Pane
          preferredSize={300}
          maxSize={600}
          minSize={300}
          className="w-full bg-gray-50"
        >
          <div className="relative h-full flex flex-col">
            {vacantsQuery.isPending ? <LoadingOverlay /> : null}
            <VacantTreeSearch
              search={search}
              onValueChange={setSearch}
              treeNodes={filteredTreeNodes}
            />
            <div className="relative overflow-auto scrollbar flex-1">
              <VacantTree
                nodes={filteredTreeNodes}
                selectedIds={selectedVacant ? [selectedVacant.id] : []}
                onSelectNode={setSelectedVacant}
              />
            </div>
          </div>
        </Allotment.Pane>
        <Allotment.Pane className="flex flex-col h-full">
          <div className="relative h-full w-full overflow-auto scrollbar pl-px">
            {isFetchingMainZarplata || isFetchingMainZarplataSearch || isDeleting ? (
              <LoadingOverlay />
            ) : null}
            <GenericTable
              data={searchFilter ? (mainZarplataSearch?.data ?? []) : (mainZarplata ?? [])}
              columnDefs={MainZarplataColumnDefs}
              onEdit={handleRowEdit}
              onDelete={handleRowDelete}
              className="table-generic-xs"
            />
          </div>
          {searchFilter ? (
            <div className="p-5">
              <Pagination
                {...pagination}
                pageCount={mainZarplataSearch?.meta?.pageCount ?? 0}
                count={mainZarplataSearch?.meta?.count ?? 0}
              />
            </div>
          ) : null}
        </Allotment.Pane>
      </Allotment>

      {selectedVacant ? (
        <PassportDetailsViewDialog
          isOpen={editDialogToggle.isOpen}
          onOpenChange={editDialogToggle.setOpen}
          selectedMainZarplata={selectedUser}
          vacant={selectedVacant}
        />
      ) : null}

      {selectedVacant ? (
        <PassportInfoCreateDialog
          isOpen={createDialogToggle.isOpen}
          onOpenChange={createDialogToggle.setOpen}
          selectedUser={undefined}
          vacant={selectedVacant}
          onCreate={(user) => {
            setSelectedUser(user)
            editDialogToggle.open()
            createDialogToggle.close()
          }}
        />
      ) : null}
    </>
  )
}

export default PassportDetailsPage
