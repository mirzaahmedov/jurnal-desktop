import type { Nachislenie } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { MonthSelect } from '@/common/components/month-select'
import { SearchInputDebounced } from '@/common/components/search-input-debounced'
import { YearSelect } from '@/common/components/year-select'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import { VacantTree, type VacantTreeNode } from '@/common/features/vacant/ui/vacant-tree'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { queryClient } from '@/common/lib/query-client'

import { NachislenieTabs } from '../nachislenie-tabs'
import { NachislenieColumns } from './columns'
import { NachislenieCreateDialog } from './components/nachislenie-create-dialog'
import { NachislenieEditDialog } from './components/nachislenie-edit-dialog'
import { NachislenieService } from './service'

export const Nachislenies = () => {
  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { main_schet_id, budjet_id } = useRequisitesStore()
  const { treeNodes, vacantsQuery } = useVacantTreeNodes()

  const [selectedNachislenie, setSelectedNachislenie] = useState<Nachislenie | undefined>()
  const [selectedVacant, setSelectedVacant] = useState<VacantTreeNode>()
  const [docNum, setDocNum] = useState<string>('')
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)

  const setLayout = useLayout()
  const pagination = usePagination()
  const editToggle = useToggle()
  const createToggle = useToggle()

  const { data: nachislenie, isFetching: isFetchingNachislenie } = useQuery({
    queryKey: [
      NachislenieService.QueryKeys.GetByVacantId,
      {
        page: pagination.page,
        limit: pagination.limit,
        budjet_name_id: budjet_id!,
        doc_num: docNum || undefined,
        year: year || undefined,
        month: month || undefined,
        vacantId: selectedVacant?.id ?? 0
      }
    ],
    queryFn: NachislenieService.getByVacantId,
    enabled: !!budjet_id && !!selectedVacant
  })

  const { mutate: deleteNachislenie, isPending: isDeleting } = useMutation({
    mutationFn: NachislenieService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [NachislenieService.QueryKeys.GetByVacantId]
      })
    },
    onError: (res: { message: string }) => {
      toast.error(res.message ?? t('delete_failed'))
    }
  })

  const handleRowEdit = (row: Nachislenie) => {
    setSelectedNachislenie(row)
    editToggle.open()
  }
  const handleRowDelete = (row: Nachislenie) => {
    confirm({
      onConfirm: () => {
        deleteNachislenie(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('nachislenie'),
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
    <Allotment>
      <Allotment.Pane
        preferredSize={300}
        maxSize={600}
        minSize={200}
        className="w-full bg-gray-50"
      >
        <div className="h-full overflow-y-auto scrollbar">
          {vacantsQuery.isFetching ? <LoadingOverlay /> : null}
          <VacantTree
            nodes={treeNodes}
            onSelectNode={setSelectedVacant}
            selectedIds={selectedVacant ? [selectedVacant.id] : []}
          />
        </div>
      </Allotment.Pane>
      <Allotment.Pane>
        <div className="h-full flex flex-col overflow-hidden pl-px">
          <div className="p-2.5 flex items-center gap-2">
            <SearchInputDebounced
              value={docNum}
              onValueChange={setDocNum}
            />
            <YearSelect
              selectedKey={year}
              onSelectionChange={(value) =>
                setYear(value ? (value as number) : new Date().getFullYear())
              }
            />
            <MonthSelect
              selectedKey={month}
              onSelectionChange={(value) =>
                setMonth(value ? (value as number) : new Date().getMonth() + 1)
              }
              className="w-36"
            />
          </div>
          <div className="flex-1 relative w-full overflow-auto scrollbar">
            {isFetchingNachislenie || isDeleting ? <LoadingOverlay /> : null}
            <GenericTable
              data={nachislenie ?? []}
              columnDefs={NachislenieColumns}
              onEdit={handleRowEdit}
              onDoubleClickRow={handleRowEdit}
              onDelete={handleRowDelete}
              className="table-generic-xs"
            />
          </div>
        </div>
        {budjet_id && main_schet_id ? (
          <>
            <NachislenieCreateDialog
              isOpen={createToggle.isOpen}
              onOpenChange={createToggle.setOpen}
              mainSchetId={main_schet_id}
              spravochnikBudjetNameId={budjet_id}
              vacant={selectedVacant}
            />
            {selectedVacant && selectedNachislenie ? (
              <NachislenieEditDialog
                isOpen={editToggle.isOpen}
                onOpenChange={editToggle.setOpen}
                vacant={selectedVacant}
                selectedNachislenie={selectedNachislenie!}
              />
            ) : null}
          </>
        ) : null}
      </Allotment.Pane>
    </Allotment>
  )
}
