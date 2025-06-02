import type { AdminPodotchet } from './interfaces'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { DatePicker, GenericTable } from '@/common/components'
import { useLocationState } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { ListView } from '@/common/views'

import { AdminPodotchetRegionColumnDefs } from './columns'
import { AdminPodotchetService } from './service'
import { ViewModal } from './view-modal'

export const AdminPodotchetPage = () => {
  const viewToggle = useToggle()
  const setLayout = useLayout()

  const [selected, setSelected] = useState<AdminPodotchet | null>(null)
  const [to, setTo] = useLocationState<string>('to', formatDate(new Date()))

  const { t } = useTranslation(['app'])

  const { data: regions, isFetching } = useQuery({
    queryKey: [AdminPodotchetService.QueryKeys.GetAll, { to }],
    queryFn: AdminPodotchetService.getAll
  })

  const handleClickRow = (row: AdminPodotchet) => {
    setSelected(row)
    viewToggle.open()
  }

  useEffect(() => {
    setLayout({
      title: t('pages.podotchet'),
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
          columnDefs={AdminPodotchetRegionColumnDefs}
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
