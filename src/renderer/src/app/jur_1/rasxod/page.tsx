import type { KassaRasxodType } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, useTableSort } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates,
  useSaldoController
} from '@/common/features/saldo'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useDates, usePagination } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { columns } from './columns'
import { queryKeys } from './constants'
import { kassaRasxodService } from './service'

const KassaRasxodPage = () => {
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { queuedMonths } = useSaldoController({
    ns: SaldoNamespace.JUR_1
  })

  const [search] = useSearchFilter()

  const dates = useDates()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const {
    data: rasxodList,
    isFetching,
    error
  } = useQuery({
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
    queryFn: kassaRasxodService.getAll,
    enabled: !queuedMonths.length
  })
  const { mutate: deleteRasxod, isPending } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: kassaRasxodService.delete,
    onSuccess(res) {
      toast.success(res?.message)

      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })

      handleSaldoResponseDates(SaldoNamespace.JUR_1, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
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
    handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
  }, [error])
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
        <ListView.RangeDatePicker
          {...dates}
          validateDate={validateDateWithinSelectedMonth}
          calendarProps={{
            fromMonth: startDate,
            toMonth: startDate
          }}
        />
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
