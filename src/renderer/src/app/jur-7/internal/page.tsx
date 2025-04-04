import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useOstatokStore } from '@/app/jur-7/ostatok/store'
import {
  handleOstatokError,
  handleOstatokResponse,
  validateOstatokDate
} from '@/app/jur-7/ostatok/utils'
import { GenericTable, useTableSort } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSelectedMonthStore } from '@/common/features/selected-month/store'
import { useDates, usePagination } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { formatDate } from '@/common/lib/date'
import { ListView } from '@/common/views'

import { iznosQueryKeys } from '../iznos/config'
import { ostatokQueryKeys } from '../ostatok'
import { internalColumns } from './columns'
import { internalQueryKeys } from './config'
import { internalService } from './service'

const InternalPage = () => {
  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { queuedMonths } = useOstatokStore()
  const { startDate, endDate } = useSelectedMonthStore()
  const { sorting, handleSort, getColumnSorted } = useTableSort()

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
          queryKey: [ostatokQueryKeys.check]
        })
        queryClient.invalidateQueries({
          queryKey: [ostatokQueryKeys.getAll]
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
          validateDate={validateOstatokDate}
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
