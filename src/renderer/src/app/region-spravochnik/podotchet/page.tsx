import type { Podotchet } from '@/common/models'

import { useEffect, useState } from 'react'

import { SearchField } from '@renderer/common/features/search/search-field'
import { useSearch } from '@renderer/common/features/search/use-search'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayout } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { podotchetColumns } from './columns'
import { podotchetQueryKeys } from './constants'
import PodotchetDialog from './dialog'
import { podotchetService } from './service'

const PodotchetPage = () => {
  const [selected, setSelected] = useState<Podotchet | null>(null)

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()

  const { confirm } = useConfirm()
  const { search } = useSearch()
  const { t } = useTranslation(['app'])

  const { data: podotchetList, isFetching } = useQuery({
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
    if (!dialogToggle.isOpen) {
      setSelected(null)
    }
  }, [dialogToggle.isOpen])

  useLayout({
    title: t('pages.podotchet'),
    content: SearchField,
    onCreate: dialogToggle.open
  })

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
          data={podotchetList?.data ?? []}
          columnDefs={podotchetColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={podotchetList?.meta?.pageCount ?? 0}
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
