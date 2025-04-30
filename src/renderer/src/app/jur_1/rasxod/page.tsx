import type { KassaRasxod } from '@/common/models'

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

import { useKassaSaldo } from '../saldo/components/use-saldo'
import { columns } from './columns'
import { KassaRasxodQueryKeys } from './config'
import { KassaRasxodService } from './service'
import { KassaRasxodViewDialog } from './view-dialog'

const KassaRasxodPage = () => {
  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { queuedMonths } = useKassaSaldo()

  const [search] = useSearchFilter()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const dates = useDates()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const setLayout = useLayout()

  const {
    data: rasxods,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      KassaRasxodQueryKeys.getAll,
      {
        main_schet_id,
        search,
        ...sorting,
        ...dates,
        ...pagination
      }
    ],
    queryFn: KassaRasxodService.getAll,
    enabled: !queuedMonths.length
  })
  const { mutate: deleteRasxod, isPending } = useMutation({
    mutationKey: [KassaRasxodQueryKeys.delete],
    mutationFn: KassaRasxodService.delete,
    onSuccess(res) {
      toast.success(res?.message)

      handleSaldoResponseDates(SaldoNamespace.JUR_1, res)

      requestAnimationFrame(() => {
        queryClient.invalidateQueries({
          queryKey: [KassaRasxodQueryKeys.getAll]
        })
      })
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
    }
  })

  const handleClickEdit = (row: KassaRasxod) => {
    navigate(`${row.id}`)
  }

  const handleClickDelete = (row: KassaRasxod) => {
    confirm({
      onConfirm() {
        deleteRasxod(row.id)
      }
    })
  }

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
    }
  }, [error])
  useEffect(() => {
    setLayout({
      title: t('pages.rasxod-docs'),
      content: SearchFilterDebounced,
      enableSaldo: true,
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
          data={rasxods?.data ?? []}
          columnDefs={columns}
          getRowId={(row) => row.id}
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
                title={t('total')}
                content={formatNumber(rasxods?.meta?.summa ?? 0)}
                colSpan={6}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={rasxods?.meta?.count ?? 0}
          pageCount={rasxods?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>

      <KassaRasxodViewDialog
        selectedId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </ListView>
  )
}

export default KassaRasxodPage
