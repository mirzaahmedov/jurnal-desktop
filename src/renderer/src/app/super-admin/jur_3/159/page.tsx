import type { AdminOrgan159, AdminOrgan159Document } from './interfaces'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { FooterCell, FooterRow, GenericTable } from '@/common/components'
import { SummaCell } from '@/common/components/table/renderers/summa'
import { DownloadFile } from '@/common/features/file'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { formatDate, getFirstDayOfMonth, parseDate } from '@/common/lib/date'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { EndDatePicker } from '../../components/end-date-picker'
import { AdminDocumentsType, ViewDocumentsModal } from '../../components/view-documents-modal'
import { AdminOrgan159RegionColumnDefs } from './columns'
import { AdminOrgan159Service } from './service'
import { ViewModal } from './view-modal'

const AdminOrgan159Page = () => {
  const viewToggle = useToggle()
  const setLayout = useLayout()

  const [search] = useSearchFilter()
  const [docs, setDocs] = useState<AdminOrgan159Document[]>()
  const [selected, setSelected] = useState<AdminOrgan159 | null>(null)
  const [to, setTo] = useState(formatDate(new Date()))

  const from = formatDate(getFirstDayOfMonth(parseDate(to)))

  const { t } = useTranslation(['app'])

  const {
    data: regions,
    isFetching,
    refetch
  } = useQuery({
    queryKey: [AdminOrgan159Service.QueryKeys.GetAll, { to, search }],
    queryFn: AdminOrgan159Service.getAll
  })

  const handleClickRow = (row: AdminOrgan159) => {
    setSelected(row)
    viewToggle.open()
  }

  useEffect(() => {
    refetch()
  }, [refetch])
  useEffect(() => {
    setLayout({
      title: t('pages.organization'),
      content: SearchFilterDebounced,
      breadcrumbs: [
        {
          title: t('pages.admin')
        }
      ]
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Header className="flex justify-between">
        <EndDatePicker
          value={to}
          onChange={setTo}
          refetch={refetch}
        />

        <div className="flex items-center flex-wrap w-full max-w-2xl justify-end">
          <DownloadFile
            url="/admin/jur3-159/cap"
            fileName={`${t('pages.bank')}_${t('cap')}_${from}:${to}.xlsx`}
            params={{
              from: from,
              to: to,
              excel: true
            }}
            buttonText={t('cap')}
          />
          <DownloadFile
            url="/admin/jur3-159/by-schet"
            fileName={`${t('pages.organization')}_${t('summarized_report')}_${from}:${to}.xlsx`}
            params={{
              from: from,
              to: to,
              excel: true
            }}
            buttonText={t('summarized_report')}
          />

          <DownloadFile
            url="/admin/jur3-159/daily"
            fileName={`${t('pages.organization')}_${t('daily-report')}_${from}:${to}.xlsx`}
            params={{
              from: from,
              to: to,
              excel: true
            }}
            buttonText={t('daily-report')}
          />

          <DownloadFile
            url="/admin/jur3-159/by-schets"
            fileName={`${t('pages.organization')}_${t('by_schets')}_${from}:${to}.xlsx`}
            params={{
              from: from,
              to: to,
              excel: true
            }}
            buttonText={t('by_schets')}
          />

          <DownloadFile
            withFullScreenLoader
            url="/admin/jur3-159/prixod/rasxod"
            fileName={`${t('pages.organization')}_${t('prixod')}/${t('rasxod')}_${from}:${to}.xlsx`}
            params={{
              from: from,
              to: to,
              excel: true
            }}
            buttonText={`${t('prixod')}/${t('rasxod')}`}
          />

          <DownloadFile
            url="/admin/jur3-159/2169"
            fileName={`${t('pages.organization')}_2169_${from}:${to}.xlsx`}
            params={{
              from: from,
              to: to,
              excel: true
            }}
            buttonText="2169"
          />
        </div>
      </ListView.Header>
      <ListView.Content isLoading={isFetching}>
        <GenericTable
          data={regions?.data ?? []}
          columnDefs={AdminOrgan159RegionColumnDefs}
          onClickRow={handleClickRow}
          onView={(row) => setDocs(row.docs)}
          footer={
            <FooterRow className="sticky bottom-0">
              <FooterCell
                colSpan={3}
                title={t('total')}
                content={
                  <SummaCell
                    withColor
                    summa={regions?.meta?.summa_from ?? 0}
                  />
                }
              />
              <FooterCell content={formatNumber(regions?.meta?.prixod ?? 0)} />
              <FooterCell content={formatNumber(regions?.meta?.rasxod ?? 0)} />
              <FooterCell
                content={
                  <SummaCell
                    withColor
                    summa={regions?.meta?.summa_to ?? 0}
                  />
                }
              />
            </FooterRow>
          }
        />
      </ListView.Content>

      <ViewModal
        selected={selected}
        isOpen={viewToggle.isOpen}
        onOpenChange={viewToggle.setOpen}
        from={from}
        to={to}
      />
      <ViewDocumentsModal
        type={AdminDocumentsType.Organ159}
        isOpen={!!docs}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDocs(undefined)
          }
        }}
        docs={docs ?? []}
      />
    </ListView>
  )
}

export default AdminOrgan159Page
