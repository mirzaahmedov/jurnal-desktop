import type { AdminOrgan159 } from './interfaces'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { DatePicker, GenericTable } from '@/common/components'
import { useLocationState } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { ListView } from '@/common/views'

import { AdminOrgan159RegionColumnDefs } from './columns'
import { AdminOrgan159Service } from './service'
import { ViewModal } from './view-modal'

export const AdminOrgan159Page = () => {
  const viewToggle = useToggle()
  const setLayout = useLayout()

  const [selected, setSelected] = useState<AdminOrgan159 | null>(null)
  const [to, setTo] = useLocationState<string>('to', formatDate(new Date()))

  const { t } = useTranslation(['app'])

  const { data: regions, isFetching } = useQuery({
    queryKey: [AdminOrgan159Service.QueryKeys.GetAll, { to }],
    queryFn: AdminOrgan159Service.getAll
  })

  const handleClickRow = (row: AdminOrgan159) => {
    setSelected(row)
    viewToggle.open()
  }

  useEffect(() => {
    setLayout({
      title: t('pages.organization'),
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
          columnDefs={AdminOrgan159RegionColumnDefs}
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
