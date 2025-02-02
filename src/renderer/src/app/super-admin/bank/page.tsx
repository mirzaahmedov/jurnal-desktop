import type { Bank } from '@/common/models'

import { useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { GenericTable, LoadingOverlay, Pagination, usePagination } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { bankColumns } from './columns'
import { bankQueryKeys } from './config'
import { BankDialog } from './dialog'
import { bankService } from './service'

const BankPage = () => {
  const [selected, setSelected] = useState<Bank>()

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const { confirm } = useConfirm()
  const { currentPage, itemsPerPage } = usePagination()

  const { data: podpisList, isFetching } = useQuery({
    queryKey: [
      bankQueryKeys.getAll,
      {
        page: currentPage,
        limit: itemsPerPage
      }
    ],
    queryFn: bankService.getAll
  })
  const { mutate: deletePodpis, isPending } = useMutation({
    mutationKey: [bankQueryKeys.delete],
    mutationFn: bankService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [bankQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (data: Bank) => {
    setSelected(data)
    dialogToggle.setOpen(true)
  }
  const handleClickDelete = (data: Bank) => {
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
          columnDefs={bankColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <div className="px-10 py-5">
        <Pagination pageCount={podpisList?.meta.pageCount ?? 0} />
      </div>
      <BankDialog
        data={selected}
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </>
  )
}

export default BankPage
