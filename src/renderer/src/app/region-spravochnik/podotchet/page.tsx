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

import { podotchetColumns } from './columns'
import { podotchetQueryKeys } from './constants'
import PodotchetDialog from './dialog'
import { podotchetService } from './service'

const PodotchetPage = () => {
  const [selected, setSelected] = useState<Podotchet | null>(null)

  const setLayout = useLayout()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()

  const { confirm } = useConfirm()
  const [search] = useSearchFilter()
  const { t } = useTranslation(['app'])

  const { data: podotchets, isFetching } = useQuery({
    queryKey: [
      podotchetQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: podotchetService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [podotchetQueryKeys.delete],
    mutationFn: podotchetService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [podotchetQueryKeys.getAll]
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
        deleteMutation(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={podotchets?.data ?? []}
          columnDefs={podotchetColumns}
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
