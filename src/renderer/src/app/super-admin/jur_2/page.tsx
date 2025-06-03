import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useEffect, useState } from 'react'

import type { AdminBank } from './interfaces'
import { AdminBankRegionColumnDefs } from './columns'
import { AdminBankService } from './service'
import { EndDatePicker } from '../components/range-date-picker'
import { GenericTable } from '@/common/components'
import { ListView } from '@/common/views'
import { ViewModal } from './view-modal'
import { useLayout } from '@/common/layout'
import { useQuery } from '@tanstack/react-query'
import { useSettingsStore } from '@/common/features/settings'
import { useToggle } from '@/common/hooks/use-toggle'
import { useTranslation } from 'react-i18next'

export const AdminBankPage = () => {
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
      <ListView.Content loading={isFetching}>
        <GenericTable
          data={regions?.data ?? []}
          columnDefs={AdminBankRegionColumnDefs}
          onClickRow={handleClickRow}
        />
      </ListView.Content>

      <ViewModal
        selected={selected}
        isOpen={viewToggle.isOpen}
        onOpenChange={viewToggle.setOpen}
      />
    </ListView>
  )
}
