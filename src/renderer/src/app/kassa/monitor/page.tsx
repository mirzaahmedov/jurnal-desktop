import { useEffect } from 'react'

import { useSettingsStore } from '@renderer/common/features/app-defaults'
import { DownloadFile } from '@renderer/common/features/file'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField } from '@renderer/common/features/search/search-field'
import { useSearch } from '@renderer/common/features/search/use-search'
import { useSidebarStore } from '@renderer/common/layout/sidebar'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { FooterCell, FooterRow, GenericTable } from '@/common/components'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { useLayoutStore } from '@/common/features/layout'
import { useDates, usePagination } from '@/common/hooks'
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
  const setCollapsed = useSidebarStore((store) => store.setCollapsed)

  const { t } = useTranslation(['app'])
  const { search } = useSearch()
  const { main_schet_id, budjet_id } = useRequisitesStore()

  const { data: monitorList, isFetching } = useQuery({
    queryKey: [
      kassaMonitorQueryKeys.getAll,
      {
        main_schet_id,
        search,
        ...dates,
        ...pagination
      }
    ],
    queryFn: kassaMonitorService.getAll
  })

  useEffect(() => {
    setCollapsed(true)
    setLayout({
      title: t('pages.monitoring'),
      breadcrumbs: [
        {
          title: t('pages.kassa')
        }
      ],
      content: SearchField
    })
  }, [setLayout, setCollapsed, t])

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
        <div className="w-full pt-5 flex items-center gap-5">
          <span className="text-sm text-slate-400">{t('remainder-from')}</span>
          <b className="font-black text-slate-700">
            {formatNumber(monitorList?.meta?.summa_from ?? 0)}
          </b>
        </div>
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
          <span className="text-sm text-slate-400">{t('remainder-to')}</span>
          <b className="font-black text-slate-700">
            {formatNumber(monitorList?.meta?.summa_to ?? 0)}
          </b>
        </div>
        <ListView.Pagination
          {...pagination}
          pageCount={monitorList?.meta?.pageCount ?? 0}
        />
      </ListView.Footer>
    </ListView>
  )
}

export default KassaMonitorPage
