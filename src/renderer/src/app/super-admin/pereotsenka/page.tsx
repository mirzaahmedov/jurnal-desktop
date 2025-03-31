import type { Pereotsenka } from '@renderer/common/models'

import { useEffect, useState } from 'react'

import { GenericTable } from '@renderer/common/components'
import { useConfirm } from '@renderer/common/features/confirm'
import { SearchFilterDebounced } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useLayoutStore } from '@renderer/common/features/layout'
import { usePagination } from '@renderer/common/hooks'
import { useToggle } from '@renderer/common/hooks/use-toggle'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { pereotsenkaColumns } from './columns'
import { pereotsenkaQueryKeys } from './config'
import { PereotsenkaBatchCreateDrawer } from './create-drawer'
import { PereotsenkaDialog } from './dialog'
import { pereotsenkaService } from './service'

const PereotsenkaPage = () => {
  const dialogToggle = useToggle()
  const createDialogToggle = useToggle()
  const queryClient = useQueryClient()
  const pagination = usePagination()

  const setLayout = useLayoutStore((store) => store.setLayout)

  const [selected, setSelected] = useState<null | Pereotsenka>(null)

  const { t } = useTranslation(['app'])
  const [search] = useSearchFilter()
  const { confirm } = useConfirm()

  const { data: pereotsenkaList, isFetching } = useQuery({
    queryKey: [
      pereotsenkaQueryKeys.getAll,
      {
        search,
        ...pagination
      }
    ],
    queryFn: pereotsenkaService.getAll
  })
  const { mutate: deletePereotsenka, isPending } = useMutation({
    mutationKey: [pereotsenkaQueryKeys.delete],
    mutationFn: pereotsenkaService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [pereotsenkaQueryKeys.getAll]
      })
      toast.success('Переоценка успешно удалена')
    },
    onError(error) {
      console.error(error)
      toast.error('Ошибка при удалении переоценки: ' + error.message)
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
      onCreate: createDialogToggle.open
    })
  }, [setLayout, t])

  const handleClickEdit = (row: Pereotsenka) => {
    setSelected(row)
    dialogToggle.open()
  }
  const handleClickDelete = (row: Pereotsenka) => {
    confirm({
      title: 'Удалить переоценку?',
      onConfirm() {
        deletePereotsenka(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={pereotsenkaColumns}
          data={pereotsenkaList?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={pereotsenkaList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
      <PereotsenkaDialog
        data={selected}
        open={dialogToggle.isOpen}
        onClose={dialogToggle.close}
      />
      <PereotsenkaBatchCreateDrawer
        open={createDialogToggle.isOpen}
        onOpenChange={createDialogToggle.setOpen}
      />
    </ListView>
  )
}

export default PereotsenkaPage
