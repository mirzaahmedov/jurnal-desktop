import type { Tabel } from '@/common/models/tabel'

import { useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { PlusIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { TabelService } from '@/app/jur_5/nachislenie/tabel/service'
import { GenericTable, LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { useRequisitesRedirect } from '@/common/features/requisites/use-main-schet-redirect'
import { usePagination, useToggle } from '@/common/hooks'
import { queryClient } from '@/common/lib/query-client'

import { TabelColumnDefs } from './columns'
import { TabelCreateDialog } from './create-dialog'
import { TabelEditDialog } from './edit-dialog'

export const Tabels = () => {
  useRequisitesRedirect('/' as any)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { budjet_id, main_schet_id } = useRequisitesStore()

  const [selectedTabelId, setSelectedTabelId] = useState<number>()

  const editDialogToggle = useToggle()
  const createDialogToggle = useToggle()
  const pagination = usePagination()

  const { data: tabels, isFetching: isFetchingTabels } = useQuery({
    queryKey: [
      TabelService.QueryKeys.GetAll,
      {
        page: pagination.page,
        limit: pagination.limit
      }
    ],
    queryFn: TabelService.getAll
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
    editDialogToggle.open()
  }
  const handleRowDelete = (row: Tabel) => {
    confirm({
      onConfirm: () => {
        deleteTabel(row.id)
      }
    })
  }

  return (
    <div className="relative w-full overflow-auto scrollbar pl-px">
      <div className="px-5 py-2.5 border-b text-end">
        {budjet_id && main_schet_id ? (
          <Button
            IconStart={PlusIcon}
            onClick={createDialogToggle.open}
          >
            {t('add')}
          </Button>
        ) : null}
      </div>
      {isFetchingTabels || isDeleting ? <LoadingOverlay /> : null}
      <GenericTable
        data={tabels?.data ?? []}
        columnDefs={TabelColumnDefs}
        onEdit={handleRowEdit}
        onDelete={handleRowDelete}
        className="table-generic-xs"
      />

      {budjet_id && main_schet_id ? (
        <>
          <TabelCreateDialog
            isOpen={createDialogToggle.isOpen}
            onOpenChange={createDialogToggle.setOpen}
            budjetId={budjet_id}
            mainSchetId={main_schet_id}
          />
          <TabelEditDialog
            isOpen={editDialogToggle.isOpen}
            onOpenChange={editDialogToggle.setOpen}
            selectedTabelId={selectedTabelId}
          />
        </>
      ) : null}
    </div>
  )
}
