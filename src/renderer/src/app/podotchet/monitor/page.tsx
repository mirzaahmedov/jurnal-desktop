import { useEffect } from 'react'

import { useSettingsStore } from '@renderer/common/features/app-defaults'
import { DownloadFile } from '@renderer/common/features/file'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField } from '@renderer/common/features/search/search-field'
import { useSearch } from '@renderer/common/features/search/use-search'
import { useDates, usePagination } from '@renderer/common/hooks'
import { useLocationState } from '@renderer/common/hooks/use-location-state'
import { getProvodkaURL } from '@renderer/common/lib/provodka'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
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
import { podotchetMonitoringService } from './service'

const PodotchetMonitoringPage = () => {
  const dates = useDates()
  const navigate = useNavigate()
  const pagination = usePagination()
  const report_title_id = useSettingsStore((store) => store.report_title_id)

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { t } = useTranslation(['app'])
  const { search } = useSearch()
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const [podotchetId, setPodotchetId] = useLocationState<undefined | number>('podotchet_id')
  const [operatsii, setOperatsii] = useLocationState<undefined | number>('operatsii')

  const podotchetSpravochnik = useSpravochnik(
    createPodotchetSpravochnik({
      value: podotchetId,
      onChange: (value) => {
        setPodotchetId(value)
      }
    })
  )
  const operatsiiSpravochnik = useSpravochnik(
    createOperatsiiSpravochnik({
      value: operatsii,
      onChange: (id) => {
        setOperatsii(id)
      },
      params: {
        type_schet: TypeSchetOperatsii.GENERAL
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
        podotchet_id: podotchetId,
        operatsii: operatsiiSpravochnik.selected?.schet
      },
      podotchetId
    ],
    enabled: !!main_schet_id && !!operatsiiSpravochnik.selected
  })

  useEffect(() => {
    setLayout({
      title: t('pages.podotchet-monitoring'),
      content: SearchField,
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
              placeholder="Выберите операцию"
              getName={(selected) =>
                selected ? `${selected.schet} - ${selected.sub_schet} ${selected.name}` : ''
              }
              getElements={(selected) => [
                { name: 'Наименование', value: selected.name },
                { name: 'Счет', value: selected.schet },
                { name: 'Субсчет', value: selected.sub_schet }
              ]}
            />
            <ChooseSpravochnik
              disabled={!operatsiiSpravochnik.selected}
              spravochnik={podotchetSpravochnik}
              placeholder="Выберите подотчетное лицо"
              getName={(selected) => selected.name}
              getElements={(selected) => [
                { name: 'Наименование', value: selected.name },
                { name: 'Регион', value: selected?.rayon }
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
              buttonText={t('debitor-kreditor-report')}
            />
            {podotchetId ? (
              <DownloadFile
                fileName={`лицевой-счет_${podotchetSpravochnik.selected?.name}-${dates.from}&${dates.to}.xlsx`}
                url={`podotchet/monitoring/export/${podotchetId}`}
                params={{
                  operatsii: operatsiiSpravochnik.selected?.schet,
                  main_schet_id,
                  from: dates.from,
                  to: dates.to,
                  excel: true
                }}
                buttonText={t('personal-account')}
              />
            ) : null}
            <DownloadFile
              fileName={`${t('cap')}-${dates.from}&${dates.to}.xlsx`}
              url={`/podotchet/monitoring/cap`}
              params={{
                budjet_id,
                main_schet_id,
                operatsii: operatsiiSpravochnik.selected?.schet,
                from: dates.from,
                to: dates.to,
                excel: true,
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
          <SummaTotal.Value
            name={t('debet')}
            value={formatNumber(monitorList?.meta?.summa_from_object?.prixod_sum ?? 0)}
          />
          <SummaTotal.Value
            name={t('kredit')}
            value={formatNumber(monitorList?.meta?.summa_from_object?.rasxod_sum ?? 0)}
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
          <SummaTotal.Value
            name={t('debet')}
            value={formatNumber(monitorList?.meta?.summa_to_object?.prixod_sum ?? 0)}
          />
          <SummaTotal.Value
            name={t('kredit')}
            value={formatNumber(monitorList?.meta?.summa_to_object?.rasxod_sum ?? 0)}
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
