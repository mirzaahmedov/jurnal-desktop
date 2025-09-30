import type { AdminMaterial, AdminMaterialDocument } from './interfaces'

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

import { EndDatePicker } from '../components/end-date-picker'
import { AdminDocumentsType, ViewDocumentsModal } from '../components/view-documents-modal'
import { AdminMaterialRegionColumnDefs } from './columns'
import { AdminMaterialService } from './service'
import { ViewModal } from './view-modal'

const AdminMaterialPage = () => {
  const viewToggle = useToggle()
  const setLayout = useLayout()

  const [search] = useSearchFilter()
  const [docs, setDocs] = useState<AdminMaterialDocument[]>()
  const [selected, setSelected] = useState<AdminMaterial | null>(null)
  const [to, setTo] = useState(formatDate(new Date()))

  const from = formatDate(getFirstDayOfMonth(parseDate(to)))

  const { t } = useTranslation(['app'])

  const {
    data: regions,
    isFetching,
    refetch
  } = useQuery({
    queryKey: [AdminMaterialService.QueryKeys.GetAll, { to, search }],
    queryFn: AdminMaterialService.getAll
  })

  const handleClickRow = (row: AdminMaterial) => {
    setSelected(row)
    viewToggle.open()
  }

  useEffect(() => {
    setLayout({
      title: t('pages.material-warehouse'),
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
          url="/admin/jur7/by-schets-regions"
          params={{
            from: from,
            to: to,
            excel: true
          }}
          fileName={`${t('pages.material-warehouse')}_${t('summarized_report')}_${from}_${to}.xlsx`}
          buttonText={t('summarized_report')}
        />
      </ListView.Header>
      <ListView.Content isLoading={isFetching}>
        <GenericTable
          data={regions?.data ?? []}
          columnDefs={AdminMaterialRegionColumnDefs}
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
        type={AdminDocumentsType.Material}
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

export default AdminMaterialPage
