import type { Jur7Podrazdelenie } from '@/common/models'

import { useEffect, useState } from 'react'

import { SearchFilterDebounced } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@renderer/common/features/filters/search/search-filter-debounced'
import { usePagination } from '@renderer/common/hooks'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { toast } from '@/common/hooks/use-toast'
import { useToggle } from '@/common/hooks/use-toggle'

import { podrazdelenieColumns } from './columns'
import { podrazdelenieQueryKeys } from './constants'
import { Podrazdelenie7Dialog } from './dialog'
import { podrazdelenieService } from './service'

const Subdivision7Page = () => {
  const pagination = usePagination()
  const dialogToggle = useToggle()
  const queryClient = useQueryClient()

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const [search] = useSearchFilter()
  const { confirm } = useConfirm()

  const [selected, setSelected] = useState<null | Jur7Podrazdelenie>(null)

  const { data: podrazdelenieList, isFetching } = useQuery({
    queryKey: [
      podrazdelenieQueryKeys.getAll,
      {
        search,
        ...pagination
      }
    ],
    queryFn: podrazdelenieService.getAll
  })
  const { mutate: deleteMutation, isPending } = useMutation({
    mutationKey: [podrazdelenieQueryKeys.delete],
    mutationFn: podrazdelenieService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [podrazdelenieQueryKeys.getAll]
      })
      toast({
        title: 'Подразделениe удалено'
      })
    },
    onError(error) {
      console.error(error)
      toast({
        variant: 'destructive',
        title: 'Ошибка при удалении подразделения',
        description: error.message
      })
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.podrazdelenie'),
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ],
      content: SearchFilterDebounced,
      onCreate() {
        setSelected(null)
        dialogToggle.open()
      }
    })
  }, [setLayout, t])

  const handleClickEdit = (row: Jur7Podrazdelenie) => {
    dialogToggle.open()
    setSelected(row)
  }
  const handleClickDelete = (row: Jur7Podrazdelenie) => {
    confirm({
      title: 'Удалить подразделениe?',
      onConfirm() {
        deleteMutation(row.id)
      }
    })
  }

  return (
    <ListView>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={podrazdelenieColumns}
          data={podrazdelenieList?.data ?? []}
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
      <Podrazdelenie7Dialog
        open={dialogToggle.isOpen}
        onClose={dialogToggle.close}
        selected={selected}
      />
    </ListView>
  )
}

export default Subdivision7Page
