import type { PodotchetMonitor } from '@/common/models'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import {
  ChooseSpravochnik,
  FooterCell,
  FooterRow,
  GenericTable,
  LoadingOverlay,
  SummaTotal,
  useTableSort
} from '@/common/components'
import { Button } from '@/common/components/jolly/button'
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
import { useSpravochnik } from '@/common/features/spravochnik'
import { useDates, usePagination, useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { usePodotchetSaldo } from '../saldo_legacy/use-saldo'
import { PodotchetMonitorColumns } from './columns'
import { PodotchetMonitorQueryKeys } from './config'
import { DailyReportDialog } from './daily-report-dialog'
import { usePodotchetFilter } from './filters'
import { PodotchetMonitorService } from './service'
import { ViewModal } from './view-modal'

const PodotchetMonitorPage = () => {
  const dates = useDates()
  const pagination = usePagination()
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const dailyReportToggle = useToggle()
  const setLayout = useLayout()

  const [search] = useSearchFilter()
  const [selected, setSelected] = useState<PodotchetMonitor | null>(null)
  const [podotchetId, setPodotchetId] = usePodotchetFilter()

  const { t } = useTranslation(['app'])
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { main_schet_id, budjet_id, jur4_schet_id } = useRequisitesStore()
  const { queuedMonths } = usePodotchetSaldo()

  const podotchetSpravochnik = useSpravochnik(
    createPodotchetSpravochnik({
      value: podotchetId,
      onChange: (value) => {
        setPodotchetId(value)
      }
    })
  )

  const {
    data: monitoring,
    isFetching,
    error
  } = useQuery({
    queryFn: PodotchetMonitorService.getAll,
    queryKey: [
      PodotchetMonitorQueryKeys.getAll,
      {
        search,
        main_schet_id,
        schet_id: jur4_schet_id,
        podotchet_id: podotchetId,
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
        ...sorting,
        ...dates,
        ...pagination
      },
      podotchetId
    ],
    enabled: !!main_schet_id && !!jur4_schet_id && !queuedMonths.length
  })

  useEffect(() => {
    setLayout({
      title: t('pages.podotchet-monitoring'),
      content: SearchFilterDebounced,
      enableSaldo: true,
      breadcrumbs: [
        {
          title: t('pages.podotchet')
        }
      ]
    })
  }, [setLayout, t])
  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_4, error)
    }
  }, [error])

  return (
    <ListView>
      <ListView.Header className="space-y-5">
        <div className="w-full flex flex-row gap-10 items-center justify-between">
          <div className="flex-1 flex flex-row gap-5 items-center">
            <ChooseSpravochnik
              spravochnik={podotchetSpravochnik}
              placeholder={t('podotchet-litso')}
              getName={(selected) => selected.name}
              getElements={(selected) => [
                { name: t('name'), value: selected.name },
                { name: t('region'), value: selected?.rayon }
              ]}
            />
          </div>

          <ButtonGroup
            borderStyle="dashed"
            className="w-full max-w-3xl"
          >
            <DownloadFile
              fileName={`дебитор-кредитор_отчет-${dates.to}.xlsx`}
              url="podotchet/monitoring/prixod/rasxod/"
              params={{
                excel: true,
                to: dates.to,
                year: startDate.getFullYear(),
                month: startDate.getMonth() + 1,
                budjet_id,
                main_schet_id,
                schet_id: jur4_schet_id
              }}
              buttonText={t('debitor_kreditor_report')}
            />

            <Button
              variant="ghost"
              onPress={() => {
                dailyReportToggle.open()
              }}
              className="inline-flex items-center justify-start"
            >
              <Download className="btn-icon !size-4 icon-start" />
              {t('daily-report')}
            </Button>

            <DownloadFile
              fileName={`${t('cap')}-${dates.from}&${dates.to}.xlsx`}
              url={`/podotchet/monitoring/cap`}
              params={{
                budjet_id,
                main_schet_id,
                schet_id: jur4_schet_id,
                from: dates.from,
                to: dates.to,
                excel: true,
                year: startDate.getFullYear(),
                month: startDate.getMonth() + 1,
                report_title_id
              }}
              buttonText={t('cap-report')}
            />

            <DownloadFile
              fileName={`${t('podotchet-litso')}_${t('cap_prixod_rasxod')}_${dates.from}&${dates.to}.xlsx`}
              url="podotchet/monitoring/by-schets"
              buttonText={t('cap_prixod_rasxod')}
              params={{
                budjet_id,
                main_schet_id,
                schet_id: jur4_schet_id,
                from: dates.from,
                to: dates.to,
                excel: true,
                year: startDate.getFullYear(),
                month: startDate.getMonth() + 1,
                report_title_id
              }}
            />

            <DownloadFile
              fileName={`${t('pages.podotchet')}_2169_${t('report')}_${startDate.getFullYear()}&${startDate.getMonth() + 1}.xlsx`}
              url="/podotchet/monitoring/2169"
              buttonText={`2169 ${t('report')}`}
              params={{
                budjet_id,
                main_schet_id,
                schet_id: jur4_schet_id,
                report_title_id,
                from: dates.from,
                to: dates.to,
                year: startDate.getFullYear(),
                month: startDate.getMonth() + 1,
                excel: true
              }}
            />

            {podotchetSpravochnik.selected ? (
              <DownloadFile
                url="/podotchet/monitoring/by-podotchet/?"
                fileName={`${t('litsevoy_karta')}_${podotchetSpravochnik.selected?.fio}.xlsx`}
                buttonText={`${t('litsevoy_karta')}`}
                params={{
                  main_schet_id,
                  schet_id: jur4_schet_id,
                  podotchet_id: podotchetId,
                  excel: true
                }}
              />
            ) : null}
          </ButtonGroup>
        </div>
        <ListView.RangeDatePicker
          {...dates}
          validateDate={validateDateWithinSelectedMonth}
          calendarProps={{
            fromMonth: startDate,
            toMonth: startDate
          }}
        />
        <SummaTotal>
          <SummaTotal.Value
            name={t('remainder-from')}
            value={formatNumber(monitoring?.meta?.summa_from ?? 0)}
          />
        </SummaTotal>
      </ListView.Header>
      <ListView.Content isLoading={isFetching}>
        {isFetching ? <LoadingOverlay /> : null}
        <GenericTable
          columnDefs={PodotchetMonitorColumns}
          data={monitoring?.data ?? []}
          getRowKey={(row) => `${row.type}-${row.id}-${row.child ?? ''}`}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          onView={(row) => setSelected(row)}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title={t('total_page')}
                  colSpan={5}
                  rowSpan={2}
                />
                <FooterCell content={formatNumber(monitoring?.meta?.page_prixod_sum ?? 0)} />
                <FooterCell content={formatNumber(monitoring?.meta?.page_rasxod_sum ?? 0)} />
              </FooterRow>
              <FooterRow>
                <FooterCell
                  colSpan={2}
                  content={formatNumber(monitoring?.meta?.page_total_sum ?? 0)}
                  contentClassName="mx-auto"
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
                    <FooterCell content={formatNumber(monitoring?.meta?.prixod_sum ?? 0)} />
                    <FooterCell content={formatNumber(monitoring?.meta?.rasxod_sum ?? 0)} />
                  </FooterRow>
                  <FooterRow>
                    <FooterCell
                      colSpan={2}
                      content={formatNumber(monitoring?.meta?.total_sum ?? 0)}
                      contentClassName="mx-auto"
                    />
                  </FooterRow>
                </>
              ) : null}
            </>
          }
        />
      </ListView.Content>
      <ListView.Footer className="p-5 flex flex-col gap-5">
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
        schet_id={jur4_schet_id!}
        report_title_id={report_title_id!}
      />
      <ViewModal
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </ListView>
  )
}

export default PodotchetMonitorPage
