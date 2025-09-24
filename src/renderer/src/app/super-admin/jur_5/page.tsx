import type { AdminZarplataDashboard } from '@/common/models'

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
import { formatLocaleDate } from '@/common/lib/format'
import { ListView } from '@/common/views'

import { EndDatePicker } from '../components/end-date-picker'
import { AdminZarplataDashboardColumnsDefs } from './columns'
import { AdminZarplataDashboardService } from './service'
import { ViewModal } from './view-modal'

const AdminPodotchetPage = () => {
  const setLayout = useLayout()
  const docsViewToggle = useToggle()
  const defaultDate = useSettingsStore((state) => state.default_end_date)

  const [search] = useSearchFilter()
  const [selected, setSelected] = useState<AdminZarplataDashboard | null>(null)

  const [to, setTo] = useState(defaultDate)

  const from = formatDate(getFirstDayOfMonth(parseDate(to)))

  const { t } = useTranslation(['app'])

  const {
    data: regions,
    isFetching,
    refetch
  } = useQuery({
    queryKey: [
      AdminZarplataDashboardService.QueryKeys.GetAll,
      {
        from: formatLocaleDate(from),
        to: formatLocaleDate(to),
        search
      }
    ],
    queryFn: AdminZarplataDashboardService.getAll
  })

  const handleClickRow = (row: AdminZarplataDashboard) => {
    setSelected(row)
    docsViewToggle.open()
  }

  useEffect(() => {
    refetch()
  }, [refetch])
  useEffect(() => {
    setLayout({
      title: t('pages.podotchet'),
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
      </ListView.Header>
      <ListView.Content isLoading={isFetching}>
        <GenericTable
          data={regions?.data ?? []}
          columnDefs={AdminZarplataDashboardColumnsDefs}
          onClickRow={handleClickRow}
          footer={
            <FooterRow className="sticky bottom-0">
              <FooterCell
                colSpan={3}
                title={t('total')}
                content={<SummaCell summa={regions?.meta?.totalUderjanie ?? 0} />}
              />
            </FooterRow>
          }
        />
      </ListView.Content>

      <ViewModal
        selected={selected}
        isOpen={docsViewToggle.isOpen}
        onOpenChange={docsViewToggle.setOpen}
      />
    </ListView>
  )
}

export default AdminPodotchetPage
