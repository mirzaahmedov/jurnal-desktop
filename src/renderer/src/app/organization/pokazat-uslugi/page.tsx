import type { PokazatUslugi } from '@/common/models'

import { useEffect } from 'react'

import { SearchFilterDebounced } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenericTable, useTableSort } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useDates, usePagination } from '@/common/hooks'
import { ListView } from '@/common/views'

import { pokazatUslugiColumns } from './columns'
import { queryKeys } from './config'
import { pokazatUslugiService } from './service'

const PokazatUslugiPage = () => {
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const dates = useDates()

  const [search] = useSearchFilter()

  const { confirm } = useConfirm()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { t } = useTranslation(['app'])

  const { data: pokazatUslugiList, isFetching } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        main_schet_id,
        search,
        ...sorting,
        ...dates,
        ...pagination
      }
    ],
    queryFn: pokazatUslugiService.getAll
  })
  const { mutate: deletePokazatUslugi, isPending } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: pokazatUslugiService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: PokazatUslugi) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: PokazatUslugi) => {
    confirm({
      onConfirm() {
        deletePokazatUslugi(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.service'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ],
      content: SearchFilterDebounced,
      onCreate() {
        navigate('create')
      }
    })
  }, [setLayout, t, navigate])

  return (
    <ListView>
      <ListView.Header>
        <ListView.RangeDatePicker {...dates} />
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={pokazatUslugiList?.data ?? []}
          columnDefs={pokazatUslugiColumns}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={pokazatUslugiList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default PokazatUslugiPage
