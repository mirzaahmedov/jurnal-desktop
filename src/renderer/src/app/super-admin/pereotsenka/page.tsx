import type { Pereotsenka } from '@/common/models'

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

import { PereotsenkaColumns } from './columns'
import { PereotsenkaQueryKeys } from './config'
import { PereotsenkaBatchCreateDrawer } from './create-drawer'
import { PereotsenkaDialog } from './dialog'
import { PereotsenkaService } from './service'

const PereotsenkaPage = () => {
  const dialogToggle = useToggle()
  const drawerToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()

  const setLayout = useLayout()

  const [selected, setSelected] = useState<null | Pereotsenka>(null)
  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()

  const { data: pereotsenkas, isFetching } = useQuery({
    queryKey: [
      PereotsenkaQueryKeys.getAll,
      {
        search,
        ...pagination
      }
    ],
    queryFn: PereotsenkaService.getAll
  })
  const { mutate: deletePereotsenka, isPending } = useMutation({
    mutationKey: [PereotsenkaQueryKeys.delete],
    mutationFn: PereotsenkaService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PereotsenkaQueryKeys.getAll]
      })
    }
  })
  useEffect(() => {
    setLayout({
      title: t('pages.pereotsenka'),
      breadcrumbs: [
        {
          title: t('pages.admin')
        }
      ],
      content: SearchFilterDebounced,
      onCreate: drawerToggle.open
    })
  }, [setLayout, t, drawerToggle.open])

  const handleClickEdit = (row: Pereotsenka) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Pereotsenka) => {
    confirm({
      onConfirm() {
        deletePereotsenka(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={PereotsenkaColumns}
          data={pereotsenkas?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={pereotsenkas?.meta?.count ?? 0}
          pageCount={pereotsenkas?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <PereotsenkaDialog
        selected={selected}
        isOpen={dialogToggle.isOpen}
        onOpenChange={dialogToggle.close}
      />
      <PereotsenkaBatchCreateDrawer
        isOpen={drawerToggle.isOpen}
        onOpenChange={drawerToggle.setOpen}
      />
    </ListView>
  )
}

export default PereotsenkaPage
