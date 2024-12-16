import type { MainSchet } from '@/common/models'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mainSchetService } from './service'
import { LoadingOverlay, Pagination, usePagination } from '@/common/components'
import { GenericTable } from '@/common/components'
import { mainSchetColumns } from './columns'
import { useLayout } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'
import { useConfirm } from '@/common/features/confirm'
import { mainSchetQueryKeys } from './constants'
import { SearchField, useSearch } from '@/common/features/search'
import MainSchetDialog from './dialog'

const MainSchetPage = () => {
  const [selected, setSelected] = useState<MainSchet | null>(null)

  const { currentPage, itemsPerPage } = usePagination()
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const toggle = useToggle()
  const queryClient = useQueryClient()

  const { data: mainSchets, isFetching } = useQuery({
    queryKey: [
      mainSchetQueryKeys.getAll,
      {
        page: currentPage,
        limit: itemsPerPage,
        search
      }
    ],
    queryFn: mainSchetService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [mainSchetQueryKeys.delete],
    mutationFn: mainSchetService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [mainSchetQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!toggle.isOpen) {
      setSelected(null)
    }
  }, [toggle.isOpen])
  useLayout({
    title: 'Основной счет',
    content: SearchField,
    onCreate: toggle.open
  })

  const handleClickEdit = (row: MainSchet) => {
    setSelected(row)
    toggle.open()
  }
  const handleClickDelete = (row: MainSchet) => {
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
          data={mainSchets?.data ?? []}
          columns={mainSchetColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <div className="px-10 py-5">
        <Pagination pageCount={mainSchets?.meta.pageCount ?? 0} />
      </div>
      <MainSchetDialog data={selected} open={toggle.isOpen} onChangeOpen={toggle.setIsOpen} />
    </>
  )
}

export default MainSchetPage
