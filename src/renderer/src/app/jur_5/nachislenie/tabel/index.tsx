import type { Tabel } from '@/common/models/tabel'

import { useEffect, useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Allotment } from 'allotment'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { TabelService } from '@/app/jur_5/nachislenie/tabel/service'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { MonthSelect } from '@/common/components/month-select'
import { SearchInputDebounced } from '@/common/components/search-input-debounced'
import { YearSelect } from '@/common/components/year-select'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { useVacantTreeNodes } from '@/common/features/vacant/hooks/use-vacant-tree-nodes'
import { VacantTree, type VacantTreeNode } from '@/common/features/vacant/ui/vacant-tree'
import { usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { queryClient } from '@/common/lib/query-client'

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
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)

  const setLayout = useLayout()
  const editToggle = useToggle()
  const createToggle = useToggle()
  const pagination = usePagination()

  const { treeNodes, vacantsQuery } = useVacantTreeNodes()

  const { data: tabels, isFetching: isFetchingTabels } = useQuery({
    queryKey: [
      TabelService.QueryKeys.GetAll,
      {
        page: pagination.page,
        limit: pagination.limit,
        vacantId: selectedVacant?.id,
        docNum: docNum ? docNum : undefined,
        year: year || undefined,
        month: month || undefined
      }
    ],
    queryFn: TabelService.getAll,
    enabled: !!selectedVacant
  })
  const { mutate: deleteTabel, isPending: isDeleting } = useMutation({
    mutationFn: TabelService.delete,
    onSuccess: () => {
      toast.success(t('delete_success'))
      queryClient.invalidateQueries({
        queryKey: [TabelService.QueryKeys.GetAll]
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
          <VacantTree
            nodes={treeNodes}
            selectedIds={selectedVacant ? [selectedVacant.id] : []}
            onSelectNode={setSelectedVacant}
          />
        </div>
      </Allotment.Pane>
      <Allotment.Pane className="relative w-full pl-px flex flex-col">
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
        <div className="flex-1 relative w-full overflow-auto scrollbar pl-px">
          {vacantsQuery.isFetching || isFetchingTabels || isDeleting ? <LoadingOverlay /> : null}
          <GenericTable
            data={tabels ?? []}
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
      </Allotment.Pane>
    </Allotment>
  )
}
