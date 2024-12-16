import { useQuery } from '@tanstack/react-query'
import { useLayout } from '@/common/features/layout'
import { useMainSchet } from '@/common/features/main-schet'
import { bankMonitorService } from './service'
import { GenericTable, FooterRow, FooterCell, DownloadDocumentButton } from '@/common/components'
import { columns } from './columns'
import { formatNumber } from '@/common/lib/format'
import { bankMonitorQueryKeys } from './constants'
import { ButtonGroup } from '@/common/components/ui/button-group'

import { ListView } from '@/common/views'
import { usePagination, useRangeDate } from '@/common/hooks'

const BankMonitorPage = () => {
  const { main_schet } = useMainSchet()

  const dates = useRangeDate()
  const pagination = usePagination()

  const { data: monitorList, isFetching } = useQuery({
    queryKey: [
      bankMonitorQueryKeys.getAll,
      {
        main_schet_id: main_schet?.id,
        ...dates,
        ...pagination
      }
    ],
    queryFn: bankMonitorService.getAll
  })

  useLayout({
    title: 'Банк мониторинг'
  })

  return (
    <ListView>
      <ListView.Header>
        <ListView.RangeDatePicker {...dates} />
        <div className="flex flex-row items-center justify-between">
          <div className="pt-5 flex items-center gap-5">
            <span className="text-sm text-slate-400">Остаток на начало период:</span>
            <b className="font-black text-slate-700">
              {formatNumber(monitorList?.meta?.summa_from ?? 0)}
            </b>
          </div>

          {main_schet ? (
            <ButtonGroup borderStyle="dashed">
              <DownloadDocumentButton
                fileName={`банк-дневной-отчет_${dates.from}:${dates.to}.xlsx`}
                url="bank/monitoring/daily"
                buttonText="Дневной отчет"
                params={{
                  main_schet_id: main_schet?.id,
                  from: dates.from,
                  to: dates.to
                }}
              />
              <DownloadDocumentButton
                fileName={`банк-шапка-отчет_${dates.from}:${dates.to}.xlsx`}
                url="bank/monitoring/cap"
                buttonText="Шапка отчет"
                params={{
                  main_schet_id: main_schet?.id,
                  from: dates.from,
                  to: dates.to
                }}
              />
            </ButtonGroup>
          ) : null}
        </div>
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <GenericTable
          data={monitorList?.data ?? []}
          columns={columns}
          getRowId={(row) => `${row.id}-${row.rasxod_sum ? 'rasxod' : 'prixod'}`}
          footer={
            <>
              <FooterRow>
                <FooterCell title="Итого" colSpan={3} />
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
        <ListView.Pagination {...pagination} pageCount={monitorList?.meta.pageCount ?? 0} />
      </ListView.Footer>
    </ListView>
  )
}

export default BankMonitorPage
