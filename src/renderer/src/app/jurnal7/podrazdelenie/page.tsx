import { GenericTable, LoadingOverlay, Pagination, usePagination } from '@/common/components'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { Jur7Podrazdelenie } from '@/common/models'
import Subdivision7Dialog from './dialog'
import { subdivision7Columns } from './columns'
import { subdivision7QueryKeys } from './constants'
import { subdivision7Service } from './service'
import { toast } from '@/common/hooks/use-toast'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useState } from 'react'
import { useToggle } from '@/common/hooks/use-toggle'

const Subdivision7Page = () => {
  const [selected, setSelected] = useState<null | Jur7Podrazdelenie>(null)

  const { confirm } = useConfirm()
  const { currentPage, itemsPerPage } = usePagination()
  const { open, close, isOpen: active } = useToggle()

  const queryClient = useQueryClient()
  const { data: subdivision7List, isFetching } = useQuery({
    queryKey: [
      subdivision7QueryKeys.getAll,
      {
        page: currentPage,
        limit: itemsPerPage
      }
    ],
    queryFn: subdivision7Service.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [subdivision7QueryKeys.delete],
    mutationFn: subdivision7Service.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [subdivision7QueryKeys.getAll]
      })
      toast({
        title: 'Подразделениe удалено'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при удалении подразделения',
        description: error.message
      })
    }
  })

  useLayout({
    title: 'Журнал подразделениe 7',
    onCreate() {
      setSelected(null)
      open()
    }
  })

  const handleClickEdit = (row: Jur7Podrazdelenie) => {
    open()
    setSelected(row)
  }
  const handleClickDelete = (row: Jur7Podrazdelenie) => {
    confirm({
      title: 'Удалить подразделениe?',
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
          columnDefs={subdivision7Columns}
          data={subdivision7List?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <div className="px-10 py-5">
        <Pagination pageCount={subdivision7List?.meta.pageCount ?? 0} />
      </div>
      <Subdivision7Dialog
        open={active}
        onClose={close}
        data={selected}
      />
    </>
  )
}

export default Subdivision7Page
