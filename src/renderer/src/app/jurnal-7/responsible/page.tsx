import { GenericTable, LoadingOverlay, Pagination, usePagination } from '@/common/components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { Responsible } from '@/common/models'
import ResponsibleDialog from './dialog'
import { responsibleColumns } from './columns'
import { responsibleQueryKeys } from './constants'
import { responsibleService } from './service'
import { toast } from '@/common/hooks/use-toast'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useState } from 'react'
import { useToggle } from '@/common/hooks/use-toggle'

const ResponsiblePage = () => {
  const [selected, setSelected] = useState<null | Responsible>(null)

  const { confirm } = useConfirm()
  const { currentPage, itemsPerPage } = usePagination()
  const { open, close, isOpen: active } = useToggle()

  const queryClient = useQueryClient()
  const { data: revaluationList, isFetching } = useQuery({
    queryKey: [
      responsibleQueryKeys.getAll,
      {
        page: currentPage,
        limit: itemsPerPage
      }
    ],
    queryFn: responsibleService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [responsibleQueryKeys.delete],
    mutationFn: responsibleService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [responsibleQueryKeys.getAll]
      })
      toast({
        title: 'Материально-ответственное лицо успешно удалена'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при удалении материально-ответственное лицо',
        description: error.message
      })
    }
  })

  useLayout({
    title: 'Материально-ответственное лицо',
    onCreate() {
      setSelected(null)
      open()
    }
  })

  const handleClickEdit = (row: Responsible) => {
    open()
    setSelected(row)
  }
  const handleClickDelete = (row: Responsible) => {
    confirm({
      title: 'Удалить материально-ответственное лицо?',
      onConfirm: () => deleteMutation(row.id)
    })
  }

  return (
    <>
      <div className="relative flex-1">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <GenericTable
          columnDefs={responsibleColumns}
          data={revaluationList?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <div className="px-10 py-5">
        <Pagination pageCount={revaluationList?.meta.pageCount ?? 0} />
      </div>
      <ResponsibleDialog
        open={active}
        onClose={close}
        data={selected}
      />
    </>
  )
}

export default ResponsiblePage
