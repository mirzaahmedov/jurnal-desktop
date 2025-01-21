import {
  type OrganizationMonitor,
  type OrganizationMonitorProvodka,
  TypeSchetOperatsii
} from '@/common/models'

import { useNavigate } from 'react-router-dom'
import { useLayout } from '@/common/features/layout'
import { useSpravochnik } from '@/common/features/spravochnik'
import { useQuery } from '@tanstack/react-query'
import { orgMonitoringService } from './service'
import { orgMonitorQueryKeys } from './constants'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { FooterCell, FooterRow, GenericTable, ChooseSpravochnik } from '@/common/components'
import { formatNumber } from '@/common/lib/format'
import { useOperatsiiId, useOrgId } from './hooks'
import { organizationMonitorColumns } from './columns'
import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'

import { AktSverkaDialog } from './akt-sverka'
import { ButtonGroup } from '@/common/components/ui/button-group'

import { ListView } from '@/common/views'
import { useRangeDate, usePagination } from '@/common/hooks'
import { DownloadFile } from '@renderer/common/features/file'

const OrganizationMonitoringPage = () => {
  const [operatsiiId, setOperatsiiId] = useOperatsiiId()
  const [orgId, setOrgId] = useOrgId()

  const dates = useRangeDate()
  const pagination = usePagination()
  const navigate = useNavigate()

  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const budjet_id = useRequisitesStore((store) => store.budjet_id)

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

  const { data: orgMonitorList, isFetching } = useQuery({
    queryKey: [
      orgMonitorQueryKeys.getByOrgId,
      {
        main_schet_id,
        operatsii: operatsiiSpravochnik.selected ? operatsiiSpravochnik.selected.schet : undefined,
        organ_id: orgId ? orgId : undefined,
        ...dates,
        ...pagination
      }
    ],
    queryFn: orgMonitoringService.getAll,
    enabled: !!main_schet_id && !!operatsiiSpravochnik.selected
  })

  useLayout({
    title: 'Об организации'
  })

  const handleClickEdit = (row: OrganizationMonitor) => {
    const path = getProvodkaPath(row)
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
                spravochnik={orgSpravochnik}
                placeholder="Выберите организацию"
                getName={(selected) => selected.name}
                getElements={(selected) => [
                  { name: 'ИНН:', value: selected?.inn },
                  { name: 'МФО:', value: selected?.mfo },
                  { name: 'Расчетный счет:', value: selected?.raschet_schet },
                  { name: 'Банк:', value: selected?.bank_klient }
                ]}
              />
            </div>
            {main_schet_id && operatsiiSpravochnik.selected?.schet ? (
              <ButtonGroup borderStyle="dashed">
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
                />
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
                />
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
                />
                <DownloadFile
                  fileName={`сводный-отчет-${dates.to}-счет&${operatsiiSpravochnik.selected?.schet}.xlsx`}
                  url="/organization/monitoring/cap"
                  params={{
                    main_schet_id,
                    from: dates.from,
                    to: dates.to,
                    operatsii: operatsiiSpravochnik.selected?.schet,
                    excel: true
                  }}
                  buttonText="Шапка"
                />
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
        <div className="sticky top-0">
          <SummaFields
            summaDebet={
              orgMonitorList?.meta?.summa_from && orgMonitorList?.meta?.summa_from > 0
                ? orgMonitorList?.meta?.summa_from
                : 0
            }
            summaKredit={
              orgMonitorList?.meta?.summa_from && orgMonitorList?.meta?.summa_from < 0
                ? orgMonitorList?.meta?.summa_from
                : 0
            }
          />
        </div>
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <GenericTable
          columnDefs={organizationMonitorColumns}
          data={orgMonitorList?.data ?? []}
          onEdit={handleClickEdit}
          getRowId={(row) => {
            return `${row.id}-${row.type}-${Math.random()}`
          }}
          footer={
            <FooterRow>
              <FooterCell
                colSpan={5}
                title="Итого"
                content={formatNumber(orgMonitorList?.meta.summa_prixod ?? 0)}
              />
              <FooterCell content={formatNumber(orgMonitorList?.meta.summa_rasxod ?? 0)} />
            </FooterRow>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <SummaFields
          summaDebet={
            orgMonitorList?.meta?.summa_to && orgMonitorList?.meta?.summa_to > 0
              ? orgMonitorList?.meta?.summa_to
              : 0
          }
          summaKredit={
            orgMonitorList?.meta?.summa_to && orgMonitorList?.meta?.summa_to < 0
              ? orgMonitorList?.meta?.summa_to
              : 0
          }
        />
        <ListView.Pagination
          {...pagination}
          pageCount={orgMonitorList?.meta.pageCount ?? 0}
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
  return (
    <div className="w-full grid grid-cols-4 gap-40">
      <span className="text-sm text-slate-400 col-span-2"></span>
      <div className="flex gap-2 items-center">
        <span className="text-sm text-slate-400">Дебет:</span>
        <b className="text-sm font-black text-slate-700">
          {formatNumber(Math.abs(summaDebet ?? 0))}
        </b>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-sm text-slate-400">Кредит:</span>
        <b className="text-sm font-black text-slate-700">
          {formatNumber(Math.abs(summaKredit ?? 0))}
        </b>
      </div>
    </div>
  )
}

const getProvodkaPath = ({ type, id }: { type: OrganizationMonitorProvodka; id: number }) => {
  switch (type) {
    case 'bank_rasxod':
      return `/bank/rasxod/${id}`
    case 'bank_prixod':
      return `/bank/prixod/${id}`
    case 'kassa_rasxod':
      return `/kassa/rasxod/${id}`
    case 'kassa_prixod':
      return `/kassa/prixod/${id}`
    case 'show_service':
      return `/organization/pokazat-uslugi/${id}`
    case 'akt':
      return `/organization/akt/${id}`

    default:
      return ''
  }
}

export default OrganizationMonitoringPage
