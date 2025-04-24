import type { KassaPrixod } from '@/common/models'

import { useEffect, useState } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, useTableSort } from '@/common/components'
import { Button } from '@/common/components/jolly/button'
import { useConfirm } from '@/common/features/confirm'
import { DownloadFile } from '@/common/features/file'
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
import { useSettingsStore } from '@/common/features/settings'
import { useDates, usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { useKassaSaldo } from '../saldo/components/use-saldo'
import { columns } from './columns'
import { PrixodQueryKeys } from './config'
import { KassaPrixodService } from './service'
import { KassaPrixodViewDialog } from './view-dialog'

const KassaPrixodPage = () => {
  const dates = useDates()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const setLayout = useLayout()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const [search] = useSearchFilter()
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { confirm } = useConfirm()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { t } = useTranslation(['app'])
  const { report_title_id } = useSettingsStore()
  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { queuedMonths } = useKassaSaldo()

  const {
    data: prixods,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      PrixodQueryKeys.getAll,
      {
        main_schet_id,
        search,
        ...sorting,
        ...dates,
        ...pagination
      }
    ],
    queryFn: KassaPrixodService.getAll,
    enabled: !queuedMonths.length
  })
  const { mutate: deletePrixod, isPending } = useMutation({
    mutationKey: [PrixodQueryKeys.delete],
    mutationFn: KassaPrixodService.delete,
    onSuccess(res) {
      toast.success(res?.message)

      handleSaldoResponseDates(SaldoNamespace.JUR_1, res)

      requestIdleCallback(() => {
        queryClient.invalidateQueries({
          queryKey: [PrixodQueryKeys.getAll]
        })
      })
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
    }
  })

  const handleClickEdit = (row: KassaPrixod) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: KassaPrixod) => {
    confirm({
      onConfirm() {
        deletePrixod(row.id)
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
      title: t('pages.prixod-docs'),
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
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Header className="flex items-center justify-between">
        <ListView.RangeDatePicker
          {...dates}
          validateDate={validateDateWithinSelectedMonth}
          calendarProps={{
            fromMonth: startDate,
            toMonth: startDate
          }}
        />
        <DownloadFile
          fileName={`${t('pages.kassa')}-${t('pages.prixod-docs')}-${dates.from}-${dates.to}.xlsx`}
          url="/kassa/monitoring/prixod"
          params={{
            budjet_id,
            main_schet_id,
            from: dates.from,
            to: dates.to,
            year: startDate.getFullYear(),
            month: startDate.getMonth() + 1,
            report_title_id,
            excel: true
          }}
          buttonText={t('report')}
        />
      </ListView.Header>
      <ListView.Content loading={isFetching || isPending}>
        <GenericTable
          data={prixods?.data ?? []}
          columnDefs={columns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          onSort={handleSort}
          getColumnSorted={getColumnSorted}
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
                content={formatNumber(prixods?.meta?.summa ?? 0)}
                colSpan={5}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={prixods?.meta?.count ?? 0}
          pageCount={prixods?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>

      <KassaPrixodViewDialog
        selectedId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </ListView>
  )
}

export default KassaPrixodPage
