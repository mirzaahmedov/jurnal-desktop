import type { PokazatUslugi } from '@/common/models'

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

import { useUslugiSaldo } from '../saldo_legacy/use-saldo'
import { pokazatUslugiColumns } from './columns'
import { PokazatUslugiQueryKeys } from './config'
import { PokazatUslugiService } from './service'
import { PokazatUslugiViewDialog } from './view-dialog'

const PokazatUslugiPage = () => {
  const setLayout = useLayout()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const pagination = usePagination()
  const dates = useDates()

  const [search] = useSearchFilter()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { main_schet_id, jur3_schet_152_id } = useRequisitesStore()
  const { confirm } = useConfirm()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { t } = useTranslation(['app'])
  const { queuedMonths } = useUslugiSaldo()

  const {
    data: uslugi,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      PokazatUslugiQueryKeys.getAll,
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
    mutationKey: [PokazatUslugiQueryKeys.delete],
    mutationFn: PokazatUslugiService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      queryClient.invalidateQueries({
        queryKey: [PokazatUslugiQueryKeys.getAll]
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
      title: t('pages.schet_faktura'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        },
        {
          title: t('pages.service')
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
      <ListView.Content isLoading={isFetching || isPending}>
        <GenericTable
          data={uslugi?.data ?? []}
          columnDefs={pokazatUslugiColumns}
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
                content={formatNumber(uslugi?.meta?.summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={uslugi?.meta?.count ?? 0}
          pageCount={uslugi?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>

      <PokazatUslugiViewDialog
        selectedId={selectedId}
        onClose={() => {
          setSelectedId(null)
        }}
      />
    </ListView>
  )
}

export default PokazatUslugiPage
