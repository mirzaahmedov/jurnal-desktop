import { useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { FooterCell, FooterRow, GenericTable, SummaTotal, useTableSort } from '@/common/components'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { DownloadFile } from '@/common/features/file'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useRequisitesStore } from '@/common/features/requisites'
import { useSettingsStore } from '@/common/features/settings'
import { useDates, usePagination } from '@/common/hooks'
import { useLayoutStore } from '@/common/layout/store'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { columns } from './columns'
import { kassaMonitorQueryKeys } from './constants'
import { kassaMonitorService } from './service'

const KassaMonitorPage = () => {
  const dates = useDates()
  const pagination = usePagination()
  const report_title_id = useSettingsStore((store) => store.report_title_id)

  const setLayout = useLayoutStore((store) => store.setLayout)

  const [search] = useSearchFilter()

  const { t } = useTranslation(['app'])
  const { sorting, handleSort, getColumnSorted } = useTableSort()
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const { data: monitorList, isFetching } = useQuery({
    queryKey: [
      kassaMonitorQueryKeys.getAll,
      {
        main_schet_id,
        search,
        ...sorting,
        ...dates,
        ...pagination
      }
    ],
    queryFn: kassaMonitorService.getAll
  })

  useEffect(() => {
    setLayout({
      title: t('pages.monitoring'),
      breadcrumbs: [
        {
          title: t('pages.kassa')
        }
      ],
      content: SearchFilterDebounced
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Header>
        <div className="w-full flex items-center justify-between">
          <ListView.RangeDatePicker {...dates} />
          {main_schet_id ? (
            <ButtonGroup borderStyle="dashed">
              <DownloadFile
                fileName={`касса-дневной-отчет_${dates.from}&${dates.to}.xlsx`}
                url="kassa/monitoring/daily"
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
                fileName={`касса-шапка-отчет_${dates.from}&${dates.to}.xlsx`}
                url="kassa/monitoring/cap"
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
        <SummaTotal className="pt-5">
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
          getColumnSorted={getColumnSorted}
          onSort={handleSort}
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

export default KassaMonitorPage
