import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { FooterCell, FooterRow, GenericTable, SummaTotal, useTableSort } from '@/common/components'
import { RangeDatePickerAlt } from '@/common/components/range-date-picker-alt'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { DownloadFile } from '@/common/features/file'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { SaldoNamespace, handleSaldoErrorDates } from '@/common/features/saldo'
import { useSelectedMonthStore } from '@/common/features/selected-month'
import { useSettingsStore } from '@/common/features/settings'
import { useDates, usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { useKassaSaldo } from '../saldo/components/use-saldo'
import { columns } from './columns'
import { KassaMonitorQueryKeys } from './config'
import { kassaMonitorService } from './service'

const KassaMonitorPage = () => {
  const dates = useDates()
  const pagination = usePagination()
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const startDate = useSelectedMonthStore((store) => store.startDate)

  const setLayout = useLayout()

  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { queuedMonths } = useKassaSaldo()
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const year = startDate.getFullYear()
  const month = startDate.getMonth() + 1

  const {
    data: monitoring,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      KassaMonitorQueryKeys.getAll,
      {
        main_schet_id,
        search,
        year,
        month,
        ...sorting,
        ...dates,
        ...pagination
      }
    ],
    queryFn: kassaMonitorService.getAll,
    enabled: !queuedMonths.length
  })

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_1, error)
    }
  }, [error])
  useEffect(() => {
    setLayout({
      title: t('pages.monitoring'),
      breadcrumbs: [
        {
          title: t('pages.kassa')
        }
      ],
      content: SearchFilterDebounced,
      enableSaldo: true
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Header>
        <div className="w-full flex items-center justify-between">
          <RangeDatePickerAlt
            {...dates}
            selectedMonth={startDate}
          />
          {main_schet_id ? (
            <ButtonGroup borderStyle="dashed">
              <DownloadFile
                fileName={`касса-дневной-отчет_${dates.from}&${dates.to}.xlsx`}
                url="kassa/monitoring/daily"
                buttonText={t('daily-report')}
                params={{
                  main_schet_id,
                  budjet_id,
                  report_title_id,
                  from: dates.from,
                  to: dates.to,
                  year: startDate.getFullYear(),
                  month: startDate.getMonth() + 1,
                  excel: true
                }}
              />
              <DownloadFile
                fileName={`касса-шапка-отчет_${dates.from}&${dates.to}.xlsx`}
                url="kassa/monitoring/cap"
                buttonText={t('cap-report')}
                params={{
                  main_schet_id,
                  budjet_id,
                  report_title_id,
                  from: dates.from,
                  to: dates.to,
                  year: startDate.getFullYear(),
                  month: startDate.getMonth() + 1,
                  excel: true
                }}
              />
            </ButtonGroup>
          ) : null}
        </div>
        <SummaTotal className="pt-5">
          <SummaTotal.Value
            name={t('remainder-from')}
            value={formatNumber(monitoring?.meta?.summa_from ?? 0)}
          />
        </SummaTotal>
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <GenericTable
          data={monitoring?.data ?? []}
          columnDefs={columns}
          getRowKey={(row) => `${row.id}-${row.rasxod_sum ? 'rasxod' : 'prixod'}`}
          getRowId={(row) => row.id}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title={t('total_page')}
                  colSpan={4}
                />
                <FooterCell
                  content={formatNumber(monitoring?.meta?.page_prixod_sum ?? 0)}
                  colSpan={1}
                />
                <FooterCell
                  content={formatNumber(monitoring?.meta?.page_rasxod_sum ?? 0)}
                  colSpan={1}
                />
              </FooterRow>
              {(monitoring?.meta?.pageCount ?? 0) > 1 ? (
                <FooterRow>
                  <FooterCell
                    title={t('total_period')}
                    colSpan={4}
                  />
                  <FooterCell
                    content={formatNumber(monitoring?.meta?.prixod_sum ?? 0)}
                    colSpan={1}
                  />
                  <FooterCell
                    content={formatNumber(monitoring?.meta?.rasxod_sum ?? 0)}
                    colSpan={1}
                  />
                </FooterRow>
              ) : null}
            </>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <SummaTotal className="pb-5">
          <SummaTotal.Value
            name={t('remainder-to')}
            value={formatNumber(monitoring?.meta?.summa_to ?? 0)}
          />
        </SummaTotal>
        <ListView.Pagination
          {...pagination}
          count={monitoring?.meta?.count ?? 0}
          pageCount={monitoring?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default KassaMonitorPage
