import { useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { GenericTable } from '@/common/components'
import { useToggle } from '@/common/hooks'
import { useLayout } from '@/common/layout'
import { ListView } from '@/common/views'

import { columnDefs } from './column-defs'
import { MinimumWageEditModal } from './edit-modal'
import { type MinimumWage, MinimumWageService } from './service'

const MinimumWagePage = () => {
  const modalToggle = useToggle()
  const setLayout = useLayout()

  const [selected, setSelected] = useState<MinimumWage | null>(null)

  const { t } = useTranslation(['app'])

  const { data: minimumWage, isFetching } = useQuery({
    queryKey: [MinimumWageService.QueryKeys.GetWage],
    queryFn: MinimumWageService.getWage
  })

  useEffect(() => {
    setLayout({
      title: t('pages.bhm'),
      breadcrumbs: [
        {
          title: t('pages.admin')
        },
        {
          title: t('pages.spravochnik')
        }
      ]
    })
  }, [setLayout, t])

  return (
    <ListView>
      <ListView.Content loading={isFetching}>
        <GenericTable
          data={minimumWage?.data ? [minimumWage?.data] : []}
          columnDefs={columnDefs}
          onEdit={(row) => {
            setSelected(row)
            modalToggle.open()
          }}
        />
      </ListView.Content>
      <MinimumWageEditModal
        selected={selected}
        isOpen={modalToggle.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null)
          }
          modalToggle.setOpen(open)
        }}
      />
    </ListView>
  )
}

export default MinimumWagePage
