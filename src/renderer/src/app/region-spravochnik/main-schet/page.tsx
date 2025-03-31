import type { MainSchet } from '@/common/models'

import { useEffect, useState } from 'react'

import { SearchFilterDebounced } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@renderer/common/features/filters/search/search-filter-debounced'
import { requisitesQueryKeys } from '@renderer/common/features/requisites'
import { DuplicateSchetsAlert } from '@renderer/common/features/requisites/duplicate-schets-alert'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useToggle } from '@/common/hooks/use-toggle'

import { mainSchetColumns } from './columns'
import { mainSchetQueryKeys } from './constants'
import { MainSchetDialog } from './dialog'
import { mainSchetService } from './service'

const MainSchetPage = () => {
  const [selected, setSelected] = useState<MainSchet | null>(null)

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const [search] = useSearchFilter()

  const dialogToggle = useToggle()
  const pagination = usePagination()
  const queryClient = useQueryClient()

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { data: mainSchets, isFetching } = useQuery({
    queryKey: [
      mainSchetQueryKeys.getAll,
      {
        ...pagination,
        search
      }
    ],
    queryFn: mainSchetService.getAll
  })
  const { mutate: deleteMainSchet, isPending } = useMutation({
    mutationKey: [mainSchetQueryKeys.delete],
    mutationFn: mainSchetService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [mainSchetQueryKeys.getAll]
      })
      queryClient.invalidateQueries({
        queryKey: [requisitesQueryKeys.checkDuplicates]
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
          columnDefs={mainSchetColumns}
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
