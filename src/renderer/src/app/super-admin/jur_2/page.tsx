import type { AdminBank, AdminBankDocument } from './interfaces'

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
import { useSettingsStore } from '@/common/features/settings'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { formatDate, getFirstDayOfMonth, parseDate } from '@/common/lib/date'
import { formatNumber } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { EndDatePicker } from '../components/end-date-picker'
import { AdminDocumentsType, ViewDocumentsModal } from '../components/view-documents-modal'
import { AdminBankRegionColumnDefs } from './columns'
import { AdminBankService } from './service'
import { ViewModal } from './view-modal'

const AdminBankPage = () => {
  const viewToggle = useToggle()
  const setLayout = useLayout()
  const defaultDate = useSettingsStore((state) => state.default_end_date)

  const [search] = useSearchFilter()
  const [docs, setDocs] = useState<AdminBankDocument[]>()
  const [selected, setSelected] = useState<AdminBank | null>(null)
  const [to, setTo] = useState(defaultDate)

  const { t } = useTranslation(['app'])

  const from = formatDate(getFirstDayOfMonth(parseDate(to)))

  const {
    data: regions,
    isFetching,
    refetch
  } = useQuery({
    queryKey: [AdminBankService.QueryKeys.GetAll, { to, search }],
    queryFn: AdminBankService.getAll
  })

  const handleClickRow = (row: AdminBank) => {
    setSelected(row)
    viewToggle.open()
  }

  useEffect(() => {
    refetch()
  }, [refetch])
  useEffect(() => {
    setLayout({
      title: t('pages.bank'),
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
      <ListView.Header className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2">
        <EndDatePicker
          value={to}
          onChange={setTo}
          refetch={refetch}
        />
        <div className="flex flex-wrap gap-2.5">
          <DownloadFile
            url="/admin/jur2/cap?"
            fileName={`${t('pages.bank')}_${t('cap')}_${from}:${to}.xlsx`}
            params={{
              from: from,
              to: to,
              excel: true
            }}
            buttonText={t('cap')}
          />
          <DownloadFile
            url="/admin/jur2/by-schet"
            fileName={`${t('pages.bank')}_${t('summarized_report')}_${from}:${to}.xlsx`}
            params={{
              from: from,
              to: to,
              excel: true
            }}
            buttonText={t('summarized_report')}
          />
          <DownloadFile
            url="/admin/jur2/daily"
            fileName={`${t('pages.bank')}_${t('daily-report')}_${from}:${to}.xlsx`}
            params={{
              from: from,
              to: to,
              excel: true
            }}
            buttonText={t('daily-report')}
          />
          <DownloadFile
            url="/admin/jur2/by-contract"
            fileName={`${t('pages.bank')}_${t('by_contract')}_${from}:${to}.xlsx`}
            params={{
              from: from,
              to: to,
              excel: true
            }}
            buttonText={t('by_contract')}
          />
          <DownloadFile
            url="/admin/jur2/by-smeta"
            fileName={`${t('pages.bank')}_${t('by_smeta')}_${from}:${to}.xlsx`}
            params={{
              from: from,
              to: to,
              excel: true
            }}
            buttonText={t('by_smeta')}
          />
          <DownloadFile
            url="/admin/jur2/by-schet"
            fileName={`${t('pages.bank')}_${t('cap_prixod_rasxod')}_${from}:${to}.xlsx`}
            params={{
              from: from,
              to: to,
              excel: true
            }}
            buttonText={t('cap_prixod_rasxod')}
          />
          <DownloadFile
            url="/admin/jur2/2169"
            fileName={`${t('pages.bank')}_${t('2169')}_${from}:${to}.xlsx`}
            params={{
              from: from,
              to: to,
              excel: true
            }}
            buttonText={t('2169')}
          />
        </div>
      </ListView.Header>
      <ListView.Content isLoading={isFetching}>
        <GenericTable
          data={regions?.data ?? []}
          columnDefs={AdminBankRegionColumnDefs}
          onClickRow={handleClickRow}
          onView={(row) => {
            setDocs(row.docs)
          }}
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
        type={AdminDocumentsType.Bank}
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

export default AdminBankPage
