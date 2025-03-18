import { useEffect } from 'react'

import { useSettingsStore } from '@renderer/common/features/app-defaults'
import { DownloadFile } from '@renderer/common/features/file'
import { useLayoutStore } from '@renderer/common/features/layout'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { useDates, usePagination } from '@renderer/common/hooks'
import { useLocationState } from '@renderer/common/hooks/use-location-state'
import { ListView } from '@renderer/common/views'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
import {
  ChooseSpravochnik,
  FooterCell,
  FooterRow,
  GenericTable,
  LoadingOverlay
} from '@/common/components'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { ScrollArea } from '@/common/components/ui/scroll-area'
import { useSpravochnik } from '@/common/features/spravochnik'
import { formatNumber } from '@/common/lib/format'
import { TypeSchetOperatsii } from '@/common/models'

import { podotchetMonitoringColumns } from './columns'
import { podotchetMonitoringQueryKeys } from './constants'
import { podotchetMonitoringService } from './service'

const PodotchetMonitoringPage = () => {
  const pagination = usePagination()
  const dates = useDates()
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

  return (
    <ListView>
      <div className="bg-white">
        <div className="p-5 space-y-5 flex flex-col items-start">
          <div className="w-full flex flex-row gap-10 items-center justify-between">
            <div className="flex-1 flex flex-row gap-5 items-center">
              <ChooseSpravochnik
                spravochnik={operatsiiSpravochnik}
                placeholder="Выберите операцию"
                getName={(selected) => selected.name}
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
          <SummaFields
            summaDebet={
              monitorList?.meta && monitorList?.meta.summa_from > 0
                ? monitorList?.meta?.summa_from
                : 0
            }
            summaKredit={
              monitorList?.meta && monitorList?.meta.summa_from < 0
                ? monitorList?.meta?.summa_from
                : 0
            }
          />
        </div>
      </div>
      <ScrollArea className="flex-1 relative">
        {isFetching ? <LoadingOverlay /> : null}
        <GenericTable
          columnDefs={podotchetMonitoringColumns}
          data={monitorList?.data ?? []}
          getRowKey={(row) => `${row.type}-${row.id}`}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title={t('total')}
                  colSpan={5}
                  content={formatNumber(monitorList?.meta?.prixod_sum ?? 0)}
                />
                <FooterCell content={formatNumber(monitorList?.meta?.rasxod_sum ?? 0)} />
              </FooterRow>
            </>
          }
        />
      </ScrollArea>
      <ListView.Footer className="p-5 flex flex-col gap-5">
        <SummaFields
          summaDebet={
            monitorList?.meta && monitorList?.meta.summa_to > 0 ? monitorList?.meta?.summa_to : 0
          }
          summaKredit={
            monitorList?.meta && monitorList?.meta.summa_to < 0 ? monitorList?.meta?.summa_to : 0
          }
        />
        <ListView.Pagination
          {...pagination}
          pageCount={monitorList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

const SummaFields = ({
  summaDebet,
  summaKredit
}: {
  summaDebet?: number
  summaKredit?: number
}) => {
  const { t } = useTranslation()
  return (
    <div className="w-full grid grid-cols-4 gap-40">
      <span className="text-sm text-slate-400 col-span-2"></span>
      <div className="flex gap-4 items-center">
        <span className="text-sm text-slate-400">{t('debet')}:</span>
        <b className="font-black text-slate-700">{formatNumber(Math.abs(summaDebet ?? 0))}</b>
      </div>
      <div className="flex gap-4 items-center">
        <span className="text-sm text-slate-400">{t('kredit')}:</span>
        <b className="font-black text-slate-700">{formatNumber(Math.abs(summaKredit ?? 0))}</b>
      </div>
    </div>
  )
}

export default PodotchetMonitoringPage
