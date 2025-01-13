import { LoadingOverlay, Pagination, usePagination } from '@/common/components'
import { SearchField, useSearch } from '@/common/features/search'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { GenericTable } from '@/common/components'
import type { Podotchet } from '@/common/models'
import PodotchetDialog from './dialog'
import { podotchetColumns } from './columns'
import { podotchetQueryKeys } from './constants'
import { podotchetService } from './service'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

const PodotchetPage = () => {
  const [selected, setSelected] = useState<Podotchet | null>(null)

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const { currentPage, itemsPerPage } = usePagination()
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const { data: podotchetList, isFetching } = useQuery({
    queryKey: [
      podotchetQueryKeys.getAll,
      {
        page: currentPage,
        limit: itemsPerPage,
        search
      }
    ],
    queryFn: podotchetService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [podotchetQueryKeys.delete],
    mutationFn: podotchetService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [podotchetQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])

  useLayout({
    title: 'Подотчетное лицо',
    content: SearchField,
    onCreate: toggle.open
  })

  const handleClickEdit = (row: Podotchet) => {
    setSelected(row)
    toggle.open()
  }
  const handleClickDelete = (row: Podotchet) => {
    confirm({
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <>
      <div className="relative flex-1">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <GenericTable
          data={podotchetList?.data ?? []}
          columns={podotchetColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <div className="px-10 py-5">
        <Pagination pageCount={podotchetList?.meta.pageCount ?? 0} />
      </div>
      <PodotchetDialog
        data={selected}
        open={toggle.isOpen}
        onChangeOpen={toggle.setOpen}
      />
    </>
  )
}

export default PodotchetPage
