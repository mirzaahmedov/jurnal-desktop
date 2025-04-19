import type { PokazatUslugi } from '@/common/models'

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
  handleSaldoResponseDates,
  useSaldoController
} from '@/common/features/saldo'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useDates, usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { pokazatUslugiColumns } from './columns'
import { queryKeys } from './config'
import { PokazatUslugiService } from './service'

const PokazatUslugiPage = () => {
  const setLayout = useLayout()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const dates = useDates()

  const [search] = useSearchFilter()

  const { main_schet_id, jur3_schet_152_id } = useRequisitesStore()
  const { confirm } = useConfirm()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { t } = useTranslation(['app'])
  const { queuedMonths } = useSaldoController({
    ns: SaldoNamespace.JUR_3_152
  })

  const {
    data: uslugi,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      queryKeys.getAll,
      {
        main_schet_id,
        schet_id: jur3_schet_152_id,
        search,
        ...sorting,
        ...dates,
        ...pagination
      }
    ],
    queryFn: PokazatUslugiService.getAll,
    enabled: !!main_schet_id && !!jur3_schet_152_id && !queuedMonths.length
  })
  const { mutate: deletePokazatUslugi, isPending } = useMutation({
    mutationKey: [queryKeys.delete],
    mutationFn: PokazatUslugiService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [queryKeys.getAll]
      })
      handleSaldoResponseDates(SaldoNamespace.JUR_3_152, res)
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3_152, error)
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
      isSelectedMonthVisible: true,
      content: SearchFilterDebounced,
      onCreate() {
        navigate('create')
      }
    })
  }, [setLayout, t, navigate])

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3_152, error)
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
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={uslugi?.data ?? []}
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
          count={uslugi?.meta?.count ?? 0}
          pageCount={uslugi?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default PokazatUslugiPage
