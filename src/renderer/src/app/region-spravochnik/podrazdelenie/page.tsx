import type { Podrazdelenie } from '@/common/models'

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

import { podrazdelenieColumns } from './columns'
import { podrazdelenieQueryKeys } from './constants'
import PodrazdelenieDialog from './dialog'
import { podrazdelenieService } from './service'

const PodrazdeleniePage = () => {
  const [selected, setSelected] = useState<Podrazdelenie | null>(null)

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const setLayout = useLayout()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const [search] = useSearchFilter()

  const { data: podrazdelenieList, isFetching } = useQuery({
    queryKey: [
      podrazdelenieQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: podrazdelenieService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [podrazdelenieQueryKeys.delete],
    mutationFn: podrazdelenieService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [podrazdelenieQueryKeys.getAll]
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
      title: t('pages.podrazdelenie'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      content: SearchFilterDebounced,
      onCreate: dialogToggle.open
    })
  }, [setLayout, t, dialogToggle.open])

  const handleClickEdit = (row: Podrazdelenie) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Podrazdelenie) => {
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
          data={podrazdelenieList?.data ?? []}
          columnDefs={podrazdelenieColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={podrazdelenieList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <PodrazdelenieDialog
        selected={selected}
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default PodrazdeleniePage
