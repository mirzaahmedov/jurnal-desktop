import type { Pereotsenka } from '@/common/models'

import { toast } from '@/common/hooks/use-toast'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLayout } from '@/common/features/layout'
import { useConfirm } from '@/common/features/confirm'
import { GenericTable, LoadingOverlay, Pagination, usePagination } from '@/common/components'

import { pereotsenkaService } from './service'
import { pereotsenkaQueryKeys } from './config'
import { pereotsenkaColumns } from './columns'
import { PereotsenkaDialog } from './dialog'
import { PereotsenkaBatchCreateDialog } from './create-drawer'
import { useToggle } from '@/common/hooks/use-toggle'

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
      toast({
        title: 'Переоценка успешно удалена'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при удалении переоценки',
        description: error.message
      })
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
          columns={pereotsenkaColumns}
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
      <PereotsenkaBatchCreateDialog
        open={batchDialogToggle.isOpen}
        onClose={batchDialogToggle.close}
      />
    </>
  )
}

export { PereotsenkaPage }
