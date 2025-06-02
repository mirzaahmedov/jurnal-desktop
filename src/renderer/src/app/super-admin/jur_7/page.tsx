import type { AdminMaterial } from './interfaces'

import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { DatePicker, GenericTable } from '@/common/components'
import { useLocationState } from '@/common/hooks'
import { useToggle } from '@/common/hooks/use-toggle'
import { useLayout } from '@/common/layout'
import { formatDate } from '@/common/lib/date'
import { ListView } from '@/common/views'

import { AdminMaterialRegionColumnDefs } from './columns'
import { AdminMaterialService } from './service'
import { ViewModal } from './view-modal'

export const AdminMaterialPage = () => {
  const viewToggle = useToggle()
  const setLayout = useLayout()

  const [selected, setSelected] = useState<AdminMaterial | null>(null)
  const [to, setTo] = useLocationState<string>('to', formatDate(new Date()))

  const { t } = useTranslation(['app'])

  const { data: regions, isFetching } = useQuery({
    queryKey: [AdminMaterialService.QueryKeys.GetAll, { to }],
    queryFn: AdminMaterialService.getAll
  })

  const handleClickRow = (row: AdminMaterial) => {
    setSelected(row)
    viewToggle.open()
  }

  useEffect(() => {
    setLayout({
      title: t('pages.material-warehouse'),
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
          columnDefs={AdminMaterialRegionColumnDefs}
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
