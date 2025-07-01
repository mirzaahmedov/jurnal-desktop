import type { WarehousePodrazdelenie } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { WarehousePodrazdelenieColumns } from './columns'
import { WarehousePodrazdelenieQueryKeys } from './config'
import { WarehousePodrazdelenieDialog } from './dialog'
import { WarehousePodrazdelenieService } from './service'

const WarehousePodrazdeleniePage = () => {
  const pagination = usePagination()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const setLayout = useLayout()

  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const [selected, setSelected] = useState<null | WarehousePodrazdelenie>(null)

  const { data: podrazdelenies, isFetching } = useQuery({
    queryKey: [
      WarehousePodrazdelenieQueryKeys.getAll,
      {
        search,
        ...pagination
      }
    ],
    queryFn: WarehousePodrazdelenieService.getAll
  })
  const { mutate: deletePodrazdelenie, isPending } = useMutation({
    mutationKey: [WarehousePodrazdelenieQueryKeys.delete],
    mutationFn: WarehousePodrazdelenieService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [WarehousePodrazdelenieQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.podrazdelenie'),
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ],
      content: SearchFilterDebounced,
      onCreate() {
        setSelected(null)
        dialogToggle.open()
      }
    })
  }, [setLayout, t, dialogToggle.open])

  const handleClickEdit = (row: WarehousePodrazdelenie) => {
    dialogToggle.open()
    setSelected(row)
  }
  const handleClickDelete = (row: WarehousePodrazdelenie) => {
    confirm({
      onConfirm() {
        deletePodrazdelenie(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          columnDefs={WarehousePodrazdelenieColumns}
          data={podrazdelenies?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={podrazdelenies?.meta?.count ?? 0}
          pageCount={podrazdelenies?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <WarehousePodrazdelenieDialog
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
        selected={selected}
      />
    </ListView>
  )
}

export default WarehousePodrazdeleniePage
