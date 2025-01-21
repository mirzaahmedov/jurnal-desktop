import { FooterCell, FooterRow, GenericTable } from '@/common/components'
import { usePagination, useRangeDate } from '@/common/hooks'

import { ButtonGroup } from '@/common/components/ui/button-group'
import { DownloadFile } from '@renderer/common/features/file'
import { ListView } from '@/common/views'
import { columns } from './columns'
import { formatNumber } from '@/common/lib/format'
import { kassaMonitorQueryKeys } from './constants'
import { kassaMonitorService } from './service'
import { useLayout } from '@/common/features/layout'
import { useQuery } from '@tanstack/react-query'
import { useRequisitesStore } from '@renderer/common/features/requisites'

const KassaMonitorPage = () => {
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const pagination = usePagination()
  const dates = useRangeDate()

  const { data: monitorList, isFetching } = useQuery({
    queryKey: [
      kassaMonitorQueryKeys.getAll,
      {
        main_schet_id,
        ...dates,
        ...pagination
      }
    ],
    queryFn: kassaMonitorService.getAll
  })

  useLayout({
    title: 'Мониторинг'
  })

  return (
    <ListView>
      <ListView.Header>
        <div className="flex items-center justify-between">
          <ListView.RangeDatePicker {...dates} />
          {main_schet_id ? (
            <ButtonGroup borderStyle="dashed">
              <DownloadFile
                fileName={`касса-дневной-отчет_${dates.from}&${dates.to}.xlsx`}
                url="kassa/monitoring/daily"
                buttonText="Дневной отчет"
                params={{
                  main_schet_id,
                  from: dates.from,
                  to: dates.to
                }}
              />
              <DownloadFile
                fileName={`касса-шапка-отчет_${dates.from}&${dates.to}.xlsx`}
                url="kassa/monitoring/cap"
                buttonText="Шапка отчет"
                params={{
                  main_schet_id,
                  from: dates.from,
                  to: dates.to
                }}
              />
            </ButtonGroup>
          ) : null}
        </div>
        <div className="pt-5 flex items-center gap-5">
          <span className="text-sm text-slate-400">Остаток на начало период:</span>
          <b className="font-black text-slate-700">
            {formatNumber(monitorList?.meta?.summa_from ?? 0)}
          </b>
        </div>
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <GenericTable
          data={monitorList?.data ?? []}
          columnDefs={columns}
          getRowId={(row) => `${row.id}-${row.rasxod_sum ? 'rasxod' : 'prixod'}`}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title="Итого"
                  colSpan={3}
                />
                <FooterCell
                  content={formatNumber(monitorList?.meta?.prixod_sum ?? 0)}
                  colSpan={1}
                />
                <FooterCell
                  content={formatNumber(monitorList?.meta?.rasxod_sum ?? 0)}
                  colSpan={1}
                />
              </FooterRow>
            </>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <div className="pb-5 flex items-center gap-5">
          <span className="text-sm text-slate-400">Остаток на конец период:</span>
          <b className="font-black text-slate-700">
            {formatNumber(monitorList?.meta?.summa_to ?? 0)}
          </b>
        </div>
        <ListView.Pagination
          {...pagination}
          pageCount={monitorList?.meta.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default KassaMonitorPage
