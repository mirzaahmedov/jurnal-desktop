import { useEffect } from 'react'

import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { Button } from '@renderer/common/components/ui/button'
import { useSettingsStore } from '@renderer/common/features/app-defaults'
import { DownloadFile } from '@renderer/common/features/file'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField } from '@renderer/common/features/search/search-field'
import { useSearch } from '@renderer/common/features/search/use-search'
import { useLocationState } from '@renderer/common/hooks/use-location-state'
import { getProvodkaURL } from '@renderer/common/lib/provodka'
import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
import { ChooseSpravochnik, FooterCell, FooterRow, GenericTable } from '@/common/components'
import { ButtonGroup } from '@/common/components/ui/button-group'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/common/components/ui/dropdown-menu'
import { useLayoutStore } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useDates, usePagination, useToggle } from '@/common/hooks'
import { formatNumber } from '@/common/lib/format'
import { type OrganizationMonitor, TypeSchetOperatsii } from '@/common/models'
import { ListView } from '@/common/views'

import { AktSverkaDialog } from './akt-sverka'
import { organizationMonitorColumns } from './columns'
import { orgMonitoringQueryKeys } from './constants'
import { orgMonitoringService } from './service'

const OrganizationMonitoringPage = () => {
  const [operatsiiId, setOperatsiiId] = useLocationState<undefined | number>('operatsii_id')
  const [orgId, setOrgId] = useLocationState<undefined | number>('org_id')

  const navigate = useNavigate()
  const dates = useDates()
  const dropdownToggle = useToggle()
  const pagination = usePagination()
  const report_title_id = useSettingsStore((store) => store.report_title_id)

  const setLayout = useLayoutStore((store) => store.setLayout)

  const { main_schet_id, budjet_id } = useRequisitesStore()
  const { search } = useSearch()
  const { t } = useTranslation(['app'])

  const orgSpravochnik = useSpravochnik(
    createOrganizationSpravochnik({
      value: orgId,
      onChange: (id) => {
        pagination.onChange({
          page: 1
        })
        setOrgId(id)
      }
    })
  )
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

  const { data: organizationMonitorList, isFetching } = useQuery({
    queryKey: [
      orgMonitoringQueryKeys.getByOrgId,
      {
        main_schet_id,
        operatsii: operatsiiSpravochnik.selected ? operatsiiSpravochnik.selected.schet : undefined,
        organ_id: orgId ? orgId : undefined,
        search,
        ...dates,
        ...pagination
      }
    ],
    queryFn: orgMonitoringService.getAll,
    enabled: !!main_schet_id && !!operatsiiSpravochnik.selected
  })

  useEffect(() => {
    setLayout({
      title: t('pages.organization-monitoring'),
      content: SearchField,
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
                spravochnik={orgSpravochnik}
                placeholder="Выберите организацию"
                getName={(selected) => selected.name}
                getElements={(selected) => [
                  { name: 'ИНН:', value: selected?.inn },
                  { name: 'МФО:', value: selected?.mfo },
                  {
                    name: 'Расчетный счет:',
                    value: selected?.account_numbers.map((a) => a.raschet_schet).join(',')
                  },
                  { name: 'Банк:', value: selected?.bank_klient }
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
                    onInteractOutside={dropdownToggle.close}
                  >
                    <DropdownMenuItem>
                      <DownloadFile
                        fileName={`${t('cap')}-${dates.to}.xlsx`}
                        url="/organization/monitoring/cap"
                        params={{
                          budjet_id,
                          main_schet_id,
                          from: dates.from,
                          to: dates.to,
                          report_title_id,
                          excel: true,
                          operatsii: operatsiiSpravochnik.selected?.schet
                        }}
                        buttonText="Шапка"
                        className="w-full inline-flex items-center justify-start"
                      />
                    </DropdownMenuItem>

                    {operatsiiSpravochnik.selected?.schet ? (
                      <DropdownMenuItem>
                        <DownloadFile
                          fileName={`дебитор-кредитор_отчет-${dates.to}.xlsx`}
                          url="organization/monitoring/prixod/rasxod"
                          params={{
                            main_schet_id,
                            budjet_id,
                            to: dates.to,
                            operatsii: operatsiiSpravochnik.selected?.schet,
                            excel: true
                          }}
                          buttonText="Дебитор / Кредитор отчет"
                          className="w-full inline-flex items-center justify-start"
                        />
                      </DropdownMenuItem>
                    ) : null}

                    {operatsiiSpravochnik.selected?.schet ? (
                      <DropdownMenuItem>
                        <DownloadFile
                          fileName={`сводный-отчет-${dates.from}&${dates.to}.xlsx`}
                          url="/organization/monitoring/order"
                          params={{
                            main_schet_id,
                            organ_id: orgId ? orgId : undefined,
                            from: dates.from,
                            to: dates.to,
                            schet: operatsiiSpravochnik.selected?.schet,
                            excel: true,
                            contract: false
                          }}
                          buttonText="Сводный отчет"
                          className="w-full inline-flex items-center justify-start"
                        />
                      </DropdownMenuItem>
                    ) : null}

                    {operatsiiSpravochnik.selected?.schet ? (
                      <DropdownMenuItem>
                        <DownloadFile
                          fileName={`сводный-отчет-${dates.from}&${dates.to}.xlsx`}
                          url="/organization/monitoring/order"
                          params={{
                            main_schet_id,
                            organ_id: orgId ? orgId : undefined,
                            from: dates.from,
                            to: dates.to,
                            schet: operatsiiSpravochnik.selected?.schet,
                            excel: true,
                            contract: true
                          }}
                          buttonText="Сводный отчет (по договору)"
                          className="w-full inline-flex items-center justify-start"
                        />
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuContent>
                </DropdownMenu>
                {orgId ? (
                  <AktSverkaDialog
                    orgId={orgId}
                    schetId={main_schet_id}
                    from={dates.from}
                    to={dates.to}
                  />
                ) : null}
              </ButtonGroup>
            ) : null}
          </div>
          <ListView.RangeDatePicker {...dates} />
        </div>
        <div className="w-full sticky top-0 mt-5">
          <SummaFields
            summaDebet={organizationMonitorList?.meta?.summa_from_object.prixod_sum}
            summaKredit={organizationMonitorList?.meta?.summa_from_object?.rasxod_sum}
            summaItogo={organizationMonitorList?.meta?.summa_from_object?.summa}
          />
        </div>
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <GenericTable
          columnDefs={organizationMonitorColumns}
          data={organizationMonitorList?.data ?? []}
          onEdit={handleClickEdit}
          getRowKey={(row) => {
            return `${row.id}-${row.type}`
          }}
          footer={
            <FooterRow>
              <FooterCell
                colSpan={6}
                title={t('total')}
                content={formatNumber(organizationMonitorList?.meta?.page_prixod_sum ?? 0)}
              />
              <FooterCell
                content={formatNumber(organizationMonitorList?.meta?.page_rasxod_sum ?? 0)}
              />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <SummaFields
          summaDebet={organizationMonitorList?.meta?.summa_to_object.prixod_sum}
          summaKredit={organizationMonitorList?.meta?.summa_to_object?.rasxod_sum}
          summaItogo={organizationMonitorList?.meta?.summa_to_object?.summa}
        />
        <div className="mt-5">
          <ListView.Pagination
            {...pagination}
            pageCount={organizationMonitorList?.meta?.pageCount ?? 0}
          />
        </div>
      </ListView.Footer>
    </ListView>
  )
}

const SummaFields = ({
  summaDebet,
  summaKredit,
  summaItogo
}: {
  summaDebet?: number
  summaKredit?: number
  summaItogo?: number
}) => {
  const { t } = useTranslation()
  return (
    <div className="w-full grid grid-cols-5 gap-40">
      <span className="text-sm text-slate-400 col-span-2"></span>
      <div className="flex gap-2 items-center">
        <span className="text-sm text-slate-400">{t('debet')}:</span>
        <b className="text-sm font-black text-slate-700">
          {formatNumber(Math.abs(summaDebet ?? 0))}
        </b>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-sm text-slate-400">{t('kredit')}:</span>
        <b className="text-sm font-black text-slate-700">
          {formatNumber(Math.abs(summaKredit ?? 0))}
        </b>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-sm text-slate-400">{t('total')}:</span>
        <b className="text-sm font-black text-slate-700">{formatNumber(summaItogo ?? 0)}</b>
      </div>
    </div>
  )
}

export default OrganizationMonitoringPage
