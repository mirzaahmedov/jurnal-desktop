import { useQuery } from '@tanstack/react-query'
import { podotchetMonitoringQueryKeys } from './constants'
import { getPodotchetMonitoringByIdQuery, podotchetMonitoringService } from './service'
import {
  GenericTable,
  LoadingOverlay,
  usePagination,
  DateRangeForm,
  ChoosePodotchet,
  ChooseOperatsii,
  Pagination,
  FooterRow,
  FooterCell,
  DownloadDocumentButton
} from '@/common/components'
import { podotchetMonitoringColumns } from './columns'
import { useSpravochnik } from '@/common/features/spravochnik'
import { createPodotchetSpravochnik } from '@/app/region-spravochnik/podotchet'
import { parseAsInteger, useQueryState } from 'nuqs'
import { useDateRange } from '@/common/hooks/use-date-range'
import { useMainSchet } from '@/common/features/main-schet'
import { useLayout } from '@/common/features/layout'
import { formatNumber } from '@/common/lib/format'
import { createOperatsiiSpravochnik } from '@/app/super-admin/operatsii'
import { TypeSchetOperatsii } from '@/common/models'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { ScrollArea } from '@/common/components/ui/scroll-area'

const PodotchetMonitoringPage = () => {
  const [podotchetId, setPodotchetId] = useQueryState('podotchet_id', parseAsInteger.withDefault(0))
  const [operatsii, setOperatsii] = useQueryState('operatsii', parseAsInteger.withDefault(0))

  const { currentPage, itemsPerPage } = usePagination()
  const { main_schet } = useMainSchet()
  const { from, to, form, applyFilters } = useDateRange()

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
      onChange: (id) => setOperatsii(id),
      params: {
        type_schet: TypeSchetOperatsii.GENERAL
      }
    })
  )

  const { data: monitorList, isFetching } = useQuery({
    queryFn: podotchetId ? getPodotchetMonitoringByIdQuery : podotchetMonitoringService.getAll,
    queryKey: [
      podotchetMonitoringQueryKeys.getAll,
      {
        main_schet_id: main_schet?.id,
        from,
        to,
        page: currentPage,
        limit: itemsPerPage,
        podotchet: podotchetId ? podotchetId : undefined,
        operatsii: operatsiiSpravochnik.selected?.schet
          ? operatsiiSpravochnik.selected?.schet
          : undefined
      },
      podotchetId
    ],
    enabled: !!main_schet?.id && !!operatsiiSpravochnik.selected
  })

  useLayout({
    title: 'О подотчетном лице'
  })

  return (
    <>
      <div className="bg-white">
        <div className="p-5 space-y-5 flex flex-col items-start">
          <div className="w-full flex flex-row gap-10 items-center justify-between">
            <div className="flex-1 flex flex-row gap-5 items-center">
              <ChooseOperatsii
                selected={operatsiiSpravochnik.selected}
                open={operatsiiSpravochnik.open}
                clear={operatsiiSpravochnik.clear}
              />
              <ChoosePodotchet
                selected={podotchetSpravochnik.selected}
                open={podotchetSpravochnik.open}
                clear={podotchetSpravochnik.clear}
              />
            </div>

            <ButtonGroup borderStyle="dashed">
              <DownloadDocumentButton
                fileName={`дебитор-кредитор_отчет-${to}.xlsx`}
                url="podotchet/monitoring/prixod/rasxod/"
                params={{
                  budjet_id: main_schet?.budget_id,
                  to
                }}
                buttonText="Дебитор / Кредитор отчет"
              />
              {podotchetId ? (
                <DownloadDocumentButton
                  fileName={`лицевой-счет_${podotchetSpravochnik.selected?.name}:${from}:${to}.xlsx`}
                  url={`podotchet/monitoring/export/${podotchetId}`}
                  params={{
                    operatsii: operatsiiSpravochnik.selected?.schet,
                    main_schet_id: main_schet?.id,
                    from,
                    to
                  }}
                  buttonText="Лицевой счет"
                />
              ) : null}
            </ButtonGroup>
          </div>
          <DateRangeForm
            form={form}
            onSubmit={applyFilters}
          />
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
          columns={podotchetMonitoringColumns}
          data={monitorList?.data ?? []}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title="Итого"
                  colSpan={4}
                  content={formatNumber(monitorList?.meta?.summa_prixod ?? 0)}
                />
                <FooterCell content={formatNumber(monitorList?.meta?.summa_rasxod ?? 0)} />
              </FooterRow>
            </>
          }
        />
      </ScrollArea>
      <div className="p-5 flex flex-col gap-5">
        <SummaFields
          summaDebet={
            monitorList?.meta && monitorList?.meta.summa_to > 0 ? monitorList?.meta?.summa_to : 0
          }
          summaKredit={
            monitorList?.meta && monitorList?.meta.summa_to < 0 ? monitorList?.meta?.summa_to : 0
          }
        />
        <Pagination pageCount={monitorList?.meta.pageCount ?? 0} />
      </div>
    </>
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
      <div className="flex gap-4 items-center">
        <span className="text-sm text-slate-400">Дебет:</span>
        <b className="font-black text-slate-700">{formatNumber(Math.abs(summaDebet ?? 0))}</b>
      </div>
      <div className="flex gap-4 items-center">
        <span className="text-sm text-slate-400">Кредит:</span>
        <b className="font-black text-slate-700">{formatNumber(Math.abs(summaKredit ?? 0))}</b>
      </div>
    </div>
  )
}

export default PodotchetMonitoringPage
