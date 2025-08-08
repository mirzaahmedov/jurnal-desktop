import type { AdminBank } from './interfaces'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { FooterCell, FooterRow, GenericTable } from '@/common/components'
import { SummaCell } from '@/common/components/table/renderers/summa'
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
import { AdminBankRegionColumnDefs } from './columns'
import { AdminBankService } from './service'
import { ViewModal } from './view-modal'

const AdminBankPage = () => {
  const viewToggle = useToggle()
  const setLayout = useLayout()
  const defaultDate = useSettingsStore((state) => state.default_end_date)

  const [search] = useSearchFilter()
  const [selected, setSelected] = useState<AdminBank | null>(null)
  const [to, setTo] = useState(defaultDate)

  const { t } = useTranslation(['app'])

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
      <ListView.Header>
        <EndDatePicker
          value={to}
          onChange={setTo}
          refetch={refetch}
        />
      </ListView.Header>
      <ListView.Content isLoading={isFetching}>
        <GenericTable
          data={regions?.data ?? []}
          columnDefs={AdminBankRegionColumnDefs}
          onClickRow={handleClickRow}
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
        from={formatDate(getFirstDayOfMonth(parseDate(to)))}
        to={to}
      />
    </ListView>
  )
}

export default AdminBankPage
