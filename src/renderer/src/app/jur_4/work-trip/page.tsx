import type { WorkTrip } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { GenericTable } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { SaldoNamespace, handleSaldoErrorDates } from '@/common/features/saldo'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useDates, usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { usePodotchetSaldo } from '../saldo/use-saldo'
import { WorkTripColumnDefs } from './columns'
import { WorkTripQueryKeys } from './config'
import { WorkTripService } from './service'
import { WorkTripViewDialog } from './view-dialog'

const WorkTripPage = () => {
  const dates = useDates()
  const pages = usePagination()
  const setLayout = useLayout()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [search] = useSearchFilter()

  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { t } = useTranslation(['app'])
  const { main_schet_id, jur4_schet_id } = useRequisitesStore()
  const { queuedMonths } = usePodotchetSaldo()
  const { startDate } = useSelectedMonthStore()
  const { confirm } = useConfirm()

  const {
    data: workTrips,
    isFetching: isFetchingWorkTrips,
    error
  } = useQuery({
    queryKey: [
      WorkTripQueryKeys.GetAll,
      {
        ...pages,
        ...dates,
        search,
        main_schet_id,
        schet_id: jur4_schet_id
      }
    ],
    queryFn: WorkTripService.getAll,
    enabled: !queuedMonths.length
  })

  const { mutate: deleteWorkTrip } = useMutation({
    mutationFn: WorkTripService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [WorkTripQueryKeys.GetAll]
      })
    },
    onError(err) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, err)
    }
  })

  useEffect(() => {
    setLayout({
      title: t('pages.work_trip'),
      enableSaldo: true,
      onCreate: () => navigate('create'),
      content: SearchFilterDebounced,
      breadcrumbs: [
        {
          title: t('pages.podotchet')
        }
      ]
    })
  }, [t, setLayout, navigate])

  const handleEdit = (row: WorkTrip) => {
    navigate(`${row.id}`)
  }
  const handleDelete = (row: WorkTrip) => {
    confirm({
      onConfirm: () => {
        deleteWorkTrip(row.id)
      }
    })
  }
  const handleView = (row: WorkTrip) => {
    setSelectedId(row.id)
  }

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, error)
    }
  }, [error])

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
      <ListView.Content isLoading={isFetchingWorkTrips}>
        <GenericTable
          columnDefs={WorkTripColumnDefs}
          data={workTrips?.data ?? []}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={handleView}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pages}
          pageCount={workTrips?.meta?.pageCount ?? 0}
          count={workTrips?.meta?.count ?? 0}
        />
      </ListView.Footer>

      <WorkTripViewDialog
        selectedId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </ListView>
  )
}

export default WorkTripPage
