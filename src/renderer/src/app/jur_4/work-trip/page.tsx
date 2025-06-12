import type { WorkTrip } from '@/common/models'

import { useEffect } from 'react'

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
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useDates, usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { WorkTripColumnDefs } from './column-defs'
import { WorkTripQueryKeys } from './config'
import { WorkTripService } from './service'

const WorkTripPage = () => {
  const dates = useDates()
  const pages = usePagination()
  const setLayout = useLayout()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { main_schet_id, jur4_schet_id } = useRequisitesStore()
  const { startDate } = useSelectedMonthStore()
  const { confirm } = useConfirm()

  const { data: workTrips, isFetching: isFetchingWorkTrips } = useQuery({
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
    queryFn: WorkTripService.getAll
  })

  const { mutate: deleteWorkTrip } = useMutation({
    mutationFn: WorkTripService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [WorkTripQueryKeys.GetAll]
      })
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
      <ListView.Content loading={isFetchingWorkTrips}>
        <GenericTable
          columnDefs={WorkTripColumnDefs}
          data={workTrips?.data ?? []}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pages}
          pageCount={workTrips?.meta?.pageCount ?? 0}
          count={workTrips?.meta?.count ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default WorkTripPage
