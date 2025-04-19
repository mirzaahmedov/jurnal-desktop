import type { PodotchetMonitor } from '@/common/models'

import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

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
import { ButtonGroup } from '@/common/components/ui/button-group'
import { DownloadFile } from '@/common/features/file'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { SaldoNamespace, handleSaldoErrorDates, useSaldoController } from '@/common/features/saldo'
import {
  useSelectedMonthStore,
  validateDateWithinSelectedMonth
} from '@/common/features/selected-month'
import { useSettingsStore } from '@/common/features/settings'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useDates, usePagination } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { formatNumber } from '@/common/lib/format'
import { getProvodkaURL } from '@/common/lib/provodka'
import { ListView } from '@/common/views'

import { PodotchetMonitorColumns } from './columns'
import { PodotchetMonitorQueryKeys } from './config'
import { usePodotchetFilter } from './filters'
import { PodotchetMonitorService } from './service'

const PodotchetMonitorPage = () => {
  const dates = useDates()
  const navigate = useNavigate()
  const pagination = usePagination()
  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const startDate = useSelectedMonthStore((store) => store.startDate)
  const setLayout = useLayout()

  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { main_schet_id, budjet_id, jur4_schet_id } = useRequisitesStore()
  const { queuedMonths } = useSaldoController({
    ns: SaldoNamespace.JUR_4
  })

  const [podotchetId, setPodotchetId] = usePodotchetFilter()

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
      isSelectedMonthVisible: true,
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

  const handleClickEdit = (row: PodotchetMonitor) => {
    const path = getProvodkaURL(row)
    if (!path) {
      return
    }
    navigate(path)
  }

  return (
    <ListView>
      <ListView.Header className="space-y-5">
        <div className="w-full flex flex-row gap-10 items-center justify-between">
          <div className="flex-1 flex flex-row gap-5 items-center">
            <ChooseSpravochnik
              spravochnik={podotchetSpravochnik}
              placeholder={t('choose', {
                what: t('podotchet-litso')
              })}
              getName={(selected) => selected.name}
              getElements={(selected) => [
                { name: t('name'), value: selected.name },
                { name: t('region'), value: selected?.rayon }
              ]}
            />
          </div>

          <ButtonGroup borderStyle="dashed">
            <DownloadFile
              fileName={`дебитор-кредитор_отчет-${dates.to}.xlsx`}
              url="podotchet/monitoring/prixod/rasxod/"
              params={{
                budjet_id,
                to: dates.to,
                excel: true,
                year: startDate.getFullYear(),
                month: startDate.getMonth() + 1,
                schet_id: jur4_schet_id
              }}
              buttonText={t('debitor_kreditor_report')}
            />
            {podotchetId ? (
              <DownloadFile
                fileName={`лицевой-счет_${podotchetSpravochnik.selected?.name}-${dates.from}&${dates.to}.xlsx`}
                url={`podotchet/monitoring/export/${podotchetId}`}
                params={{
                  main_schet_id,
                  from: dates.from,
                  to: dates.to,
                  schet_id: jur4_schet_id,
                  year: startDate.getFullYear(),
                  month: startDate.getMonth() + 1,
                  excel: true
                }}
                buttonText={t('personal_account')}
              />
            ) : null}
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
      <ListView.Content loading={isFetching}>
        {isFetching ? <LoadingOverlay /> : null}
        <GenericTable
          columnDefs={PodotchetMonitorColumns}
          data={monitoring?.data ?? []}
          getRowKey={(row) => `${row.type}-${row.id}`}
          onEdit={handleClickEdit}
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title={t('total_page')}
                  colSpan={5}
                  content={formatNumber(monitoring?.meta?.page_prixod_sum ?? 0)}
                />
                <FooterCell content={formatNumber(monitoring?.meta?.page_rasxod_sum ?? 0)} />
              </FooterRow>
              {(monitoring?.meta?.pageCount ?? 0) > 1 ? (
                <FooterRow>
                  <FooterCell
                    title={t('total_period')}
                    colSpan={5}
                    content={formatNumber(monitoring?.meta?.prixod_sum ?? 0)}
                  />
                  <FooterCell content={formatNumber(monitoring?.meta?.rasxod_sum ?? 0)} />
                </FooterRow>
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
    </ListView>
  )
}

export default PodotchetMonitorPage
