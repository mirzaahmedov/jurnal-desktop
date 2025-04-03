import type { KassaRasxodType } from '@/common/models'

import { useEffect } from 'react'

import { SearchFilterDebounced } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { FooterCell, FooterRow, GenericTable, useTableSort } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { useLayoutStore } from '@/common/features/layout'
import { useDates, usePagination } from '@/common/hooks'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { columns } from './columns'
import { queryKeys } from './constants'
import { kassaRasxodService } from './service'

const KassaRasxodPage = () => {
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { sorting, handleSort, getColumnSorted } = useTableSort()

  const [search] = useSearchFilter()

  const dates = useDates()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { data: rasxodList, isFetching } = useQuery({
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
    queryFn: kassaRasxodService.getAll
  })
  const { mutate: deleteRasxod, isPending } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: kassaRasxodService.delete,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
    }
  })

  const handleClickEdit = (row: KassaRasxodType) => {
    navigate(`${row.id}`)
  }

  const handleClickDelete = (row: KassaRasxodType) => {
    confirm({
      onConfirm() {
        deleteRasxod(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.rasxod-docs'),
      content: SearchFilterDebounced,
      breadcrumbs: [
        {
          title: t('pages.kassa')
        }
      ],
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
          data={rasxodList?.data ?? []}
          columnDefs={columns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          footer={
            <FooterRow>
              <FooterCell
                title={t('total')}
                content={formatNumber(rasxodList?.meta?.summa ?? 0)}
                colSpan={5}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={rasxodList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default KassaRasxodPage
