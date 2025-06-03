import type { AdminKassa } from './interfaces'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { DatePicker, GenericTable } from '@/common/components'
import {
  SearchFilterDebounced,
  useSearchFilter
} from '@/common/features/filters/search/search-filter-debounced'
import { useLocationState } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { ListView } from '@/common/views'

import { AdminKassaRegionColumnDefs } from './columns'
import { AdminKassaService } from './service'
import { ViewModal } from './view-modal'

export const AdminKassaPage = () => {
  const viewToggle = useToggle()
  const setLayout = useLayout()

  const [search] = useSearchFilter()
  const [selected, setSelected] = useState<AdminKassa | null>(null)
  const [to, setTo] = useLocationState<string>('to', formatDate(new Date()))

  const { t } = useTranslation(['app'])

  const { data: regions, isFetching } = useQuery({
    queryKey: [AdminKassaService.QueryKeys.GetAll, { to, search }],
    queryFn: AdminKassaService.getAll
  })

  const handleClickRow = (row: AdminKassa) => {
    setSelected(row)
    viewToggle.open()
  }

  useEffect(() => {
    setLayout({
      title: t('pages.kassa'),
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
          columnDefs={AdminKassaRegionColumnDefs}
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
