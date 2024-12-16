import type { Operatsii } from '@/common/models'
import { useEffect, useState } from 'react'
import { useLayout } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { operatsiiService } from './service'
import { GenericTable, LoadingOverlay, Pagination, usePagination } from '@/common/components'
import { operatsiiColumns } from './columns'
import { operatsiiQueryKeys } from './constants'
import { OperatsiiFilter, useOperatsiiFilters } from './filter'
import { useConfirm } from '@/common/features/confirm'
import { useSearch } from '@/common/features/search'

import { OperatsiiDialog } from './dialog'

const OperatsiiPage = () => {
  const [selected, setSelected] = useState<Operatsii | null>(null)

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const { filters } = useOperatsiiFilters()
  const { currentPage, itemsPerPage } = usePagination()
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const { data: operations, isFetching } = useQuery({
    queryKey: [
      operatsiiQueryKeys.getAll,
      {
        page: currentPage,
        limit: itemsPerPage,
        type_schet: filters.type_schet,
        search
      },
      filters.type_schet
    ],
    queryFn: operatsiiService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [operatsiiQueryKeys.delete],
    mutationFn: operatsiiService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [operatsiiQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])
  useLayout({
    title: 'Операции',
    content: OperatsiiFilter,
    onCreate: toggle.open
  })

  const handleClickEdit = (row: Operatsii) => {
    setSelected(row)
    toggle.open()
  }
  const handleClickDelete = (row: Operatsii) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <>
      <div className="flex-1 relative">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <GenericTable
          data={operations?.data ?? []}
          columns={operatsiiColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <div className="px-10 py-5">
        <Pagination pageCount={operations?.meta.pageCount ?? 0} />
      </div>
      <OperatsiiDialog data={selected} open={toggle.isOpen} onChangeOpen={toggle.setIsOpen} />
    </>
  )
}

export default OperatsiiPage
