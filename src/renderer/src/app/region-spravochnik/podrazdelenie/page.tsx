import { GenericTable, LoadingOverlay, Pagination, usePagination } from '@/common/components'
import { SearchField, useSearch } from '@/common/features/search'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { Podrazdelenie } from '@/common/models'
import SubdivisionDialog from './dialog'
import { subdivisionColumns } from './columns'
import { subdivisionQueryKeys } from './constants'
import { subdivisionService } from './service'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

const SubdivisionPage = () => {
  const [selected, setSelected] = useState<Podrazdelenie | null>(null)

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const { currentPage, itemsPerPage } = usePagination()
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const { data: subdivisions, isFetching } = useQuery({
    queryKey: [
      subdivisionQueryKeys.getAll,
      {
        page: currentPage,
        limit: itemsPerPage,
        search
      }
    ],
    queryFn: subdivisionService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [subdivisionQueryKeys.delete],
    mutationFn: subdivisionService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [subdivisionQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])
  useLayout({
    title: 'Подразделение',
    content: SearchField,
    onCreate: toggle.open
  })

  const handleClickEdit = (row: Podrazdelenie) => {
    setSelected(row)
    toggle.open()
  }
  const handleClickDelete = (row: Podrazdelenie) => {
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
          data={subdivisions?.data ?? []}
          columns={subdivisionColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <div className="px-10 py-5">
        <Pagination pageCount={subdivisions?.meta.pageCount ?? 0} />
      </div>
      <SubdivisionDialog
        data={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setOpen}
      />
    </>
  )
}

export default SubdivisionPage
