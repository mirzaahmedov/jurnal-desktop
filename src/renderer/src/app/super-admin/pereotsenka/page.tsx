import type { Pereotsenka } from '@renderer/common/models'

import { useState } from 'react'

import {
  GenericTable,
  LoadingOverlay,
  Pagination,
  usePagination
} from '@renderer/common/components'
import { useConfirm } from '@renderer/common/features/confirm'
import { useLayout } from '@renderer/common/features/layout'
import { useToggle } from '@renderer/common/hooks/use-toggle'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { pereotsenkaColumns } from './columns'
import { pereotsenkaQueryKeys } from './config'
import { PereotsenkaBatchCreateDrawer } from './create-drawer'
import { PereotsenkaDialog } from './dialog'
import { pereotsenkaService } from './service'

const PereotsenkaPage = () => {
  const [selected, setSelected] = useState<null | Pereotsenka>(null)

  const { confirm } = useConfirm()
  const { currentPage, itemsPerPage } = usePagination()

  const dialogToggle = useToggle()
  const batchDialogToggle = useToggle()
  const queryClient = useQueryClient()
  const { data: pereotsenkaList, isFetching } = useQuery({
    queryKey: [
      pereotsenkaQueryKeys.getAll,
      {
        page: currentPage,
        limit: itemsPerPage
      }
    ],
    queryFn: pereotsenkaService.getAll
  })
  const { mutate: deletePereotsenka, isPending } = useMutation({
    mutationKey: [pereotsenkaQueryKeys.delete],
    mutationFn: pereotsenkaService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [pereotsenkaQueryKeys.getAll]
      })
      toast.success('Переоценка успешно удалена')
    },
    onError(error) {
      console.error(error)
      toast.error('Ошибка при удалении переоценки: ' + error.message)
    }
  })

  useLayout({
    title: 'Переоценка',
    onCreate: batchDialogToggle.open
  })

  const handleClickEdit = (row: Pereotsenka) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Pereotsenka) => {
    confirm({
      title: 'Удалить переоценку?',
      onConfirm() {
        deletePereotsenka(row.id)
      }
    })
  }

  return (
    <>
      <div className="relative flex-1">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <GenericTable
          columnDefs={pereotsenkaColumns}
          data={pereotsenkaList?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <div className="px-10 py-5">
        <Pagination pageCount={pereotsenkaList?.meta.pageCount ?? 0} />
      </div>
      <PereotsenkaDialog
        data={selected}
        open={dialogToggle.isOpen}
        onClose={dialogToggle.close}
      />
      <PereotsenkaBatchCreateDrawer
        open={batchDialogToggle.isOpen}
        onOpenChange={batchDialogToggle.setOpen}
      />
    </>
  )
}

export { PereotsenkaPage }
