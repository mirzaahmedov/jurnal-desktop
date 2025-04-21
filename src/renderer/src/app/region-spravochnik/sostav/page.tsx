import type { Sostav } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable, LoadingOverlay } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { SostavColumns } from './columns'
import { SostavQueryKeys } from './config'
import SostavDialog from './dialog'
import { SostavService } from './service'

const SostavPage = () => {
  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const setLayout = useLayout()

  const [selected, setSelected] = useState<Sostav | null>(null)
  const [search] = useSearchFilter()

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const { data: sostavs, isFetching } = useQuery({
    queryKey: [
      SostavQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: SostavService.getAll
  })
  const { mutate: deleteSostav, isPending } = useMutation({
    mutationFn: SostavService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [SostavQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])

  useEffect(() => {
    setLayout({
      title: t('pages.sostav'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      content: SearchFilterDebounced,
      onCreate: dialogToggle.open
    })
  }, [setLayout, t, dialogToggle.open])

  const handleClickEdit = (row: Sostav) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Sostav) => {
    confirm({
      onConfirm() {
        deleteSostav(row.id)
      }
    })
  }

  return (
    <ListView>
      <div className="flex-1 relative">
        {isFetching || isPending ? <LoadingOverlay /> : null}
        <GenericTable
          data={sostavs?.data ?? []}
          columnDefs={SostavColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </div>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={sostavs?.meta?.count ?? 0}
          pageCount={sostavs?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <SostavDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default SostavPage
