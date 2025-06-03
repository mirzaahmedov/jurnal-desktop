import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useEffect, useState } from 'react'

import type { AdminOrgan152 } from './interfaces'
import { AdminOrgan152RegionColumnDefs } from './columns'
import { AdminOrgan152Service } from './service'
import { EndDatePicker } from '../../components/range-date-picker'
import { GenericTable } from '@/common/components'
import { ListView } from '@/common/views'
import { ViewModal } from './view-modal'
import { useLayout } from '@/common/layout'
import { useQuery } from '@tanstack/react-query'
import { useSettingsStore } from '@/common/features/settings'
import { useToggle } from '@/common/hooks/use-toggle'
import { useTranslation } from 'react-i18next'

export const AdminOrgan152Page = () => {
  const viewToggle = useToggle()
  const setLayout = useLayout()
  const defaultDate = useSettingsStore((state) => state.default_end_date)

  const [search] = useSearchFilter()
  const [selected, setSelected] = useState<AdminOrgan152 | null>(null)
  const [to, setTo] = useState(defaultDate)

  const { t } = useTranslation(['app'])

  const {
    data: regions,
    isFetching,
    refetch
  } = useQuery({
    queryKey: [AdminOrgan152Service.QueryKeys.GetAll, { to, search }],
    queryFn: AdminOrgan152Service.getAll
  })

  const handleClickRow = (row: AdminOrgan152) => {
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
          columnDefs={AdminOrgan152RegionColumnDefs}
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
