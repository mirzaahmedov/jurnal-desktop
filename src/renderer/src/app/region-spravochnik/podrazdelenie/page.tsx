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

import { PodrazdelenieColumns } from './columns'
import { PodrazdelenieQueryKeys } from './config'
import { PodrazdelenieDialog } from './dialog'
import { PodrazdelenieService } from './service'

const PodrazdeleniePage = () => {
  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const setLayout = useLayout()

  const [selected, setSelected] = useState<Podrazdelenie | null>(null)
  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: podrazdelenies, isFetching } = useQuery({
    queryKey: [
      PodrazdelenieQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: PodrazdelenieService.getAll
  })
  const { mutate: deletePodrazdelenie, isPending } = useMutation({
    mutationKey: [PodrazdelenieQueryKeys.delete],
    mutationFn: PodrazdelenieService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PodrazdelenieQueryKeys.getAll]
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
        deletePodrazdelenie(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={podrazdelenies?.data ?? []}
          columnDefs={PodrazdelenieColumns}
          getRowId={(row) => row.id}
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
      <PodrazdelenieDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default PodrazdeleniePage
