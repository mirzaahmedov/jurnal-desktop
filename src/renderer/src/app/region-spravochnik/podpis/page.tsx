import type { Podpis } from '@/common/models'

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

import { podpisColumns } from './columns'
import { PodpisQueryKeys } from './config'
import { PodpisDialog } from './dialog'
import { PodpisService } from './service'

const PodpisPage = () => {
  const [selected, setSelected] = useState<Podpis>()

  const dialogToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const setLayout = useLayout()

  const { confirm } = useConfirm()
  const [search] = useSearchFilter()
  const { t } = useTranslation(['app'])

  const { data: podpisi, isFetching } = useQuery({
    queryKey: [
      PodpisQueryKeys.getAll,
      {
        search,
        ...pagination
      }
    ],
    queryFn: PodpisService.getAll
  })
  const { mutate: deletePodpis, isPending } = useMutation({
    mutationKey: [PodpisQueryKeys.delete],
    mutationFn: PodpisService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PodpisQueryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (data: Podpis) => {
    setSelected(data)
    dialogToggle.setOpen(true)
  }
  const handleClickDelete = (data: Podpis) => {
    confirm({
      onConfirm() {
        deletePodpis(data.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.podpis'),
      content: SearchFilterDebounced,
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
          data={podpisi?.data ?? []}
          columnDefs={podpisColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          count={podpisi?.meta?.count ?? 0}
          pageCount={podpisi?.meta?.pageCount ?? 0}
          {...pagination}
        />
      </ListView.Footer>
      <PodpisDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.setOpen}
      />
    </ListView>
  )
}

export default PodpisPage
