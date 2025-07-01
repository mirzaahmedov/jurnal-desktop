import type { Podotchet } from '@/common/models'

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

import { PodotchetColumns } from './columns'
import { PodotchetQueryKeys } from './config'
import { PodotchetDialog } from './dialog'
import { PodotchetService } from './service'

const PodotchetPage = () => {
  const [search] = useSearchFilter()
  const [selected, setSelected] = useState<Podotchet | null>(null)

  const setLayout = useLayout()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const { data: podotchets, isFetching } = useQuery({
    queryKey: [
      PodotchetQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: PodotchetService.getAll
  })
  const { mutate: deletePodotchet, isPending } = useMutation({
    mutationKey: [PodotchetQueryKeys.delete],
    mutationFn: PodotchetService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PodotchetQueryKeys.getAll]
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.podotchet'),
      content: SearchFilterDebounced,
      onCreate: dialogToggle.open
    })
  }, [setLayout, dialogToggle.open, t])
  useEffect(() => {
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])

  const handleClickEdit = (row: Podotchet) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Podotchet) => {
    confirm({
      onConfirm() {
        deletePodotchet(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          data={podotchets?.data ?? []}
          columnDefs={PodotchetColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={podotchets?.meta?.count ?? 0}
          pageCount={podotchets?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <PodotchetDialog
        selected={selected}
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default PodotchetPage
