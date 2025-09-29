import type { Tabel } from '@/common/models/tabel'

import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { TabelService } from '@/app/jur_5/nachislenie/tabel/service'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { Pagination } from '@/common/components/pagination'
import { SearchInputDebounced } from '@/common/components/search-input-debounced'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import {
  VacantTree,
  type VacantTreeNode,
  VacantTreeSearch
} from '@/common/features/vacant/ui/vacant-tree'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatDate, getFirstDayOfMonth, getLastDayOfMonth } from '@/common/lib/date'
import { formatLocaleDate } from '@/common/lib/format'
import { queryClient } from '@/common/lib/query-client'

import { RangeDatePicker } from '../../common/components/range-date-picker'
import { NachislenieTabs } from '../nachislenie-tabs'
import { TabelColumnDefs } from './columns'
import { TabelCreateDialog } from './components/tabel-create-dialog'
import { TabelEditDialog } from './components/tabel-edit-dialog'

const TabelColumnDefsWithoutSelect = TabelColumnDefs.filter((col) => col.key !== 'id')

export const TabelsView = () => {
  useRequisitesRedirect('/' as any)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode>()
  const [selectedTabelId, setSelectedTabelId] = useState<number>()

  const [docNum, setDocNum] = useState<string>('')
  const [startDate, setStartDate] = useState<string>(formatDate(getFirstDayOfMonth()))
  const [endDate, setEndDate] = useState<string>(formatDate(getLastDayOfMonth()))

  const setLayout = useLayout()
  const editToggle = useToggle()
  const createToggle = useToggle()
  const pagination = usePagination()
  const budjetId = useRequisitesStore((store) => store.budjet_id)

  const { filteredTreeNodes, search, setSearch, vacantsQuery } = useVacantTreeNodes()

  const tabelsMadeQuery = useQuery({
    queryKey: [
      TabelService.QueryKeys.MadeVacants,
      {
        budjetId: budjetId!,
        from: formatLocaleDate(startDate),
        to: formatLocaleDate(endDate)
      }
    ],
    queryFn: TabelService.getVacantsMade,
    enabled: !!budjetId && !!startDate && !!endDate
  })

  const { data: tabels, isFetching: isFetchingTabels } = useQuery({
    queryKey: [
      TabelService.QueryKeys.GetAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        vacantId: selectedVacant?.id,
        docNum: docNum ? docNum : undefined,
        from: formatLocaleDate(startDate),
        to: formatLocaleDate(endDate)
      }
    ],
    queryFn: TabelService.getAll,
    enabled: !!selectedVacant && !!startDate && !!endDate
  })
  const { mutate: deleteTabel, isPending: isDeleting } = useMutation({
    mutationFn: TabelService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [TabelService.QueryKeys.GetAll]
      })
      queryClient.invalidateQueries({
        queryKey: [TabelService.QueryKeys.MadeVacants]
      })
    },
    onError: (res: { message: string }) => {
      toast.error(res?.message ?? t('delete_failed'))
    }
  })

  const handleRowEdit = (row: Tabel) => {
    setSelectedTabelId(row.id)
    editToggle.open()
  }
  const handleRowDelete = (row: Tabel) => {
    confirm({
      onConfirm: () => {
        deleteTabel(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('tabel'),
      breadcrumbs: [
        {
          title: t('pages.zarplata')
        }
      ],
      content: NachislenieTabs,
      onCreate: createToggle.open
    })
  }, [t, setLayout, createToggle.open])

  return (
    <Allotment
      proportionalLayout={false}
      defaultSizes={[300, 0]}
    >
      <Allotment.Pane
        preferredSize={300}
        maxSize={600}
        minSize={300}
        className="bg-gray-50"
      >
        <div className="relative h-full flex flex-col">
          <VacantTreeSearch
            search={search}
            onValueChange={setSearch}
            treeNodes={filteredTreeNodes}
          />
          <div className="overflow-y-auto scrollbar">
            {vacantsQuery.isPending ? <LoadingOverlay /> : null}
            <VacantTree
              nodes={filteredTreeNodes}
              selectedIds={selectedVacant ? [selectedVacant.id] : []}
              onSelectNode={setSelectedVacant}
              renderNodeExtra={(node) =>
                tabelsMadeQuery.data?.vacantId?.includes?.(node.id) ? (
                  <span className="size-2.5 bg-brand rounded-full inline-block absolute right-1 top-1"></span>
                ) : null
              }
            />
          </div>
        </div>
      </Allotment.Pane>
      <Allotment.Pane className="relative w-full pl-px flex flex-col">
        <div className="p-2.5 flex items-center gap-2">
          <SearchInputDebounced
            value={docNum}
            onValueChange={setDocNum}
          />
          <RangeDatePicker
            from={startDate}
            to={endDate}
            onValueChange={(from, to) => {
              setStartDate(from)
              setEndDate(to)
            }}
          />
        </div>
        <div className="flex-1 relative w-full overflow-auto scrollbar pl-px">
          {isFetchingTabels || isDeleting ? <LoadingOverlay /> : null}
          <GenericTable
            data={tabels?.data ?? []}
            columnDefs={TabelColumnDefsWithoutSelect}
            onEdit={handleRowEdit}
            onDoubleClickRow={handleRowEdit}
            onDelete={handleRowDelete}
            className="table-generic-xs"
          />

          {budjet_id && main_schet_id ? (
            <>
              <TabelCreateDialog
                isOpen={createToggle.isOpen}
                onOpenChange={createToggle.setOpen}
                budjetId={budjet_id}
                mainSchetId={main_schet_id}
                defaultVacant={selectedVacant}
              />
              <TabelEditDialog
                isOpen={editToggle.isOpen}
                onOpenChange={editToggle.setOpen}
                selectedTabelId={selectedTabelId}
                selectedVacantId={selectedVacant?.id}
              />
            </>
          ) : null}
        </div>
        <div className="p-5">
          <Pagination
            {...pagination}
            count={tabels?.meta?.count ?? 0}
            pageCount={tabels?.meta?.pageCount ?? 0}
          />
        </div>
      </Allotment.Pane>
    </Allotment>
  )
}
