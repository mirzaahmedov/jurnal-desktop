import type { Nachislenie } from '@/common/models'

import { useState } from 'react'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { useConfirm } from '@/common/features/confirm'
import { useRequisitesStore } from '@/common/features/requisites'
import { usePagination, useToggle } from '@/common/hooks'
import { queryClient } from '@/common/lib/query-client'

import { NachislenieColumns } from './columns'
import { NachislenieCreateDialog } from './components/nachislenie-create-dialog'
import { NachislenieEditDialog } from './components/nachislenie-edit-dialog'
import { NachislenieService } from './service'

export const Nachislenies = () => {
  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const [selectedNachislenie, setSelectedNachislenie] = useState<Nachislenie | undefined>()

  const pagination = usePagination()
  const editDialogToggle = useToggle()
  const createDialogToggle = useToggle()

  const { data: nachislenie, isFetching: isFetchingNachislenie } = useQuery({
    queryKey: [
      NachislenieService.QueryKeys.GetByVacantId,
      {
        page: pagination.page,
        limit: pagination.limit
      }
    ],
    queryFn: NachislenieService.getByVacantId
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
    editDialogToggle.open()
  }
  const handleRowDelete = (row: Nachislenie) => {
    confirm({
      onConfirm: () => {
        deleteNachislenie(row.id)
      }
    })
  }

  return (
    <>
      <div className="h-full flex flex-col overflow-hidden pl-px">
        <div className="p-2.5 text-end">
          <Button onClick={createDialogToggle.open}>
            <Plus className="btn-icon icon-start" /> {t('add')}
          </Button>
        </div>
        <div className="flex-[2] relative w-full overflow-auto scrollbar">
          {isFetchingNachislenie || isDeleting ? <LoadingOverlay /> : null}
          <GenericTable
            data={nachislenie?.data ?? []}
            columnDefs={NachislenieColumns}
            onEdit={handleRowEdit}
            onDelete={handleRowDelete}
            className="table-generic-xs"
          />
        </div>
      </div>
      {budjet_id && main_schet_id ? (
        <>
          <NachislenieCreateDialog
            isOpen={createDialogToggle.isOpen}
            onOpenChange={createDialogToggle.setOpen}
            mainSchetId={main_schet_id}
            spravochnikBudjetNameId={budjet_id}
          />
          {selectedNachislenie ? (
            <NachislenieEditDialog
              isOpen={editDialogToggle.isOpen}
              onOpenChange={editDialogToggle.setOpen}
              mainSchetId={main_schet_id}
              spravochnikBudjetNameId={budjet_id}
              selectedNachislenie={selectedNachislenie!}
            />
          ) : null}
        </>
      ) : null}
    </>
  )
}
