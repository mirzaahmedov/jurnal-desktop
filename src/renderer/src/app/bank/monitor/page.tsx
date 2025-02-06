import { useEffect } from 'react'

import { DownloadFile } from '@renderer/common/features/file'
import { useRequisitesStore } from '@renderer/common/features/requisites'
import { SearchField, useSearch } from '@renderer/common/features/search'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { FooterCell, FooterRow, GenericTable } from '@/common/components'
import { ButtonGroup } from '@/common/components/ui/button-group'
import { useLayoutStore } from '@/common/features/layout'
import { useDates, usePagination } from '@/common/hooks'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { columns } from './columns'
import { bankMonitorQueryKeys } from './constants'
import { bankMonitorService } from './service'

const BankMonitorPage = () => {
  const main_schet_id = useRequisitesStore((store) => store.main_schet_id)
  const setLayout = useLayoutStore((store) => store.setLayout)

  const dates = useDates()
  const pagination = usePagination()

  const { search } = useSearch()
  const { t } = useTranslation(['app'])

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
      <ListView.Header>
        <ListView.RangeDatePicker {...dates} />
        <div className="flex flex-row items-center justify-between">
          <div className="pt-5 flex items-center gap-5">
            <span className="text-sm text-slate-400">{t('remainder-from')}</span>
            <b className="font-black text-slate-700">
              {formatNumber(monitorList?.meta?.summa_from ?? 0)}
            </b>
          </div>

          {main_schet_id ? (
            <ButtonGroup borderStyle="dashed">
              <DownloadFile
                fileName={`банк-дневной-отчет_${dates.from}&${dates.to}.xlsx`}
                url="bank/monitoring/daily"
                buttonText={t('daily-report')}
                params={{
                  main_schet_id,
                  from: dates.from,
                  to: dates.to
                }}
              />
              <DownloadFile
                fileName={`банк-шапка-отчет_${dates.from}&${dates.to}.xlsx`}
                url="bank/monitoring/cap"
                buttonText={t('cap-report')}
                params={{
                  main_schet_id,
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
          columnDefs={columns}
          getRowId={(row) => `${row.id}-${row.rasxod_sum ? 'rasxod' : 'prixod'}`}
          footer={
            <>
              <FooterRow>
                <FooterCell
                  title={t('total')}
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
          <span className="text-sm text-slate-400">{t('remainder-to')}</span>
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

export default BankMonitorPage
