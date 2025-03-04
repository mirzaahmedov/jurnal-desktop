import { useEffect } from 'react'

import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { useDates, usePagination } from '@renderer/common/hooks'
import { formatDate } from '@renderer/common/lib/date'
import { ListView } from '@renderer/common/views'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useOstatokStore } from '@/app/jurnal-7/ostatok/store'
import { handleOstatokError, validateOstatokDate } from '@/app/jurnal-7/ostatok/utils'
import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'

import { columns, queryKeys } from './config'
import { rasxodService, useRasxodDelete } from './service'

const Jurnal7RasxodPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { search } = useSearch()
  const { confirm } = useConfirm()
  const { recheckOstatok, minDate, maxDate, queuedMonths } = useOstatokStore()

  const dates = useDates({
    defaultFrom: formatDate(minDate),
    defaultTo: formatDate(maxDate)
  })

  const { mutate: deleteRasxod, isPending } = useRasxodDelete({
    onSuccess(res) {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      toast.success(res?.message)
      recheckOstatok?.()
    },
    onError(error) {
      toast.error(error?.message)
    }
  })

  const {
    data: rasxodList,
    isFetching,
    error: rasxodListError
  } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        ...pagination,
        ...dates,
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
      content: SearchField,
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
          columnDefs={columns}
          data={rasxodList?.data ?? []}
          onEdit={(row) => navigate(`${row.id}`)}
          onDelete={(row) => {
            confirm({
              onConfirm: () => deleteRasxod(row.id)
            })
          }}
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
