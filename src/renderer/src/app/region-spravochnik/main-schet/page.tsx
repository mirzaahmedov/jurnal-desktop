import type { MainSchet } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { RequisitesQueryKeys, useRequisitesStore } from '@/common/features/requisites'
import { DuplicateSchetsAlert } from '@/common/features/requisites/guards/duplicate-schets-alert'
import { usePagination } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { MainSchetColumns } from './columns'
import { MainSchetQueryKeys } from './config'
import { MainSchetDialog } from './dialog'
import { MainSchetService } from './service'

const MainSchetPage = () => {
  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const budjet_id = useRequisitesStore((store) => store.budjet_id)
  const setLayout = useLayout()

  const [selected, setSelected] = useState<MainSchet | null>(null)
  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: mainSchets, isFetching } = useQuery({
    queryKey: [
      MainSchetQueryKeys.getAll,
      {
        ...pagination,
        budjet_id,
        search
      }
    ],
    queryFn: MainSchetService.getAll
  })
  const { mutate: deleteMainSchet, isPending } = useMutation({
    mutationKey: [MainSchetQueryKeys.delete],
    mutationFn: MainSchetService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [MainSchetQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [RequisitesQueryKeys.duplicates]
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
      title: t('pages.main-schet'),
      breadcrumbs: [
        {
          title: t('pages.spravochnik')
        }
      ],
      content: SearchFilterDebounced,
      onCreate: dialogToggle.open
    })
  }, [setLayout, t, dialogToggle.open])

  const handleClickEdit = (row: MainSchet) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: MainSchet) => {
    confirm({
      onConfirm() {
        deleteMainSchet(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={mainSchets?.data ?? []}
          columnDefs={MainSchetColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={mainSchets?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <MainSchetDialog
        selected={selected}
        open={dialogToggle.isOpen}
        onChangeOpen={dialogToggle.setOpen}
        original={mainSchets?.data?.[0] ?? undefined}
      />
      <DuplicateSchetsAlert />
    </ListView>
  )
}

export default MainSchetPage
