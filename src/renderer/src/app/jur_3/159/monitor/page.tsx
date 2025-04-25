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
import { Button } from '@/common/components/jolly/button'
import { Menu, MenuItem, MenuPopover, MenuTrigger } from '@/common/components/jolly/menu'
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
import { getProvodkaURL } from '@/common/lib/provodka'
import { ListView } from '@/common/views'

import { useAktSaldo } from '../saldo/components/use-saldo'
import { OrganMonitorColumns } from './columns'
import { OrganMonitorQueryKeys } from './config'
import { DailyReportDialog } from './daily-report-dialog'
import { useOrganFilter } from './filters'
import { OrganMonitoringService } from './service'

const OrganMonitoringPage = () => {
  const navigate = useNavigate()
  const dates = useDates()
  const dailyReportToggle = useToggle()
  const pagination = usePagination()
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const setLayout = useLayout()

  const [organId, setOrganId] = useOrganFilter()
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
                <MenuTrigger>
                  <Button variant="ghost">
                    <Download className="btn-icon icon-start" />
                    <span className="titlecase">{t('reports')}</span>
                  </Button>
                  <MenuPopover placement="bottom end">
                    <Menu
                      selectionMode="none"
                      selectedKeys={[]}
                    >
                      <MenuItem>
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
                          className="w-full inline-flex items-center justify-start"
                        />
                      </MenuItem>

                      <MenuItem>
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
                          className="w-full inline-flex items-center justify-start"
                        />
                      </MenuItem>

                      <MenuItem>
                        <Button
                          variant="ghost"
                          onClick={dailyReportToggle.open}
                        >
                          <Download className="btn-icon !size-4 icon-start" />
                          {t('daily-report')}
                        </Button>
                      </MenuItem>
                    </Menu>
                  </MenuPopover>
                </MenuTrigger>
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
    </ListView>
  )
}

export default OrganMonitoringPage
