import { GenericTable, LoadingOverlay, Pagination, usePagination } from '@/common/components'
import { SearchField, useSearch } from '@/common/features/search'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { Sostav } from '@/common/models'
import SostavDialog from './dialog'
import { sostavColumns } from './columns'
import { sostavQueryKeys } from './constants'
import { sostavService } from './service'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

const SostavPage = () => {
  const [selected, setSelected] = useState<Sostav | null>(null)

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const { currentPage, itemsPerPage } = usePagination()
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const { data: sostavList, isFetching } = useQuery({
    queryKey: [
      sostavQueryKeys.getAll,
      {
        page: currentPage,
        limit: itemsPerPage,
        search
      }
    ],
    queryFn: sostavService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationFn: sostavService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [sostavQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])
  useLayout({
    title: 'Состав',
    content: SearchField,
    onCreate: toggle.open
  })

  const handleClickEdit = (row: Sostav) => {
    setSelected(row)
    toggle.open()
  }
  const handleClickDelete = (row: Sostav) => {
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
          data={sostavList?.data ?? []}
          columns={sostavColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <div className="px-10 py-5">
        <Pagination pageCount={sostavList?.meta.pageCount ?? 0} />
      </div>
      <SostavDialog
        data={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setOpen}
      />
    </>
  )
}

export default SostavPage
