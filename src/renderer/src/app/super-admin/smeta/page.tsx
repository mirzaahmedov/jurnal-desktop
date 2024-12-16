import type { Smeta } from '@/common/models'

import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LoadingOverlay, Pagination, usePagination } from '@/common/components'
import { GenericTable } from '@/common/components'
import { smetaColumns } from './columns'
import { useLayout } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'
import { useConfirm } from '@/common/features/confirm'
import { SearchField, useSearch } from '@/common/features/search'
import { SmetaDialog } from './dialog'

import { smetaService } from './service'
import { smetaQueryKeys } from './config'

const SmetaPage = () => {
  const [selected, setSelected] = useState<Smeta | null>(null)

  const { currentPage, itemsPerPage } = usePagination()
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const { data: mainSchets, isFetching } = useQuery({
    queryKey: [
      smetaQueryKeys.getAll,
      {
        page: currentPage,
        limit: itemsPerPage,
        search
      }
    ],
    queryFn: smetaService.getAll
  })
  const { mutate: deleteSmeta, isPending } = useMutation({
    mutationKey: [smetaQueryKeys.delete],
    mutationFn: smetaService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [smetaQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])
  useLayout({
    title: 'Смета',
    content: SearchField,
    onCreate: toggle.open
  })

  const handleClickEdit = (row: Smeta) => {
    setSelected(row)
    toggle.open()
  }
  const handleClickDelete = (row: Smeta) => {
    confirm({
      onConfirm() {
        deleteSmeta(row.id)
      }
    })
  }
  return (
    <>
      <div className="flex-1 relative">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <GenericTable
          data={mainSchets?.data ?? []}
          columns={smetaColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <div className="px-10 py-5">
        <Pagination pageCount={mainSchets?.meta.pageCount ?? 0} />
      </div>
      <SmetaDialog data={selected} open={toggle.isOpen} onChangeOpen={toggle.setIsOpen} />
    </>
  )
}

export default SmetaPage
