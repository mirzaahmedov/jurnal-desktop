import { useEffect } from 'react'

import { useSettingsStore } from '@renderer/common/features/app-defaults'
import { DownloadFile } from '@renderer/common/features/file'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField } from '@renderer/common/features/search/search-field'
import { useSearch } from '@renderer/common/features/search/use-search'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { FooterCell, FooterRow, GenericTable, SummaTotal } from '@/common/components'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { useLayoutStore } from '@/common/features/layout'
import { useDates, usePagination } from '@/common/hooks'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { columns } from './columns'
import { bankMonitorQueryKeys } from './constants'
import { bankMonitorService } from './service'

const BankMonitorPage = () => {
  const setLayout = useLayoutStore((store) => store.setLayout)

  const report_title_id = useSettingsStore((store) => store.report_title_id)
  const dates = useDates()
  const pagination = usePagination()

  const { search } = useSearch()
  const { t } = useTranslation(['app'])
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const { data: monitorList, isFetching } = useQuery({
    queryKey: [
      bankMonitorQueryKeys.getAll,
      {
        main_schet_id,
        search,
        ...dates,
        ...pagination
      }
    ],
    queryFn: bankMonitorService.getAll,
    enabled: !!main_schet_id
  })

  useEffect(() => {
    setLayout({
      title: t('pages.monitoring'),
      content: SearchField,
      breadcrumbs: [
        {
          title: t('pages.bank')
        }
      ]
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Header className="space-y-4">
        <div className="w-full flex items-center justify-between">
          <ListView.RangeDatePicker {...dates} />
          {main_schet_id && report_title_id ? (
            <ButtonGroup borderStyle="dashed">
              <DownloadFile
                fileName={`банк-дневной-отчет_${dates.from}&${dates.to}.xlsx`}
                url="bank/monitoring/daily"
                buttonText={t('daily-report')}
                params={{
                  main_schet_id,
                  budjet_id,
                  report_title_id,
                  from: dates.from,
                  to: dates.to,
                  excel: true
                }}
              />
              <DownloadFile
                fileName={`банк-шапка-отчет_${dates.from}&${dates.to}.xlsx`}
                url="bank/monitoring/cap"
                buttonText={t('cap-report')}
                params={{
                  main_schet_id,
                  budjet_id,
                  report_title_id,
                  from: dates.from,
                  to: dates.to,
                  excel: true
                }}
              />
            </ButtonGroup>
          ) : null}
        </div>
        <SummaTotal>
          <SummaTotal.Value
            name={t('remainder-from')}
            value={formatNumber(monitorList?.meta?.summa_from_object?.summa ?? 0)}
          />
          <SummaTotal.Value
            name={t('debet')}
            value={formatNumber(monitorList?.meta?.summa_from_object?.prixod_summa ?? 0)}
          />
          <SummaTotal.Value
            name={t('kredit')}
            value={formatNumber(monitorList?.meta?.summa_from_object?.rasxod_summa ?? 0)}
          />
        </SummaTotal>
      </ListView.Header>
      <ListView.Content loading={isFetching}>
        <GenericTable
          data={monitorList?.data ?? []}
          columnDefs={columns}
          getRowKey={(row) => `${row.id}-${row.rasxod_sum ? 'rasxod' : 'prixod'}`}
          getRowId={(row) => row.id}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title={t('total')}
                  colSpan={4}
                />
                <FooterCell
                  content={formatNumber(monitorList?.meta?.page_prixod_sum ?? 0)}
                  colSpan={1}
                />
                <FooterCell
                  content={formatNumber(monitorList?.meta?.page_rasxod_sum ?? 0)}
                  colSpan={1}
                />
              </FooterRow>
            </>
          }
        />
      </ListView.Content>
      <ListView.Footer>
        <SummaTotal className="pb-5">
          <SummaTotal.Value
            name={t('remainder-to')}
            value={formatNumber(monitorList?.meta?.summa_to_object?.summa ?? 0)}
          />
          <SummaTotal.Value
            name={t('debet')}
            value={formatNumber(monitorList?.meta?.summa_to_object?.prixod_summa ?? 0)}
          />
          <SummaTotal.Value
            name={t('kredit')}
            value={formatNumber(monitorList?.meta?.summa_to_object?.rasxod_summa ?? 0)}
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

export default BankMonitorPage
