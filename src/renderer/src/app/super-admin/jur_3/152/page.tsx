import { DatePicker, GenericTable } from '@/common/components'
import { useEffect, useState } from 'react'

import type { AdminOrgan152 } from './interfaces'
import { AdminOrgan152RegionColumnDefs } from './columns'
import { AdminOrgan152Service } from './service'
import { ListView } from '@/common/views'
import { SearchFilterDebounced } from '@/common/features/filters/search/search-filter-debounced'
import { ViewModal } from './view-modal'
import { formatDate } from '@/common/lib/date'
import { useLayout } from '@/common/layout'
import { useLocationState } from '@/common/hooks'
import { useQuery } from '@tanstack/react-query'
import { useSearchFilter } from '@/common/features/filters/search/search-filter-debounced'
import { useToggle } from '@/common/hooks/use-toggle'
import { useTranslation } from 'react-i18next'

export const AdminOrgan152Page = () => {
  const viewToggle = useToggle()
  const setLayout = useLayout()

  const [search] = useSearchFilter()
  const [selected, setSelected] = useState<AdminOrgan152 | null>(null)
  const [to, setTo] = useLocationState<string>('to', formatDate(new Date()))

  const { t } = useTranslation(['app'])

  const { data: regions, isFetching } = useQuery({
    queryKey: [AdminOrgan152Service.QueryKeys.GetAll, { to, search }],
    queryFn: AdminOrgan152Service.getAll
  })

  const handleClickRow = (row: AdminOrgan152) => {
    setSelected(row)
    viewToggle.open()
  }

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
        <DatePicker
          value={to}
          onChange={setTo}
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
