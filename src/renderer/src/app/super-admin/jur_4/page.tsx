import type { AdminPodotchet, AdminPodotchetDocument } from './interfaces'

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
import { AdminPodotchetRegionColumnDefs } from './columns'
import { AdminPodotchetService } from './service'
import { ViewModal } from './view-modal'

const AdminPodotchetPage = () => {
  const viewToggle = useToggle()
  const setLayout = useLayout()
  const defaultDate = useSettingsStore((state) => state.default_end_date)

  const [search] = useSearchFilter()
  const [docs, setDocs] = useState<AdminPodotchetDocument[]>()
  const [selected, setSelected] = useState<AdminPodotchet | null>(null)
  const [to, setTo] = useState(defaultDate)

  const from = formatDate(getFirstDayOfMonth(parseDate(to)))

  const { t } = useTranslation(['app'])

  const {
    data: regions,
    isFetching,
    refetch
  } = useQuery({
    queryKey: [AdminPodotchetService.QueryKeys.GetAll, { to, search }],
    queryFn: AdminPodotchetService.getAll
  })

  const handleClickRow = (row: AdminPodotchet) => {
    setSelected(row)
    viewToggle.open()
  }

  useEffect(() => {
    refetch()
  }, [refetch])
  useEffect(() => {
    setLayout({
      title: t('pages.podotchet'),
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

        <DownloadFile
          url="/admin/jur3-159/cap?"
          fileName={`${t('pages.bank')}_${t('cap')}_${from}:${to}.xlsx`}
          params={{
            from: from,
            to: to,
            excel: true
          }}
          buttonText={t('cap')}
        />
      </ListView.Header>
      <ListView.Content isLoading={isFetching}>
        <GenericTable
          data={regions?.data ?? []}
          columnDefs={AdminPodotchetRegionColumnDefs}
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
        type={AdminDocumentsType.Podotchet}
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

export default AdminPodotchetPage
