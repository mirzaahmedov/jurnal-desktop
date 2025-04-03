import { useEffect } from 'react'

import { createOperatsiiSpravochnik } from '@renderer/app/super-admin/operatsii'
import { DownloadFile } from '@renderer/common/features/file'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@renderer/common/features/filters/search/search-filter-debounced'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { useSettingsStore } from '@renderer/common/features/settings'
import { useDates, usePagination } from '@renderer/common/hooks'
import { getProvodkaURL } from '@renderer/common/lib/provodka'
import { ListView } from '@renderer/common/views'
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
  SummaTotal
} from '@/common/components'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { useSpravochnik } from '@/common/features/spravochnik'
import { formatNumber } from '@/common/lib/format'
import { type PodotchetMonitor, TypeSchetOperatsii } from '@/common/models'

import { podotchetMonitoringColumns } from './columns'
import { podotchetMonitoringQueryKeys } from './constants'
import { useOperatsiiFilter, usePodotchetFilter } from './filters'
import { podotchetMonitoringService } from './service'

const PodotchetMonitoringPage = () => {
  const dates = useDates()
  const navigate = useNavigate()
  const pagination = usePagination()
  const report_title_id = useSettingsStore((store) => store.report_title_id)

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const [search] = useSearchFilter()
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const [operatsiiId, setOperatsiiId] = useOperatsiiFilter()
  const [podotchetId, setPodotchetId] = usePodotchetFilter()

  const operatsiiSpravochnik = useSpravochnik(
    createOperatsiiSpravochnik({
      value: operatsiiId,
      onChange: (id) => {
        pagination.onChange({
          page: 1
        })
        setOperatsiiId(id)
      },
      params: {
        type_schet: TypeSchetOperatsii.GENERAL
      }
    })
  )
  const podotchetSpravochnik = useSpravochnik(
    createPodotchetSpravochnik({
      value: podotchetId,
      onChange: (value) => {
        setPodotchetId(value)
      }
    })
  )

  const { data: monitorList, isFetching } = useQuery({
    queryFn: podotchetMonitoringService.getAll,
    queryKey: [
      podotchetMonitoringQueryKeys.getAll,
      {
        ...dates,
        ...pagination,
        search,
        main_schet_id,
        operatsii: operatsiiSpravochnik.selected?.schet,
        podotchet_id: podotchetId
      },
      podotchetId
    ],
    enabled: !!main_schet_id && !!operatsiiSpravochnik.selected
  })

  useEffect(() => {
    setLayout({
      title: t('pages.podotchet-monitoring'),
      content: SearchFilterDebounced,
      breadcrumbs: [
        {
          title: t('pages.podotchet')
        }
      ]
    })
  }, [setLayout, t])

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
              spravochnik={operatsiiSpravochnik}
              placeholder={t('choose', {
                what: t('operatsii')
              })}
              getName={(selected) =>
                selected ? `${selected.schet} - ${selected.sub_schet} ${selected.name}` : ''
              }
              getElements={(selected) => [
                { name: t('name'), value: selected.name },
                { name: t('schet'), value: selected.schet },
                { name: t('subschet'), value: selected.sub_schet }
              ]}
            />
            <ChooseSpravochnik
              spravochnik={podotchetSpravochnik}
              placeholder={t('choose', {
                what: t('podotchet')
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
                excel: true
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
                  operatsii: operatsiiSpravochnik.selected?.schet,
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
                from: dates.from,
                to: dates.to,
                excel: true,
                operatsii: operatsiiSpravochnik.selected?.schet,
                report_title_id
              }}
              buttonText={t('cap-report')}
            />
          </ButtonGroup>
        </div>
        <ListView.RangeDatePicker {...dates} />
        <SummaTotal>
          <SummaTotal.Value
            name={t('remainder-from')}
            value={formatNumber(monitorList?.meta?.summa_from_object?.summa ?? 0)}
          />
        </SummaTotal>
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        {isFetching ? <LoadingOverlay /> : null}
        <GenericTable
          columnDefs={podotchetMonitoringColumns}
          data={monitorList?.data ?? []}
          getRowKey={(row) => `${row.type}-${row.id}`}
          onEdit={handleClickEdit}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title={t('total')}
                  colSpan={5}
                  content={formatNumber(monitorList?.meta?.page_prixod_sum ?? 0)}
                />
                <FooterCell content={formatNumber(monitorList?.meta?.page_rasxod_sum ?? 0)} />
              </FooterRow>
              <FooterRow>
                <FooterCell
                  title={t('total_period')}
                  colSpan={5}
                  content={formatNumber(monitorList?.meta?.prixod_sum ?? 0)}
                />
                <FooterCell content={formatNumber(monitorList?.meta?.rasxod_sum ?? 0)} />
              </FooterRow>
            </>
          }
        />
      </ListView.Content>
      <ListView.Footer className="p-5 flex flex-col gap-5">
        <SummaTotal className="pb-5">
          <SummaTotal.Value
            name={t('remainder-to')}
            value={formatNumber(monitorList?.meta?.summa_to_object?.summa ?? 0)}
          />
        </SummaTotal>
        <ListView.Pagination
          {...pagination}
          pageCount={monitorList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default PodotchetMonitoringPage
