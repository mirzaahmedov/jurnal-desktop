import type { Avans } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { GenericTable, useTableSort } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import {
  SaldoNamespace,
  handleSaldoErrorDates,
  handleSaldoResponseDates
} from '@/common/features/saldo'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useDates, usePagination } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { ListView } from '@/common/views'

import { avansColumns } from './columns'
import { AvansQueryKeys } from './config'
import { AvansService } from './service'

const AvansPage = () => {
  const dates = useDates()
  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayoutStore((store) => store.setLayout)
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const [search] = useSearchFilter()

  const { main_schet_id, jur4_schet_id } = useRequisitesStore()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])

  const { data: avans, isFetching } = useQuery({
    queryKey: [
      AvansQueryKeys.getAll,
      {
        main_schet_id,
        schet_id: jur4_schet_id,
        search,
        ...sorting,
        ...dates,
        ...pagination
      }
    ],
    queryFn: AvansService.getAll
  })
  const { mutate: deleteAvans, isPending } = useMutation({
    mutationKey: [AvansQueryKeys.delete],
    mutationFn: AvansService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [AvansQueryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_4, res)
    },
    onError(err) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, err)
    }
  })

  const handleClickEdit = (row: Avans) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: Avans) => {
    confirm({
      onConfirm() {
        deleteAvans(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.avans'),
      breadcrumbs: [
        {
          title: t('pages.podotchet')
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
          columnDefs={avansColumns}
          data={avans?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          pageCount={avans?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default AvansPage
