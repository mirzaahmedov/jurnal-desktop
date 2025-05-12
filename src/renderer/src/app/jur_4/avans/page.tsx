import type { Avans } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, useTableSort } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { useConfirm } from '@/common/features/confirm'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
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
import { useLayout } from '@/common/layout'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { usePodotchetSaldo } from '../saldo/use-saldo'
import { avansColumns } from './columns'
import { AvansQueryKeys } from './config'
import { AvansService } from './service'
import { AvansViewDialog } from './view-dialog'

const AvansPage = () => {
  const dates = useDates()
  const pagination = usePagination()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setLayout = useLayout()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const [search] = useSearchFilter()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { main_schet_id, jur4_schet_id } = useRequisitesStore()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { queuedMonths } = usePodotchetSaldo()

  const {
    data: avans,
    isFetching,
    error
  } = useQuery({
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
    queryFn: AvansService.getAll,
    enabled: !!main_schet_id && !!jur4_schet_id && !queuedMonths.length
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
      enableSaldo: true,
      content: SearchFilterDebounced,
      onCreate() {
        navigate('create')
      }
    })
  }, [setLayout, t, navigate])
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
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          columnDefs={avansColumns}
          data={avans?.data ?? []}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          actions={(row) => (
            <Button
              variant="ghost"
              size="icon"
              onPress={() => {
                setSelectedId(row.id)
              }}
            >
              <Eye className="btn-icon" />
            </Button>
          )}
          footer={
            <FooterRow>
              <FooterCell
                colSpan={7}
                title={t('total')}
                content={formatNumber(avans?.meta?.summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={avans?.meta?.count ?? 0}
          pageCount={avans?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>

      <AvansViewDialog
        selectedId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </ListView>
  )
}

export default AvansPage
