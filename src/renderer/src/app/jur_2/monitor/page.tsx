import type { BankMonitoring } from '@/common/models'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { FooterCell, FooterRow, GenericTable, SummaTotal, useTableSort } from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { DownloadFile } from '@/common/features/file'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { SaldoNamespace, handleSaldoErrorDates } from '@/common/features/saldo'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useSettingsStore } from '@/common/features/settings'
import { useDates, usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { useBankSaldo } from '../saldo/components/use-saldo'
import { BankMonitorColumns } from './columns'
import { BankMonitorQueryKeys } from './config'
import { DailyReportDialog } from './daily-report-dialog'
import { BankMonitorService } from './service'
import { ViewModal } from './view-modal'

const BankMonitorPage = () => {
  const setLayout = useLayout()
  const dailyReportToggle = useToggle()

  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const dates = useDates()
  const pagination = usePagination()

  const [search] = useSearchFilter()
  const [selected, setSelected] = useState<BankMonitoring | null>(null)

  const { t } = useTranslation(['app'])
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { main_schet_id, budjet_id } = useRequisitesStore()
  const { queuedMonths } = useBankSaldo()

  const year = startDate.getFullYear()
  const month = startDate.getMonth() + 1

  const {
    data: monitoring,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      BankMonitorQueryKeys.getAll,
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
    queryFn: BankMonitorService.getAll,
    enabled: !!main_schet_id && !queuedMonths.length
  })

  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_2, error)
    }
  }, [error])
  useEffect(() => {
    setLayout({
      title: t('pages.monitoring'),
      content: SearchFilterDebounced,
      enableSaldo: true,
      breadcrumbs: [
        {
          title: t('pages.bank')
        }
      ]
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Header className="space-y-4">
        <div className="w-full flex items-center justify-between">
          <ListView.RangeDatePicker
            {...dates}
            validateDate={validateDateWithinSelectedMonth}
            calendarProps={{
              fromMonth: startDate,
              toMonth: startDate
            }}
          />
          {main_schet_id && report_title_id ? (
            <ButtonGroup
              borderStyle="dashed"
              className="max-w-2xl"
            >
              <Button
                variant="ghost"
                onClick={dailyReportToggle.open}
              >
                <Download className="btn-icon icon-sm icon-start" />
                {t('daily-report')}
              </Button>

              <DownloadFile
                fileName={`${t('pages.bank')}-${t('report')}_${dates.from}&${dates.to}.xlsx`}
                url="bank/monitoring/cap"
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

              <DownloadFile
                fileName={`${t('pages.bank')}-${t('by_contract')}_${dates.from}&${dates.to}.xlsx`}
                url="/bank/monitoring/by-contract"
                buttonText={t('by_contract')}
                params={{
                  main_schet_id,
                  from: dates.from,
                  to: dates.to,
                  excel: true
                }}
              />

              <DownloadFile
                fileName={`${t('pages.bank')}-${t('by_smeta')}_${dates.from}&${dates.to}.xlsx`}
                url="/bank/monitoring/by-smeta"
                buttonText={t('by_smeta')}
                params={{
                  main_schet_id,
                  from: dates.from,
                  to: dates.to,
                  excel: true
                }}
              />

              <DownloadFile
                fileName={`${t('pages.bank')}_${t('cap_prixod_rasxod')}_${dates.from}&${dates.to}.xlsx`}
                url="bank/monitoring/by-schet"
                buttonText={t('cap_prixod_rasxod')}
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
                fileName={`${t('pages.bank')}_2169_${t('report')}_${startDate.getFullYear()}&${startDate.getMonth() + 1}.xlsx`}
                url="/bank/monitoring/2169"
                buttonText={`2169 ${t('report')}`}
                params={{
                  main_schet_id,
                  year: startDate.getFullYear(),
                  month: startDate.getMonth() + 1,
                  excel: true
                }}
              />
            </ButtonGroup>
          ) : null}
        </div>
        <SummaTotal>
          <SummaTotal.Value
            name={t('remainder-from')}
            value={formatNumber(monitoring?.meta?.summa_from ?? 0)}
          />
        </SummaTotal>
      </ListView.Header>
      <ListView.Content isLoading={isFetching}>
        <GenericTable
          data={monitoring?.data ?? []}
          columnDefs={BankMonitorColumns}
          getRowKey={(row) => `${row.id}-${row.rasxod_sum ? 'rasxod' : 'prixod'}`}
          getRowId={(row) => row.id}
          onView={(row) => setSelected(row)}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title={t('total_page')}
                  colSpan={5}
                  rowSpan={2}
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
              <FooterRow>
                <FooterCell
                  content={formatNumber(monitoring?.meta?.page_total_sum ?? 0)}
                  colSpan={2}
                  contentClassName="mx-auto"
                />
              </FooterRow>
              {(monitoring?.meta?.pageCount ?? 0) > 1 ? (
                <>
                  <FooterRow>
                    <FooterCell
                      title={t('total_period')}
                      colSpan={5}
                      rowSpan={2}
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
                  <FooterRow>
                    <FooterCell
                      content={formatNumber(
                        (monitoring?.meta?.prixod_sum ?? 0) - (monitoring?.meta?.rasxod_sum ?? 0)
                      )}
                      colSpan={2}
                      contentClassName="mx-auto"
                    />
                  </FooterRow>
                </>
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
      <DailyReportDialog
        isOpen={dailyReportToggle.isOpen}
        onOpenChange={dailyReportToggle.setOpen}
        budjet_id={budjet_id!}
        main_schet_id={main_schet_id!}
        report_title_id={report_title_id!}
      />

      <ViewModal
        selected={selected}
        onClose={() => {
          setSelected(null)
        }}
      />
    </ListView>
  )
}

export default BankMonitorPage
