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
import { useMainSchet } from '@/common/features/main-schet'
import {
  ChooseOrganization,
  ChooseOperatsii,
  FooterCell,
  FooterRow,
  GenericTable,
  DownloadDocumentButton
} from '@/common/components'
import { formatNumber } from '@/common/lib/format'
import { useOperatsiiId, useOrgId } from './hooks'
import { orgMonitorColumns } from './columns'
import { createOrganizationSpravochnik } from '@renderer/app/region-spravochnik/organization'
import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'

import { AktSverkaDialog } from './akt-sverka'
import { ButtonGroup } from '@/common/components/ui/button-group'

import { ListView } from '@/common/views'
import { useRangeDate, usePagination } from '@/common/hooks'

const OrganizationMonitoringPage = () => {
  const [operatsiiId, setOperatsiiId] = useOperatsiiId()
  const [orgId, setOrgId] = useOrgId()

  const dates = useRangeDate()
  const pagination = usePagination()
  const navigate = useNavigate()

  const { main_schet } = useMainSchet()

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
        main_schet_id: main_schet?.id,
        operatsii: operatsiiSpravochnik.selected ? operatsiiSpravochnik.selected.schet : undefined,
        ...dates,
        ...pagination
      },
      orgId
    ],
    queryFn: orgMonitoringService.getAll,
    enabled: !!main_schet && !!operatsiiSpravochnik.selected
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
              <ChooseOperatsii
                selected={operatsiiSpravochnik.selected}
                open={operatsiiSpravochnik.open}
                clear={operatsiiSpravochnik.clear}
              />
              <ChooseOrganization
                selected={orgSpravochnik.selected}
                open={orgSpravochnik.open}
                clear={orgSpravochnik.clear}
              />
            </div>
            {main_schet?.id && operatsiiSpravochnik.selected?.schet ? (
              <ButtonGroup borderStyle="dashed">
                <DownloadDocumentButton
                  fileName={`дебитор-кредитор_отчет-${dates.to}.xlsx`}
                  url="organization/monitoring/prixod/rasxod"
                  params={{
                    main_schet_id: main_schet?.id,
                    to: dates.to,
                    operatsii: operatsiiSpravochnik.selected?.schet
                  }}
                  buttonText="Дебитор / Кредитор отчет"
                />
                <DownloadDocumentButton
                  fileName={`сводный-отчет-${dates.from}:${dates.to}.xlsx`}
                  url="/organization/monitoring/order"
                  params={{
                    main_schet_id: main_schet?.id,
                    from: dates.from,
                    to: dates.to,
                    schet: operatsiiSpravochnik.selected?.schet
                  }}
                  buttonText="Сводный отчет"
                />
                {orgId ? (
                  <AktSverkaDialog
                    orgId={orgId}
                    schetId={main_schet?.id}
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
          columns={orgMonitorColumns}
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
