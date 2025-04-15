import type { OrganizationMonitor } from '@/common/models'

import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { createOrganizationSpravochnik } from '@/app/region-spravochnik/organization'
import {
  ChooseSpravochnik,
  FooterCell,
  FooterRow,
  GenericTable,
  SummaTotal,
  useTableSort
} from '@/common/components'
import { Button } from '@/common/components/ui/button'
import { ButtonGroup } from '@/common/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/common/components/ui/dropdown-menu'
import { DownloadFile } from '@/common/features/file'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { SaldoNamespace, useSaldoController } from '@/common/features/saldo'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useSettingsStore } from '@/common/features/settings'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useDates, usePagination, useToggle } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { formatNumber } from '@/common/lib/format'
import { getProvodkaURL } from '@/common/lib/provodka'
import { ListView } from '@/common/views'

import { AktSverkaDialog } from './akt-sverka'
import { OrganMonitorColumns } from './columns'
import { OrganMonitorQueryKeys } from './config'
import { useOrganFilter } from './filters'
import { OrganMonitoringService } from './service'

const OrganMonitoringPage = () => {
  const navigate = useNavigate()
  const dates = useDates()
  const dropdownToggle = useToggle()
  const pagination = usePagination()
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const [organId, setOrganId] = useOrganFilter()
  const [search] = useSearchFilter()

  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { main_schet_id, budjet_id, jur3_schet_152_id } = useRequisitesStore()
  const { t } = useTranslation(['app'])
  const { queuedMonths } = useSaldoController({
    ns: SaldoNamespace.JUR_3_152
  })

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

  const { data: monitoring, isFetching } = useQuery({
    queryKey: [
      OrganMonitorQueryKeys.getAll,
      {
        main_schet_id,
        schet_id: jur3_schet_152_id,
        organ_id: organId ? organId : undefined,
        search,
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
        ...sorting,
        ...dates,
        ...pagination
      }
    ],
    queryFn: OrganMonitoringService.getAll,
    enabled: !!main_schet_id && !!jur3_schet_152_id && !queuedMonths.length
  })

  useEffect(() => {
    setLayout({
      title: t('pages.organization-monitoring'),
      content: SearchFilterDebounced,
      breadcrumbs: [
        {
          title: t('pages.organization')
        }
      ]
    })
  }, [setLayout, t])

  const handleClickEdit = (row: OrganizationMonitor) => {
    const path = getProvodkaURL(row)
    if (!path) {
      return
    }
    navigate(path)
  }

  return (
    <ListView>
      <ListView.Header>
        <div className="w-full space-y-5 flex flex-col items-start">
          <div className="w-full flex flex-row items-center justify-between">
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
            </div>
            {main_schet_id ? (
              <ButtonGroup borderStyle="dashed">
                <DropdownMenu open={dropdownToggle.isOpen}>
                  <DropdownMenuTrigger
                    asChild
                    onClick={dropdownToggle.open}
                  >
                    <Button variant="ghost">
                      <Download className="btn-icon icon-start" />
                      <span className="titlecase">
                        {t('download-something', { something: t('reports') })}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    onInteractOutside={dropdownToggle.close}
                  >
                    <DropdownMenuItem>
                      <DownloadFile
                        fileName={`${t('cap')}-${dates.to}.xlsx`}
                        url="/159/monitoring/cap"
                        params={{
                          budjet_id,
                          main_schet_id,
                          schet_id: jur3_schet_152_id,
                          from: dates.from,
                          to: dates.to,
                          report_title_id,
                          year: startDate.getFullYear(),
                          month: startDate.getMonth() + 1,
                          excel: true
                        }}
                        buttonText={t('cap')}
                        className="w-full inline-flex items-center justify-start"
                      />
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <DownloadFile
                        fileName={`дебитор-кредитор_отчет-${dates.to}.xlsx`}
                        url="/152/monitoring/prixod/rasxod"
                        params={{
                          main_schet_id,
                          budjet_id,
                          schet_id: jur3_schet_152_id,
                          to: dates.to,
                          year: startDate.getFullYear(),
                          month: startDate.getMonth() + 1,
                          excel: true
                        }}
                        buttonText={t('debitor_kreditor_report')}
                        className="w-full inline-flex items-center justify-start"
                      />
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <DownloadFile
                        fileName={`${t('pages.organization')}-${t('pages.prixod-docs')}-${dates.from}-${dates.to}.xlsx`}
                        url="/152/monitoring/prixod"
                        params={{
                          budjet_id,
                          main_schet_id,
                          schet_id: jur3_schet_152_id,
                          from: dates.from,
                          to: dates.to,
                          year: startDate.getFullYear(),
                          month: startDate.getMonth() + 1,
                          report_title_id,
                          excel: true
                        }}
                        buttonText={t('pages.prixod-docs')}
                      />
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <DownloadFile
                        fileName={`сводный-отчет-${dates.from}&${dates.to}.xlsx`}
                        url="/152/monitoring/order"
                        params={{
                          main_schet_id,
                          schet_id: jur3_schet_152_id,
                          organ_id: organId ? organId : undefined,
                          from: dates.from,
                          to: dates.to,
                          excel: true,
                          year: startDate.getFullYear(),
                          month: startDate.getMonth() + 1,
                          contract: false
                        }}
                        buttonText={t('summarized_report')}
                        className="w-full inline-flex items-center justify-start"
                      />
                    </DropdownMenuItem>

                    <DropdownMenuItem>
                      <DownloadFile
                        fileName={`сводный-отчет-${dates.from}&${dates.to}.xlsx`}
                        url="/152/monitoring/order"
                        params={{
                          main_schet_id,
                          schet_id: jur3_schet_152_id,
                          organ_id: organId ? organId : undefined,
                          from: dates.from,
                          to: dates.to,
                          excel: true,
                          year: startDate.getFullYear(),
                          month: startDate.getMonth() + 1,
                          contract: true
                        }}
                        buttonText={t('summarized_report_by_contract')}
                        className="w-full inline-flex items-center justify-start"
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {organId ? (
                  <AktSverkaDialog
                    organId={organId}
                    mainSchetId={main_schet_id}
                    schetId={jur3_schet_152_id!}
                    from={dates.from}
                    to={dates.to}
                  />
                ) : null}
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
      <ListView.Content loading={isFetching}>
        <GenericTable
          columnDefs={OrganMonitorColumns}
          data={monitoring?.data ?? []}
          onEdit={handleClickEdit}
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
                  title={t('total_page')}
                  content={formatNumber(monitoring?.meta?.page_prixod_sum ?? 0)}
                />
                <FooterCell content={formatNumber(monitoring?.meta?.page_rasxod_sum ?? 0)} />
              </FooterRow>
              {(monitoring?.meta?.pageCount ?? 0) > 1 ? (
                <FooterRow>
                  <FooterCell
                    colSpan={6}
                    title={t('total_period')}
                    content={formatNumber(monitoring?.meta?.prixod_sum ?? 0)}
                  />
                  <FooterCell content={formatNumber(monitoring?.meta?.rasxod_sum ?? 0)} />
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
          pageCount={monitoring?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default OrganMonitoringPage
