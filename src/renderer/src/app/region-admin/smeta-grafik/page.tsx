import type { SmetaGrafik } from '@/common/models'

import { useState } from 'react'
import { Pagination, usePagination } from '@/common/components'
import { smetaGrafikQueryKeys } from './constants'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { smetaGrafikService } from './service'
import { useLayout } from '@/common/features/layout'
import { useMainSchet } from '@/common/features/main-schet'
import { useConfirm } from '@/common/features/confirm'
import { useToggle } from '@/common/hooks/use-toggle'
import { SmetaTable } from './components'
import SmetaGrafikDialog from './dialog'

const SmetaGrafikPage = () => {
  const [selected, setSelected] = useState<null | SmetaGrafik>(null)

  const { currentPage, itemsPerPage } = usePagination()
  const { main_schet } = useMainSchet()
  const { confirm } = useConfirm()
  const { open, close, isOpen: active } = useToggle()

  const queryClient = useQueryClient()

  const { data: smetaGrafikList, isFetching } = useQuery({
    queryKey: [
      smetaGrafikQueryKeys.getAll,
      {
        page: currentPage,
        limit: itemsPerPage,
        budjet_id: main_schet?.budget_id,
        main_schet_id: main_schet?.id
      }
    ],
    queryFn: smetaGrafikService.getAll
  })
  const { mutate: deleteSmetaGrafik, isPending } = useMutation({
    mutationKey: [smetaGrafikQueryKeys.delete],
    mutationFn: smetaGrafikService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [smetaGrafikQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: SmetaGrafik) => {
    setSelected(row)
    open()
  }
  const handleClickDelete = (row: SmetaGrafik) => {
    confirm({
      onConfirm() {
        deleteSmetaGrafik(row.id)
      }
    })
  }

  useLayout({
    title: 'График сметы',
    onCreate: () => {
      setSelected(null)
      open()
    }
  })

  return (
    <>
      <div className="relative w-full flex-1">
        <SmetaTable
          isLoading={isFetching || isPending}
          data={smetaGrafikList?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <div className="px-10 py-5">
        <Pagination pageCount={smetaGrafikList?.meta?.pageCount ?? 0} />
      </div>
      <SmetaGrafikDialog
        data={selected}
        open={active}
        onClose={close}
      />
    </>
  )
}

export default SmetaGrafikPage
