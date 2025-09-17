import type { OrganizationMonitor } from '@/common/models'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { createShartnomaSpravochnik } from '@/app/jur_3/shartnoma'
import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
import {
  ChooseSpravochnik,
  FooterCell,
  FooterRow,
  GenericTable,
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
import { formatLocaleDate, formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { useAktSaldo } from '../saldo/use-saldo'
import { AktSverkiDialog } from './akt-sverka'
import { OrganMonitorColumns } from './columns'
import { OrganMonitorQueryKeys } from './config'
import { DailyReportDialog } from './daily-report-dialog'
import { useContractFilter, useOrganFilter } from './filters'
import { OrganMonitoringService } from './service'
import { ViewModal } from './view-modal'

const OrganMonitoringPage = () => {
  const dates = useDates()
  const dailyReportToggle = useToggle()
  const pagination = usePagination()
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const setLayout = useLayout()

  const [organId, setOrganId] = useOrganFilter()
  const [contractId, setContractId] = useContractFilter()
  const [selected, setSelected] = useState<OrganizationMonitor | null>(null)
  const [search] = useSearchFilter()

  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { main_schet_id, budjet_id, jur3_schet_159_id } = useRequisitesStore()
  const { t } = useTranslation(['app'])
  const { queuedMonths } = useAktSaldo()

  const organSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: organId,
      onChange: (id) => {
        pagination.onChange({
          page: 1
        })
        setOrganId(id)
      }
    })
  )

  const shartnomaSpravochnik = useSpravochnik(
    createShartnomaSpravochnik({
      value: contractId,
      onChange: (value) => {
        pagination.onChange({
          page: 1
        })
        setContractId(value ?? 0)
      },
      params: {
        organ_id: organId ? organId : undefined
      }
    })
  )

  const {
    data: monitoring,
    isFetching,
    error
  } = useQuery({
    queryKey: [
      OrganMonitorQueryKeys.getAll,
      {
        main_schet_id,
        schet_id: jur3_schet_159_id,
        organ_id: organId ? organId : undefined,
        contract_id: contractId ? contractId : undefined,
        search,
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
        ...sorting,
        ...dates,
        ...pagination
      }
    ],
    queryFn: OrganMonitoringService.getAll,
    enabled: !!main_schet_id && !!jur3_schet_159_id && !queuedMonths.length
  })

  useEffect(() => {
    setLayout({
      title: t('pages.organization-monitoring'),
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ],
      content: SearchFilterDebounced,
      enableSaldo: true
    })
  }, [setLayout, t])
  useEffect(() => {
    if (error) {
      handleSaldoErrorDates(SaldoNamespace.JUR_3_159, error)
    }
  }, [error])

  return (
    <ListView>
      <ListView.Header>
        <div className="w-full space-y-5 flex flex-col items-start">
          <div className="w-full flex flex-row items-center justify-between gap-10">
            <div className="flex flex-row items-center gap-5">
              <ChooseSpravochnik
                spravochnik={organSpravochnik}
                placeholder={t('choose', {
                  what: t('organization')
                })}
                getName={(selected) => selected.name}
                getElements={(selected) => [
                  { name: t('inn'), value: selected?.inn },
                  { name: t('mfo'), value: selected?.mfo },
                  {
                    name: t('raschet-schet'),
                    value: selected?.account_numbers.map((a) => a.raschet_schet).join(',')
                  },
                  { name: t('bank'), value: selected?.bank_klient }
                ]}
              />
              <ChooseSpravochnik
                spravochnik={shartnomaSpravochnik}
                placeholder={t('choose', {
                  what: t('shartnoma')
                })}
                getName={(selected) =>
                  selected ? `№${selected.doc_num} - ${formatLocaleDate(selected.doc_date)}` : ''
                }
                getElements={(selected) => [
                  { name: t('doc_num'), value: selected?.doc_num },
                  { name: t('doc_date'), value: formatLocaleDate(selected?.doc_date) },
                  {
                    name: t('smeta'),
                    value: selected?.grafiks
                      .map((a) => a?.smeta?.smeta_number)
                      .filter(Boolean)
                      .join(',')
                  },
                  {
                    name: t('summa'),
                    value: formatNumber(selected.summa ? Number(selected?.summa) : 0)
                  },
                  { name: t('organization'), value: selected?.organization?.name }
                ]}
              />
            </div>
            {main_schet_id ? (
              <ButtonGroup borderStyle="dashed">
                <DownloadFile
                  fileName={`${t('cap')}-${dates.to}.xlsx`}
                  url="/159/monitoring/cap"
                  params={{
                    budjet_id,
                    main_schet_id,
                    schet_id: jur3_schet_159_id,
                    from: dates.from,
                    to: dates.to,
                    report_title_id,
                    year: startDate.getFullYear(),
                    month: startDate.getMonth() + 1,
                    excel: true
                  }}
                  buttonText={t('cap')}
                />

                <DownloadFile
                  fileName={`159_${t('cap_prixod_rasxod')}_${dates.from}&${dates.to}.xlsx`}
                  url="159/monitoring/by-schets"
                  buttonText={t('cap_prixod_rasxod')}
                  params={{
                    budjet_id,
                    main_schet_id,
                    schet_id: jur3_schet_159_id,
                    from: dates.from,
                    to: dates.to,
                    report_title_id,
                    year: startDate.getFullYear(),
                    month: startDate.getMonth() + 1,
                    excel: true
                  }}
                />

                <DownloadFile
                  fileName={`debitor_kreditor_${dates.to}.xlsx`}
                  url="/159/monitoring/prixod/rasxod"
                  params={{
                    main_schet_id,
                    budjet_id,
                    schet_id: jur3_schet_159_id,
                    to: dates.to,
                    year: startDate.getFullYear(),
                    month: startDate.getMonth() + 1,
                    excel: true
                  }}
                  buttonText={t('debitor_kreditor_report')}
                />

                <DownloadFile
                  fileName={`${t('pages.organization')}:159_2169_${t('report')}_${startDate.getFullYear()}&${startDate.getMonth() + 1}.xlsx`}
                  url="/159/monitoring/2169"
                  buttonText={`2169 ${t('report')}`}
                  params={{
                    main_schet_id,
                    schet_id: jur3_schet_159_id,
                    year: startDate.getFullYear(),
                    month: startDate.getMonth() + 1,
                    excel: true
                  }}
                />

                {organSpravochnik.selected ? (
                  <DownloadFile
                    url="/159/monitoring/report-by-organ"
                    params={{
                      main_schet_id,
                      schet_id: jur3_schet_159_id,
                      organization_id: organSpravochnik.selected.id,
                      excel: true
                    }}
                    fileName={`159_${t('organization')}_${organSpravochnik.selected.name}.xlsx`}
                    buttonText={t('litsevoy_karta')}
                  />
                ) : null}

                {organId ? (
                  <AktSverkiDialog
                    organId={organId}
                    budjetId={budjet_id!}
                    mainSchetId={main_schet_id}
                    schetId={jur3_schet_159_id!}
                    reportTitleId={report_title_id!}
                    from={dates.from}
                    to={dates.to}
                    year={startDate.getFullYear()}
                    month={startDate.getMonth() + 1}
                  />
                ) : null}

                <Button
                  variant="ghost"
                  onClick={dailyReportToggle.open}
                  IconStart={Download}
                >
                  {t('daily-report')}
                </Button>
              </ButtonGroup>
            ) : null}
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
        </div>
      </ListView.Header>
      <ListView.Content isLoading={isFetching}>
        <GenericTable
          columnDefs={OrganMonitorColumns}
          data={monitoring?.data ?? []}
          onView={setSelected}
          getRowKey={(row) => {
            return `${row.id}-${row.type}`
          }}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  colSpan={6}
                  rowSpan={2}
                  title={t('total_page')}
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
                      colSpan={6}
                      rowSpan={2}
                      title={t('total_period')}
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
        schet_id={jur3_schet_159_id!}
        report_title_id={report_title_id!}
      />

      <ViewModal
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </ListView>
  )
}

export default OrganMonitoringPage
