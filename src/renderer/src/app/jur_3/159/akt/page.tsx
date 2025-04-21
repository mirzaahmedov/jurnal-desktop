import type { Akt } from '@/common/models'

import { useEffect } from 'react'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { FooterCell, FooterRow, GenericTable, useTableSort } from '@/common/components'
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
import { useDates, usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { useAktSaldo } from '../saldo/components/use-saldo'
import { AktColumns } from './columns'
import { AktQueryKeys } from './config'
import { aktService } from './service'

const AktPage = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const pagination = usePagination()
  const dates = useDates()
  const setLayout = useLayout()
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const { main_schet_id, jur3_schet_159_id } = useRequisitesStore()

  const [search] = useSearchFilter()

  const { confirm } = useConfirm()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { queuedMonths } = useAktSaldo()
  const { t } = useTranslation(['app'])

  const {
    data: akts,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      AktQueryKeys.getAll,
      {
        main_schet_id,
        schet_id: jur3_schet_159_id,
        search,
        ...sorting,
        ...dates,
        ...pagination
      }
    ],
    queryFn: aktService.getAll,
    enabled: !!main_schet_id && !queuedMonths.length
  })
  const { mutate: deleteAkt, isPending: isDeletingAkt } = useMutation({
    mutationKey: [AktQueryKeys.delete],
    mutationFn: aktService.delete,
    onSuccess(res) {
      toast.success(res?.message)
      handleSaldoResponseDates(SaldoNamespace.JUR_3_159, res)

      requestAnimationFrame(() => {
        queryClient.invalidateQueries({
          queryKey: [AktQueryKeys.getAll]
        })
      })
    },
    onError(error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3_159, error)
    }
  })

  const handleClickEdit = (row: Akt) => {
    navigate(`${row.id}`)
  }
  const handleClickDelete = (row: Akt) => {
    confirm({
      onConfirm() {
        deleteAkt(row.id)
      }
    })
  }

  useEffect(() => {
    setLayout({
      title: t('pages.akt'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ],
      content: SearchFilterDebounced,
      isSelectedMonthVisible: true,
      onCreate() {
        navigate('create')
      }
    })
  }, [setLayout, t, navigate])
  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3_159, error)
    }
  }, [error])

  return (
    <ListView>
      <ListView.Header className="flex flex-row items-center justify-between">
        <ListView.RangeDatePicker
          {...dates}
          validateDate={validateDateWithinSelectedMonth}
          calendarProps={{
            fromMonth: startDate,
            toMonth: startDate
          }}
        />
        <DownloadFile
          fileName={`aкт-приема-пересдач_шапка-${dates.from}&${dates.to}.xlsx`}
          url="/akt/export/cap"
          params={{
            main_schet_id,
            from: dates.from,
            schet_id: jur3_schet_159_id,
            to: dates.to,
            excel: true
          }}
          buttonText={t('cap-report')}
        />
      </ListView.Header>
      <ListView.Content loading={isFetching || isDeletingAkt}>
        <GenericTable
          data={akts?.data ?? []}
          columnDefs={AktColumns}
          getRowId={(row) => row.id}
          onEdit={handleClickEdit}
          onDelete={handleClickDelete}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          footer={
            <FooterRow>
              <FooterCell
                colSpan={6}
                title={t('total')}
                content={formatNumber(akts?.meta?.summa ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <ListView.Pagination
          {...pagination}
          count={akts?.meta?.count ?? 0}
          pageCount={akts?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default AktPage
