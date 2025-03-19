import type { Podrazdelenie } from '@/common/models'

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
import { useLayoutStore } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { podrazdelenieColumns } from './columns'
import { podrazdelenieQueryKeys } from './constants'
import PodrazdelenieDialog from './dialog'
import { podrazdelenieService } from './service'

const PodrazdeleniePage = () => {
  const [selected, setSelected] = useState<Podrazdelenie | null>(null)

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { search } = useSearch()

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
      content: SearchField,
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
