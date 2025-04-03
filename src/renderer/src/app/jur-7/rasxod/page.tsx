import { useEffect } from 'react'

import { useOstatokStore } from '@renderer/app/jur-7/ostatok/store'
import {
  handleOstatokError,
  handleOstatokResponse,
  validateOstatokDate
} from '@renderer/app/jur-7/ostatok/utils'
import { SearchFilterDebounced } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@renderer/common/features/filters/search/search-filter-debounced'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useDates, usePagination } from '@renderer/common/hooks'
import { formatDate } from '@renderer/common/lib/date'
import { ListView } from '@renderer/common/views'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenericTable, useTableSort } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'

import { iznosQueryKeys } from '../iznos/config'
import { ostatokQueryKeys } from '../ostatok'
import { rasxodColumns } from './columns'
import { rasxodQueryKeys } from './config'
import { rasxodService } from './service'

const Jurnal7RasxodPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { confirm } = useConfirm()
  const { minDate, maxDate, queuedMonths } = useOstatokStore()
  const { sorting, handleSort, getColumnSorted } = useTableSort()

  const dates = useDates({
    defaultFrom: formatDate(minDate),
    defaultTo: formatDate(maxDate)
  })

  const { mutate: deleteRasxod, isPending } = useMutation({
    mutationKey: [rasxodQueryKeys.delete],
    mutationFn: rasxodService.delete,
    onSuccess(res) {
      handleOstatokResponse(res)
      toast.success(res?.message)
      requestAnimationFrame(() => {
        queryClient.invalidateQueries({
          queryKey: [rasxodQueryKeys.getAll]
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
    data: rasxodList,
    isFetching,
    error: rasxodListError
  } = useQuery({
    queryKey: [
      rasxodQueryKeys.getAll,
      {
        ...pagination,
        ...dates,
        ...sorting,
        search,
        main_schet_id
      }
    ],
    queryFn: rasxodService.getAll,
    enabled: queuedMonths.length === 0
  })

  useEffect(() => {
    handleOstatokError(rasxodListError)
  }, [rasxodListError])

  useEffect(() => {
    setLayout({
      title: t('pages.rasxod-docs'),
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
            fromMonth: minDate,
            toMonth: maxDate
          }}
        />
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={rasxodColumns}
          data={rasxodList?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
              onConfirm: () => deleteRasxod(row.id)
            })
          }}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
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

export default Jurnal7RasxodPage
