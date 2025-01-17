import { GenericTable, LoadingOverlay, Pagination, usePagination } from '@/common/components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import DenominationDialog from './dialog'
import type { Naimenovanie } from '@/common/models'
import { denominationQueryKeys } from './constants'
import { naimenovanieColumns } from './columns'
import { naimenovanieService } from './service'
import { toast } from '@/common/hooks/use-toast'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useState } from 'react'
import { useToggle } from '@/common/hooks/use-toggle'

const NaimenovaniePage = () => {
  const [selected, setSelected] = useState<null | Naimenovanie>(null)

  const queryClient = useQueryClient()

  const { open, close, isOpen: active } = useToggle()
  const { confirm } = useConfirm()
  const { currentPage, itemsPerPage } = usePagination()

  const { data: denominationList, isFetching } = useQuery({
    queryKey: [
      denominationQueryKeys.getAll,
      {
        page: currentPage,
        limit: itemsPerPage
      }
    ],
    queryFn: naimenovanieService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [denominationQueryKeys.delete],
    mutationFn: naimenovanieService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [denominationQueryKeys.getAll]
      })
      toast({
        title: 'Наименование удалена'
      })
    },
    onError() {
      toast({
        title: 'Ошибка при удалении наименования',
        variant: 'destructive'
      })
    }
  })

  useLayout({
    title: 'Наименование',
    onCreate() {
      setSelected(null)
      open()
    }
  })

  const handleClickEdit = (row: Naimenovanie) => {
    setSelected(row)
    open()
  }
  const handleClickDelete = (row: Naimenovanie) => {
    confirm({
      title: 'Удалить наименование?',
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <>
      <div className="relative flex-1">
        {isPending || isFetching ? <LoadingOverlay /> : null}
        <GenericTable
          columnDefs={naimenovanieColumns}
          data={denominationList?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <div className="p-5">
        <Pagination pageCount={denominationList?.meta?.pageCount ?? 0} />
      </div>
      <DenominationDialog
        data={selected}
        open={active}
        onClose={close}
      />
    </>
  )
}

export default NaimenovaniePage
