import type { TypeOperatsii } from '@/common/models'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { operationTypeService } from './service'
import { GenericTable, LoadingOverlay, Pagination, usePagination } from '@/common/components'
import { operationTypeColumns } from './columns'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/features/layout'
import { useConfirm } from '@/common/features/confirm'
import { operationTypeQueryKeys } from './constants'
import { SearchField, useSearch } from '@/common/features/search'
import OperationTypeDialog from './dialog'

const OperationTypePage = () => {
  const [selected, setSelected] = useState<TypeOperatsii | null>(null)

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const { currentPage, itemsPerPage } = usePagination()
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const { data: operationTypes, isFetching } = useQuery({
    queryKey: [
      operationTypeQueryKeys.getAll,
      {
        page: currentPage,
        limit: itemsPerPage,
        search
      }
    ],
    queryFn: operationTypeService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [operationTypeQueryKeys.delete],
    mutationFn: operationTypeService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [operationTypeQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])

  useLayout({
    title: 'Типы операции',
    content: SearchField,
    onCreate: toggle.open
  })

  const handleClickEdit = (row: TypeOperatsii) => {
    setSelected(row)
    toggle.open()
  }
  const handleClickDelete = (row: TypeOperatsii) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <>
      <div className="flex-1 relative">
        {isPending || isFetching ? <LoadingOverlay /> : null}
        <GenericTable
          data={operationTypes?.data ?? []}
          columns={operationTypeColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <div className="px-10 py-5">
        <Pagination pageCount={operationTypes?.meta.pageCount ?? 0} />
      </div>
      <OperationTypeDialog data={selected} open={toggle.isOpen} onChangeOpen={toggle.setIsOpen} />
    </>
  )
}

export default OperationTypePage
