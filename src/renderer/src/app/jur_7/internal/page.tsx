import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { handleOstatokError, handleOstatokResponse } from '@/app/jur_7/saldo/utils'
import { GenericTable, useTableSort } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { SaldoNamespace, useSaldoController } from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { validateDateWithinSelectedMonth } from '@/common/features/selected-month'
import { useDates, usePagination } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { formatDate } from '@/common/lib/date'
import { ListView } from '@/common/views'

import { iznosQueryKeys } from '../iznos/config'
import { SaldoQueryKeys } from '../saldo'
import { internalColumns } from './columns'
import { internalQueryKeys } from './config'
import { internalService } from './service'

const InternalPage = () => {
  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { startDate, endDate } = useSelectedMonthStore()
  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { queuedMonths } = useSaldoController({
    ns: SaldoNamespace.JUR_7
  })

  const dates = useDates({
    defaultFrom: formatDate(startDate),
    defaultTo: formatDate(endDate)
  })

  const { mutate: deleteInternal, isPending } = useMutation({
    mutationKey: [internalQueryKeys.delete],
    mutationFn: internalService.delete,
    onSuccess(res) {
      handleOstatokResponse(res)
      toast.success(res?.message)
      requestAnimationFrame(() => {
        queryClient.invalidateQueries({
          queryKey: [internalQueryKeys.getAll]
        })
        queryClient.invalidateQueries({
          queryKey: [SaldoQueryKeys.check]
        })
        queryClient.invalidateQueries({
          queryKey: [SaldoQueryKeys.getAll]
        })
        queryClient.invalidateQueries({
          queryKey: [iznosQueryKeys.getAll]
        })
      })
    }
  })

  const {
    data: internals,
    isFetching,
    error: internalsError
  } = useQuery({
    queryKey: [
      internalQueryKeys.getAll,
      {
        ...pagination,
        ...dates,
        ...sorting,
        search,
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: internalService.getAll,
    enabled: queuedMonths.length === 0
  })

  useEffect(() => {
    handleOstatokError(internalsError)
  }, [internalsError])

  useEffect(() => {
    setLayout({
      title: t('pages.internal-docs'),
      content: SearchFilterDebounced,
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ],
      onCreate() {
        navigate('create')
      }
    })
  }, [setLayout, navigate, t])

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
          columnDefs={internalColumns}
          data={internals?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
              onConfirm: () => deleteInternal(row.id)
            })
          }}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={internals?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default InternalPage
