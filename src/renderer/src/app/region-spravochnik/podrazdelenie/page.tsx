import type { Podrazdelenie } from '@/common/models'

import { useEffect, useState } from 'react'

import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { SearchField, useSearch } from '@/common/features/search'
import { useToggle } from '@/common/hooks/use-toggle'

import { subdivisionColumns } from './columns'
import { subdivisionQueryKeys } from './constants'
import SubdivisionDialog from './dialog'
import { subdivisionService } from './service'

const SubdivisionPage = () => {
  const [selected, setSelected] = useState<Podrazdelenie | null>(null)

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation()
  const { confirm } = useConfirm()
  const { search } = useSearch()

  const { data: subdivisions, isFetching } = useQuery({
    queryKey: [
      subdivisionQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: subdivisionService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [subdivisionQueryKeys.delete],
    mutationFn: subdivisionService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [subdivisionQueryKeys.getAll]
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
          data={subdivisions?.data ?? []}
          columnDefs={subdivisionColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={subdivisions?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
      <SubdivisionDialog
        data={selected}
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default SubdivisionPage
