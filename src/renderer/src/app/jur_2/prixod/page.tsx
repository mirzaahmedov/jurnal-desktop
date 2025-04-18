import type { BankPrixod } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, useTableSort } from '@/common/components'
import { useConfirm } from '@/common/features/confirm'
import { DownloadFile } from '@/common/features/file'
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
import { useSettingsStore } from '@/common/features/settings'
import { useDates, usePagination } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { BankPrixodColumns } from './columns'
import { BankPrixodQueryKeys } from './config'
import { BankPrixodService } from './service'

const BankPrixodPage = () => {
  const dates = useDates()
  const pagination = usePagination()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const setLayout = useLayoutStore((store) => store.setLayout)
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const [search] = useSearchFilter()

  const { confirm } = useConfirm()
  const { t } = useTranslation(['app'])
  const { report_title_id } = useSettingsStore()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { queuedMonths } = useSaldoController({
    ns: SaldoNamespace.JUR_2
  })

  const {
    data: prixods,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      BankPrixodQueryKeys.getAll,
      {
        main_schet_id,
        search,
        ...sorting,
        ...pagination,
        ...dates
      }
    ],
    queryFn: BankPrixodService.getAll,
    enabled: !!main_schet_id && !queuedMonths.length
  })
  const { mutate: deletePrixod, isPending } = useMutation({
    mutationKey: [BankPrixodQueryKeys.delete],
    mutationFn: BankPrixodService.delete,
    onSuccess(res) {
      toast.success(res?.message)

      handleSaldoResponseDates(SaldoNamespace.JUR_2, res)

      requestAnimationFrame(() => {
        queryClient.invalidateQueries({
          queryKey: [BankPrixodQueryKeys.getAll]
        })
      })
    },
    onError(err) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, err)
    }
  })

  const handleClickEdit = (row: BankPrixod) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: BankPrixod) => {
    confirm({
      onConfirm() {
        deletePrixod(row.id)
      }
    })
  }

  useEffect(() => {
    handleSaldoErrorDates(SaldoNamespace.JUR_2, error)
  }, [error])
  useEffect(() => {
    setLayout({
      title: t('pages.prixod-docs'),
      breadcrumbs: [
        {
          title: t('pages.bank')
        }
      ],
      content: SearchFilterDebounced,
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
          fileName={`${t('pages.bank')}-${t('pages.prixod-docs')}-${dates.from}-${dates.to}.xlsx`}
          url="/bank/monitoring/prixod"
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
          columnDefs={BankPrixodColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          onSort={handleSort}
          getColumnSorted={getColumnSorted}
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
    </ListView>
  )
}

export default BankPrixodPage
