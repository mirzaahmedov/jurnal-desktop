import type { Podpis } from '@/common/models'

import { useState } from 'react'
import { useToggle } from '@/common/hooks/use-toggle'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GenericTable, LoadingOverlay, Pagination, usePagination } from '@/common/components'
import { podpisService } from './service'
import { PodpisDialog } from './dialog'
import { podpisQueryKeys } from './constants'
import { podpisColumns } from './columns'
import { useLayout } from '@/common/features/layout'
import { useConfirm } from '@/common/features/confirm'

const PodpisPage = () => {
  const [selected, setSelected] = useState<Podpis>()

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const { confirm } = useConfirm()
  const { currentPage, itemsPerPage } = usePagination()

  const { data: podpisList, isFetching } = useQuery({
    queryKey: [
      podpisQueryKeys.getAll,
      {
        page: currentPage,
        limit: itemsPerPage
      }
    ],
    queryFn: podpisService.getAll
  })
  const { mutate: deletePodpis, isPending } = useMutation({
    mutationKey: [podpisQueryKeys.delete],
    mutationFn: podpisService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [podpisQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (data: Podpis) => {
    setSelected(data)
    dialogToggle.setIsOpen(true)
  }
  const handleClickDelete = (data: Podpis) => {
    confirm({
      title: 'Удаление подписи',
      onConfirm() {
        deletePodpis(data.id)
      }
    })
  }

  const openDialog = dialogToggle.open
  useLayout({
    title: 'Подписи',
    onCreate() {
      openDialog()
    }
  })

  return (
    <>
      <div className="flex-1 relative">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <GenericTable
          data={podpisList?.data ?? []}
          columns={podpisColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <div className="px-10 py-5">
        <Pagination pageCount={podpisList?.meta.pageCount ?? 0} />
      </div>
      <PodpisDialog
        data={selected}
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setIsOpen}
      />
    </>
  )
}

export default PodpisPage
