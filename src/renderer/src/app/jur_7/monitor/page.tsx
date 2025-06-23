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
import { type WarehouseMonitoring } from '@/common/models'
import { ListView } from '@/common/views'

import { MaterialReportModal } from '../__components__/material-report-modal'
import { useMaterialSaldo } from '../saldo/use-saldo'
import { AktReportDialog } from './akt-report-dialog'
import { columns } from './columns'
import { WarehouseMonitorQueryKeys } from './config'
import { DailyReportDialog } from './daily-report-dialog'
import { WarehouseMonitorService } from './service'
import { TurnoverReportDialog } from './turnover-report-dialog'
import { ViewModal } from './view-modal'

export const MaterialMonitorPage = () => {
  const dates = useDates()
  const pagination = usePagination()

  const materialToggle = useToggle()
  const dailyReportToggle = useToggle()
  const turnoverToggle = useToggle()
  const aktToggle = useToggle()

  const startDate = useSelectedMonthStore((store) => store.startDate)
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const setLayout = useLayout()

  const [search] = useSearchFilter()
  const [selected, setSelected] = useState<WarehouseMonitoring | null>(null)

  const { t } = useTranslation(['app'])
  const { budjet_id, main_schet_id } = useRequisitesStore()
  const { sorting, getColumnSorted, handleSort } = useTableSort()
  const { queuedMonths } = useMaterialSaldo()

  const {
    data: monitoring,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      WarehouseMonitorQueryKeys.getAll,
      {
        ...dates,
        ...pagination,
        ...sorting,
        search,
        budjet_id,
        main_schet_id
      }
    ],
    queryFn: WarehouseMonitorService.getAll,
    enabled: !!budjet_id && !!main_schet_id && !queuedMonths.length
  })

  useEffect(() => {
    setLayout({
      title: t('pages.monitoring'),
      content: SearchFilterDebounced,
      breadcrumbs: [
        {
          title: t('pages.material-warehouse')
        }
      ],
      enableSaldo: true
    })
  }, [t, setLayout])
  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_7, error)
    }
  }, [error])

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

        <ButtonGroup
          borderStyle="dashed"
          className="max-w-3xl text-end"
        >
          <Button
            variant="ghost"
            onClick={() => {
              dailyReportToggle.open()
            }}
            className="inline-flex items-center justify-start"
          >
            <Download className="btn-icon !size-4 icon-start" />
            {t('daily-report')}
          </Button>

          <DownloadFile
            fileName={`material_${t('cap')}_${startDate.getMonth() + 1}-${startDate.getFullYear()}.xlsx`}
            url="/jur_7/monitoring/cap/report"
            params={{
              month: startDate.getMonth() + 1,
              year: startDate.getFullYear(),
              from: dates.from,
              to: dates.to,
              budjet_id,
              main_schet_id,
              report_title_id,
              excel: true
            }}
            buttonText={t('cap')}
          />

          <DownloadFile
            fileName={`material_${t('cap_prixod_rasxod')}_${dates.from}&${dates.to}.xlsx`}
            url="jur_7/monitoring/by-schets"
            buttonText={t('cap_prixod_rasxod')}
            params={{
              month: startDate.getMonth() + 1,
              year: startDate.getFullYear(),
              from: dates.from,
              to: dates.to,
              budjet_id,
              main_schet_id,
              report_title_id,
              excel: true
            }}
          />

          <Button
            variant="ghost"
            onClick={materialToggle.open}
          >
            <Download className="btn-icon icon-start icon-sm" /> {t('material')}
          </Button>

          <DownloadFile
            fileName={`${t('summarized_circulation')}(${t('year')})_${startDate.getMonth() + 1}-${startDate.getFullYear()}.xlsx`}
            url="/jur_7/monitoring/schet"
            params={{
              month: startDate.getMonth() + 1,
              year: startDate.getFullYear(),
              is_year: true,
              main_schet_id,
              excel: true
            }}
            buttonText={`${t('summarized_circulation')} (${t('year')})`}
          />

          <DownloadFile
            fileName={`${t('summarized_circulation')}(${t('month')})_${startDate.getMonth() + 1}-${startDate.getFullYear()}.xlsx`}
            url="/jur_7/monitoring/schet"
            params={{
              month: startDate.getMonth() + 1,
              year: startDate.getFullYear(),
              is_year: false,
              main_schet_id,
              excel: true
            }}
            buttonText={`${t('summarized_circulation')} (${t('month')})`}
          />

          <Button
            IconStart={Download}
            variant="ghost"
            onClick={() => {
              turnoverToggle.open()
            }}
          >
            {t('summarized_circulation')}
          </Button>

          <Button
            IconStart={Download}
            variant="ghost"
            onClick={() => {
              aktToggle.open()
            }}
          >
            {t('akt')} {t('report').toLowerCase()}
          </Button>
        </ButtonGroup>

        <SummaTotal className="pt-5">
          <SummaTotal.Value
            name={t('remainder-from')}
            value={formatNumber(monitoring?.meta?.from_summa ?? 0)}
          />
        </SummaTotal>
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <GenericTable
          columnDefs={columns}
          data={monitoring?.data ?? []}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          onView={setSelected}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title={t('total_page')}
                  rowSpan={2}
                  colSpan={5}
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
                  content={formatNumber(
                    (monitoring?.meta?.page_prixod_sum ?? 0) -
                      (monitoring?.meta?.page_rasxod_sum ?? 0)
                  )}
                  contentClassName="mx-auto"
                  colSpan={2}
                />
              </FooterRow>
              {(monitoring?.meta?.pageCount ?? 0) > 1 ? (
                <>
                  <FooterRow>
                    <FooterCell
                      title={t('total_period')}
                      rowSpan={2}
                      colSpan={5}
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
                      contentClassName="mx-auto"
                      colSpan={2}
                    />
                  </FooterRow>
                </>
              ) : null}
            </>
          }
        />
      </ListView.Content>
      <ListView.Footer className="space-y-5">
        <SummaTotal>
          <SummaTotal.Value
            name={t('remainder-to')}
            value={formatNumber(monitoring?.meta?.to_summa ?? 0)}
          />
        </SummaTotal>

        <ListView.Pagination
          {...pagination}
          count={monitoring?.meta?.count ?? 0}
          pageCount={monitoring?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>

      <MaterialReportModal
        withIznos
        isOpen={materialToggle.isOpen}
        onOpenChange={materialToggle.setOpen}
        budjet_id={budjet_id!}
        main_schet_id={main_schet_id!}
        to={dates.to}
        year={startDate.getFullYear()}
        month={startDate.getMonth() + 1}
      />

      <AktReportDialog
        open={aktToggle.isOpen}
        onOpenChange={aktToggle.setOpen}
        budjet_id={budjet_id!}
        main_schet_id={main_schet_id!}
        to={dates.to}
        year={startDate.getFullYear()}
        month={startDate.getMonth() + 1}
      />

      <TurnoverReportDialog
        open={turnoverToggle.isOpen}
        onOpenChange={turnoverToggle.setOpen}
        budjet_id={budjet_id!}
        main_schet_id={main_schet_id!}
        to={dates.to}
        year={startDate.getFullYear()}
        month={startDate.getMonth() + 1}
      />

      <DailyReportDialog
        isOpen={dailyReportToggle.isOpen}
        onOpenChange={dailyReportToggle.setOpen}
        budjet_id={budjet_id!}
        main_schet_id={main_schet_id!}
      />

      <ViewModal
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </ListView>
  )
}
