import type { Podpis } from '@/common/models'

import { useEffect, useState } from 'react'

import { SearchField, useSearch } from '@renderer/common/features/search'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { podpisColumns } from './columns'
import { podpisQueryKeys } from './config'
import { PodpisDialog } from './dialog'
import { podpisService } from './service'

const PodpisPage = () => {
  const [selected, setSelected] = useState<Podpis>()

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { confirm } = useConfirm()
  const { search } = useSearch()
  const { t } = useTranslation(['app'])

  const { data: podpisList, isFetching } = useQuery({
    queryKey: [
      podpisQueryKeys.getAll,
      {
        search,
        ...pagination
      }
    ],
    queryFn: podpisService.getAll
  })
  const { mutate: deletePodpis, isPending } = useMutation({
    mutationKey: [podpisQueryKeys.delete],
    mutationFn: podpisService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [podpisQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (data: Podpis) => {
    setSelected(data)
    dialogToggle.setOpen(true)
  }
  const handleClickDelete = (data: Podpis) => {
    confirm({
      title: 'Удаление подписи',
      onConfirm() {
        deletePodpis(data.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.podpis'),
      content: SearchField,
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      onCreate() {
        dialogToggle.open()
        setSelected(undefined)
      }
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={podpisList?.data ?? []}
          columnDefs={podpisColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          pageCount={podpisList?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
      <PodpisDialog
        data={selected}
        open={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default PodpisPage
